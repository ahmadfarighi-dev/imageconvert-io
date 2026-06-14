# Foundation + Conversion Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Next.js app and build a fully-tested, client-side image conversion/compression/resize engine (the core all tool pages will share).

**Architecture:** Browser-native Canvas handles JPG/PNG/WebP decode+encode+resize with zero dependencies. WASM modules are lazy-loaded ONLY when needed: `heic-to` (libheif) for HEIC decode, `@jsquash/avif` for AVIF encode/decode. Pure algorithmic logic (format detection, dimension math, target-byte quality search) is isolated into Node-testable functions; the browser pipeline is verified with Playwright against real images. The engine runs in a Web Worker (added in Plan 2) but is authored as framework-agnostic functions here.

**Tech Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Vitest (Node unit tests) · Playwright (browser integration) · `heic-to` + `@jsquash/avif` (lazy WASM).

**This is Plan 1 of 3.** Plan 2 = UI + data-driven page system. Plan 3 = Stage 0 keyword research pipeline (Python).

---

## File Structure

| File | Responsibility |
|---|---|
| `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts` | Scaffold + WASM/build config |
| `.github/workflows/ci.yml` | Lint + typecheck + unit tests on every push |
| `src/engine/types.ts` | Shared engine types (formats, options, results) |
| `src/engine/detectFormat.ts` | Detect input format from magic bytes (pure) |
| `src/engine/calcDimensions.ts` | Compute output width/height from resize options (pure) |
| `src/engine/searchQuality.ts` | Binary-search encoder quality to hit a target byte size (pure, injected encoder) |
| `src/engine/decode.ts` | Decode any input → `ImageBitmap` (Canvas + lazy HEIC/AVIF) |
| `src/engine/encode.ts` | Encode an `ImageBitmap`/canvas → `Blob` (Canvas + lazy AVIF) |
| `src/engine/convertImage.ts` | Orchestrator: detect → decode → resize → encode (+ target-byte mode) |
| `src/engine/index.ts` | Public barrel export |
| `tests/unit/*.test.ts` | Vitest Node unit tests for pure logic |
| `tests/e2e/engine.spec.ts` | Playwright integration tests for the real pipeline |
| `src/app/dev/engine-harness/page.tsx` | Dev-only page exposing the engine on `window` for Playwright |
| `tests/fixtures/sample.heic` | One small real HEIC file (browsers can't synthesize HEIC) |

---

## Task 0: Scaffold Next.js + TypeScript + Tailwind

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Scaffold the app non-interactively**

Run (from repo root `C:\Users\Afarighi\WebMoney`):
```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --use-npm
```
If it refuses because the directory is non-empty, scaffold in a temp dir and move files in:
```bash
npx create-next-app@14 _scaffold --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --use-npm \
  && cp -r _scaffold/. . && rm -rf _scaffold
```
Expected: a `src/app` directory, `package.json`, `next.config.mjs`, Tailwind config present.

- [ ] **Step 2: Verify the dev build compiles**

Run:
```bash
npm run build
```
Expected: "Compiled successfully" with the default route prerendered.

- [ ] **Step 3: Install engine + test dependencies**

Run:
```bash
npm install heic-to @jsquash/avif
npm install -D vitest @playwright/test
npx playwright install --with-deps chromium
```
Expected: all install without errors.

- [ ] **Step 4: Add test scripts to package.json**

In `package.json`, add to the `"scripts"` object:
```json
"test:unit": "vitest run",
"test:unit:watch": "vitest",
"test:e2e": "playwright test",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 14 app with Tailwind, Vitest, Playwright"
```

---

## Task 1: Configure WASM build + Playwright + Vitest

**Files:**
- Modify: `next.config.mjs`
- Create: `vitest.config.ts`, `playwright.config.ts`

- [ ] **Step 1: Configure Next.js to handle lazy WASM imports**

Replace `next.config.mjs` with:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    // jSquash/heic-to ship .wasm fetched at runtime; don't let webpack choke on them
    config.module.rules.push({ test: /\.wasm$/, type: 'asset/resource' });
    return config;
  },
  // These packages are ESM with WASM; transpile them for the client bundle
  transpilePackages: ['@jsquash/avif', 'heic-to'],
};
export default nextConfig;
```

- [ ] **Step 2: Create Vitest config (Node environment, unit tests only)**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
});
```

- [ ] **Step 3: Create Playwright config**

Create `playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 4: Verify configs load**

Run:
```bash
npm run test:unit
```
Expected: Vitest runs and reports "No test files found" (no tests yet) — this confirms config loads without error.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: configure WASM build, Vitest, and Playwright"
```

---

## Task 2: Engine types

**Files:**
- Create: `src/engine/types.ts`

- [ ] **Step 1: Define the shared types**

Create `src/engine/types.ts`:
```ts
/** Formats the engine can OUTPUT (all browser-encodable, AVIF via WASM). */
export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'avif';

/** Formats the engine can INPUT (adds HEIC, decoded via lazy WASM). */
export type InputFormat = OutputFormat | 'heic' | 'unknown';

export interface ResizeOptions {
  /** Target width in px. If only one of width/height is set, aspect ratio is preserved. */
  width?: number;
  height?: number;
}

export interface ConvertOptions {
  to: OutputFormat;
  /** Lossy quality 0..1 (ignored for png). Default 0.82. */
  quality?: number;
  resize?: ResizeOptions;
  /** If set, the engine searches quality to land at or under this many bytes (lossy formats only). */
  targetBytes?: number;
}

export interface ConvertResult {
  blob: Blob;
  width: number;
  height: number;
  bytes: number;
  format: OutputFormat;
}
```

- [ ] **Step 2: Typecheck**

Run:
```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/engine/types.ts
git commit -m "feat(engine): add shared engine types"
```

---

## Task 3: Format detection from magic bytes (pure, TDD)

**Files:**
- Create: `tests/unit/detectFormat.test.ts`
- Create: `src/engine/detectFormat.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/detectFormat.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { detectFormat } from '@/engine/detectFormat';

function bytes(...b: number[]): ArrayBuffer {
  return new Uint8Array(b).buffer;
}

describe('detectFormat', () => {
  it('detects PNG from its 8-byte signature', () => {
    expect(detectFormat(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe('png');
  });
  it('detects JPEG from FF D8 FF', () => {
    expect(detectFormat(bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0))).toBe('jpeg');
  });
  it('detects WebP from RIFF....WEBP', () => {
    // R I F F <size×4> W E B P
    expect(detectFormat(bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50))).toBe('webp');
  });
  it('detects AVIF from ftyp box brand "avif"', () => {
    // 4 bytes box size, "ftyp", "avif"
    expect(detectFormat(bytes(0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66))).toBe('avif');
  });
  it('detects HEIC from ftyp box brand "heic"', () => {
    expect(detectFormat(bytes(0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63))).toBe('heic');
  });
  it('returns unknown for unrecognized bytes', () => {
    expect(detectFormat(bytes(0, 1, 2, 3, 4, 5, 6, 7))).toBe('unknown');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run:
```bash
npm run test:unit -- detectFormat
```
Expected: FAIL — "Cannot find module '@/engine/detectFormat'".

- [ ] **Step 3: Implement detectFormat**

Create `src/engine/detectFormat.ts`:
```ts
import type { InputFormat } from './types';

/** Detect image format by inspecting magic bytes. Reads only the header. */
export function detectFormat(buffer: ArrayBuffer): InputFormat {
  const b = new Uint8Array(buffer);
  if (b.length < 12) return 'unknown';

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';

  // JPEG: FF D8 FF
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';

  // WebP: "RIFF"...."WEBP"
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'webp';

  // ISO-BMFF (HEIC/AVIF): bytes 4-7 are "ftyp", brand at bytes 8-11
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
    const brand = String.fromCharCode(b[8], b[9], b[10], b[11]);
    if (brand === 'avif' || brand === 'avis') return 'avif';
    if (brand === 'heic' || brand === 'heix' || brand === 'heif' || brand === 'mif1') return 'heic';
  }

  return 'unknown';
}
```

- [ ] **Step 4: Run to verify it passes**

Run:
```bash
npm run test:unit -- detectFormat
```
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/unit/detectFormat.test.ts src/engine/detectFormat.ts
git commit -m "feat(engine): detect input format from magic bytes"
```

---

## Task 4: Resize dimension calculation (pure, TDD)

**Files:**
- Create: `tests/unit/calcDimensions.test.ts`
- Create: `src/engine/calcDimensions.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/calcDimensions.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { calcDimensions } from '@/engine/calcDimensions';

describe('calcDimensions', () => {
  it('returns source dims when no resize requested', () => {
    expect(calcDimensions(800, 600, undefined)).toEqual({ width: 800, height: 600 });
  });
  it('scales height to preserve aspect when only width given', () => {
    expect(calcDimensions(800, 600, { width: 400 })).toEqual({ width: 400, height: 300 });
  });
  it('scales width to preserve aspect when only height given', () => {
    expect(calcDimensions(800, 600, { height: 300 })).toEqual({ width: 400, height: 300 });
  });
  it('uses both when both given (may distort)', () => {
    expect(calcDimensions(800, 600, { width: 100, height: 100 })).toEqual({ width: 100, height: 100 });
  });
  it('never returns less than 1px and rounds to integers', () => {
    expect(calcDimensions(800, 600, { width: 1 })).toEqual({ width: 1, height: 1 });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run:
```bash
npm run test:unit -- calcDimensions
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement calcDimensions**

Create `src/engine/calcDimensions.ts`:
```ts
import type { ResizeOptions } from './types';

export function calcDimensions(
  srcW: number,
  srcH: number,
  resize: ResizeOptions | undefined,
): { width: number; height: number } {
  if (!resize || (resize.width == null && resize.height == null)) {
    return { width: srcW, height: srcH };
  }
  let width = resize.width;
  let height = resize.height;
  if (width != null && height == null) {
    height = Math.round((width / srcW) * srcH);
  } else if (height != null && width == null) {
    width = Math.round((height / srcH) * srcW);
  }
  return {
    width: Math.max(1, Math.round(width as number)),
    height: Math.max(1, Math.round(height as number)),
  };
}
```

- [ ] **Step 4: Run to verify it passes**

Run:
```bash
npm run test:unit -- calcDimensions
```
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/unit/calcDimensions.test.ts src/engine/calcDimensions.ts
git commit -m "feat(engine): compute resize dimensions preserving aspect ratio"
```

---

## Task 5: Target-byte quality search (pure, TDD)

This powers the "compress image to 20kb/50kb/100kb" keyword pages. It binary-searches quality using an **injected** encoder function, so it's fully testable in Node without a browser.

**Files:**
- Create: `tests/unit/searchQuality.test.ts`
- Create: `src/engine/searchQuality.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/searchQuality.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { searchQuality } from '@/engine/searchQuality';

// Fake encoder: output bytes scale linearly with quality (10kB at q=0 .. 110kB at q=1).
const fakeEncode = async (quality: number): Promise<number> =>
  Math.round(10_000 + quality * 100_000);

describe('searchQuality', () => {
  it('finds a quality whose size is at or under the target', async () => {
    const { quality, bytes } = await searchQuality(fakeEncode, 50_000);
    expect(bytes).toBeLessThanOrEqual(50_000);
    expect(quality).toBeGreaterThanOrEqual(0);
    expect(quality).toBeLessThanOrEqual(1);
  });
  it('returns the lowest-quality result when even q=0 exceeds target', async () => {
    const { quality, bytes } = await searchQuality(fakeEncode, 5_000);
    expect(quality).toBe(0);
    expect(bytes).toBe(10_000); // best we can do
  });
  it('returns max quality when even q=1 is under target', async () => {
    const { quality } = await searchQuality(fakeEncode, 999_999);
    expect(quality).toBe(1);
  });
  it('converges within the iteration budget', async () => {
    let calls = 0;
    const counting = async (q: number) => { calls++; return fakeEncode(q); };
    await searchQuality(counting, 50_000);
    expect(calls).toBeLessThanOrEqual(9); // 1 (q=1 probe) + up to 8 bisections
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run:
```bash
npm run test:unit -- searchQuality
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement searchQuality**

Create `src/engine/searchQuality.ts`:
```ts
/**
 * Binary-search encoder quality (0..1) to produce output <= targetBytes.
 * `encode(quality)` must return the resulting byte size for that quality.
 * Returns the best quality whose size is <= target (or q=0 if even minimum exceeds it).
 */
export async function searchQuality(
  encode: (quality: number) => Promise<number>,
  targetBytes: number,
  iterations = 8,
): Promise<{ quality: number; bytes: number }> {
  // If max quality already fits, take it.
  const maxBytes = await encode(1);
  if (maxBytes <= targetBytes) return { quality: 1, bytes: maxBytes };

  // If min quality still too big, return the smallest we can produce.
  const minBytes = await encode(0);
  if (minBytes > targetBytes) return { quality: 0, bytes: minBytes };

  let lo = 0;
  let hi = 1;
  let best = { quality: 0, bytes: minBytes };
  for (let i = 0; i < iterations; i++) {
    const mid = (lo + hi) / 2;
    const bytes = await encode(mid);
    if (bytes <= targetBytes) {
      best = { quality: mid, bytes };
      lo = mid; // try higher quality
    } else {
      hi = mid; // need smaller
    }
  }
  return best;
}
```

- [ ] **Step 4: Run to verify it passes**

Run:
```bash
npm run test:unit -- searchQuality
```
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/unit/searchQuality.test.ts src/engine/searchQuality.ts
git commit -m "feat(engine): binary-search quality to hit a target byte size"
```

---

## Task 6: Browser decode (Canvas + lazy HEIC/AVIF)

Browser-dependent: uses `createImageBitmap` and lazy WASM. Verified via Playwright (Task 9), not Vitest.

**Files:**
- Create: `src/engine/decode.ts`

- [ ] **Step 1: Implement decode**

Create `src/engine/decode.ts`:
```ts
import { detectFormat } from './detectFormat';

/**
 * Decode any supported image (incl. HEIC/AVIF) into an ImageBitmap.
 * Native formats use the browser directly; HEIC and AVIF lazy-load WASM only when needed.
 */
export async function decodeToBitmap(file: Blob): Promise<ImageBitmap> {
  const header = await file.slice(0, 16).arrayBuffer();
  const format = detectFormat(header);

  if (format === 'heic') {
    // Lazy-load libheif WASM only for HEIC inputs.
    const { heicTo } = await import('heic-to');
    const pngBlob = await heicTo({ blob: file, type: 'image/png', quality: 1 });
    return createImageBitmap(pngBlob);
  }

  try {
    // Modern browsers decode JPEG/PNG/WebP/AVIF natively here.
    return await createImageBitmap(file);
  } catch (err) {
    if (format === 'avif') {
      // Fallback: decode AVIF via WASM for browsers lacking native AVIF decode.
      const { decode } = await import('@jsquash/avif');
      const imageData = await decode(await file.arrayBuffer());
      return createImageBitmap(imageData);
    }
    throw err;
  }
}
```

- [ ] **Step 2: Typecheck**

Run:
```bash
npm run typecheck
```
Expected: no errors. (Browser DOM types `ImageBitmap`/`createImageBitmap` are available via the default `lib: ["dom"]` in the Next.js tsconfig.)

- [ ] **Step 3: Commit**

```bash
git add src/engine/decode.ts
git commit -m "feat(engine): decode images to ImageBitmap with lazy HEIC/AVIF"
```

---

## Task 7: Browser encode (Canvas + lazy AVIF)

**Files:**
- Create: `src/engine/encode.ts`

- [ ] **Step 1: Implement encode**

Create `src/engine/encode.ts`:
```ts
import type { OutputFormat } from './types';

const MIME: Record<Exclude<OutputFormat, 'avif'>, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

/**
 * Draw an ImageBitmap onto an OffscreenCanvas at the given size and encode to a Blob.
 * JPEG/PNG/WebP use the browser encoder; AVIF lazy-loads @jsquash/avif for reliable cross-browser output.
 */
export async function encodeBitmap(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  format: OutputFormat,
  quality: number,
): Promise<Blob> {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');
  ctx.drawImage(bitmap, 0, 0, width, height);

  if (format === 'avif') {
    const { encode } = await import('@jsquash/avif');
    const imageData = ctx.getImageData(0, 0, width, height);
    // @jsquash quality is 0..100; our quality is 0..1.
    const buf = await encode(imageData, { quality: Math.round(quality * 100) });
    return new Blob([buf], { type: 'image/avif' });
  }

  return canvas.convertToBlob({ type: MIME[format], quality });
}
```

- [ ] **Step 2: Typecheck**

Run:
```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/engine/encode.ts
git commit -m "feat(engine): encode bitmaps via Canvas with lazy AVIF"
```

---

## Task 8: convertImage orchestrator

**Files:**
- Create: `src/engine/convertImage.ts`
- Create: `src/engine/index.ts`

- [ ] **Step 1: Implement convertImage**

Create `src/engine/convertImage.ts`:
```ts
import type { ConvertOptions, ConvertResult } from './types';
import { decodeToBitmap } from './decode';
import { encodeBitmap } from './encode';
import { calcDimensions } from './calcDimensions';
import { searchQuality } from './searchQuality';

const DEFAULT_QUALITY = 0.82;

/** Convert/compress/resize a single image entirely client-side. */
export async function convertImage(file: Blob, opts: ConvertOptions): Promise<ConvertResult> {
  const bitmap = await decodeToBitmap(file);
  const { width, height } = calcDimensions(bitmap.width, bitmap.height, opts.resize);
  const quality = opts.quality ?? DEFAULT_QUALITY;

  let blob: Blob;
  if (opts.targetBytes != null && opts.to !== 'png') {
    const { quality: q } = await searchQuality(
      async (probe) => (await encodeBitmap(bitmap, width, height, opts.to, probe)).size,
      opts.targetBytes,
    );
    blob = await encodeBitmap(bitmap, width, height, opts.to, q);
  } else {
    blob = await encodeBitmap(bitmap, width, height, opts.to, quality);
  }

  bitmap.close();
  return { blob, width, height, bytes: blob.size, format: opts.to };
}
```

- [ ] **Step 2: Create the public barrel export**

Create `src/engine/index.ts`:
```ts
export { convertImage } from './convertImage';
export { detectFormat } from './detectFormat';
export type { OutputFormat, InputFormat, ConvertOptions, ConvertResult, ResizeOptions } from './types';
```

- [ ] **Step 3: Typecheck**

Run:
```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/engine/convertImage.ts src/engine/index.ts
git commit -m "feat(engine): orchestrate detect/decode/resize/encode with target-byte mode"
```

---

## Task 9: Browser integration tests (Playwright)

Verify the real pipeline against real images. JPEG/PNG/WebP fixtures are generated in-browser (Canvas) so no binary files are needed; HEIC needs one committed sample.

**Files:**
- Create: `src/app/dev/engine-harness/page.tsx`
- Create: `tests/e2e/engine.spec.ts`
- Add: `tests/fixtures/sample.heic`

- [ ] **Step 1: Create the dev harness page that exposes the engine**

Create `src/app/dev/engine-harness/page.tsx`:
```tsx
'use client';
import { useEffect } from 'react';
import { convertImage } from '@/engine';

// Dev-only page: exposes the engine on window so Playwright can drive it in a real browser.
export default function EngineHarness() {
  useEffect(() => {
    (window as unknown as { __convertImage: typeof convertImage }).__convertImage = convertImage;
  }, []);
  return <div data-testid="engine-ready">engine harness</div>;
}
```

- [ ] **Step 2: Add a real HEIC fixture**

HEIC cannot be synthesized in a browser, so commit one small sample:
```bash
mkdir -p tests/fixtures
# Use any small real HEIC (e.g. an iPhone photo exported as HEIC, downscaled <100KB),
# OR fetch a public sample, then verify it is real HEIC:
curl -L -o tests/fixtures/sample.heic https://github.com/strukturag/libheif/raw/master/examples/example.heic
```
Verify it is HEIC (first bytes contain `ftyp...heic`):
```bash
xxd tests/fixtures/sample.heic | head -1
```
Expected: bytes show `ftypheic` (or `heix`/`mif1`). If the URL is unavailable, substitute any small real `.heic` file at that path.

- [ ] **Step 3: Write the failing E2E test**

Create `tests/e2e/engine.spec.ts`:
```ts
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

test.beforeEach(async ({ page }) => {
  await page.goto('/dev/engine-harness');
  await expect(page.getByTestId('engine-ready')).toBeVisible();
});

// Helper: build a PNG/JPEG/WebP File in-browser, run convertImage, return result metadata.
async function convertInBrowser(
  page: import('@playwright/test').Page,
  sourceType: string,
  opts: object,
) {
  return page.evaluate(
    async ({ sourceType, opts }) => {
      // Draw a 64x48 test image and export it as the requested source type.
      const c = document.createElement('canvas');
      c.width = 64; c.height = 48;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#3366cc'; ctx.fillRect(0, 0, 64, 48);
      ctx.fillStyle = '#ffaa00'; ctx.fillRect(10, 10, 30, 20);
      const srcBlob: Blob = await new Promise((res) => c.toBlob((b) => res(b!), sourceType));
      const conv = (window as any).__convertImage;
      const r = await conv(srcBlob, opts);
      return { bytes: r.bytes, width: r.width, height: r.height, format: r.format, type: r.blob.type };
    },
    { sourceType, opts },
  );
}

test('PNG -> JPEG produces a smaller jpeg of same dimensions', async ({ page }) => {
  const r = await convertInBrowser(page, 'image/png', { to: 'jpeg', quality: 0.8 });
  expect(r.format).toBe('jpeg');
  expect(r.type).toBe('image/jpeg');
  expect(r.width).toBe(64);
  expect(r.height).toBe(48);
  expect(r.bytes).toBeGreaterThan(0);
});

test('JPEG -> WebP works', async ({ page }) => {
  const r = await convertInBrowser(page, 'image/jpeg', { to: 'webp', quality: 0.8 });
  expect(r.type).toBe('image/webp');
});

test('resize to width 32 preserves aspect ratio (32x24)', async ({ page }) => {
  const r = await convertInBrowser(page, 'image/png', { to: 'jpeg', resize: { width: 32 } });
  expect(r.width).toBe(32);
  expect(r.height).toBe(24);
});

test('targetBytes compresses under the budget', async ({ page }) => {
  const r = await convertInBrowser(page, 'image/png', { to: 'jpeg', targetBytes: 1500 });
  expect(r.bytes).toBeLessThanOrEqual(1500);
});

test('PNG -> AVIF (lazy WASM) produces an avif blob', async ({ page }) => {
  const r = await convertInBrowser(page, 'image/png', { to: 'avif', quality: 0.5 });
  expect(r.type).toBe('image/avif');
  expect(r.bytes).toBeGreaterThan(0);
});

test('HEIC -> JPEG (lazy libheif) decodes the committed sample', async ({ page }) => {
  const heic = readFileSync(path.join(process.cwd(), 'tests/fixtures/sample.heic'));
  const r = await page.evaluate(async (b64) => {
    const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const blob = new Blob([bin], { type: 'image/heic' });
    const conv = (window as any).__convertImage;
    const out = await conv(blob, { to: 'jpeg', quality: 0.8 });
    return { type: out.blob.type, bytes: out.bytes, width: out.width };
  }, heic.toString('base64'));
  expect(r.type).toBe('image/jpeg');
  expect(r.bytes).toBeGreaterThan(0);
  expect(r.width).toBeGreaterThan(0);
});
```

- [ ] **Step 4: Run the E2E suite**

Run:
```bash
npm run test:e2e
```
Expected: all 6 tests PASS. The dev server is auto-started by Playwright's `webServer` config. (First run downloads/compiles the AVIF + HEIC WASM on demand — allow extra time.)

- [ ] **Step 5: Commit**

```bash
git add src/app/dev/engine-harness/page.tsx tests/e2e/engine.spec.ts tests/fixtures/sample.heic
git commit -m "test(engine): Playwright integration tests for full conversion pipeline"
```

---

## Task 10: CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create the CI workflow**

Create `.github/workflows/ci.yml`:
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test:unit
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

- [ ] **Step 2: Verify the whole suite locally before pushing**

Run:
```bash
npm run typecheck && npm run lint && npm run test:unit && npm run test:e2e && npm run build
```
Expected: all pass, build compiles.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: run typecheck, lint, unit, and e2e on every push"
```

---

## Self-Review Notes (author)

- **Spec coverage:** Engine (compress/convert/resize) ✓ Task 8; hybrid Canvas + lazy WASM ✓ Tasks 6–7; HEIC/AVIF ✓ Tasks 6,7,9; "compress to X kb" target-byte mode ✓ Task 5; SSG scaffold + CI ✓ Tasks 0,10; TDD on pure logic ✓ Tasks 3–5; testing strategy ✓ Tasks 3–5,9. UI/Dropzone/ZIP/Web Worker and the data-driven page system are intentionally **deferred to Plan 2**. Keyword research pipeline is **Plan 3**.
- **Type consistency:** `convertImage`, `detectFormat`, `decodeToBitmap`, `encodeBitmap`, `calcDimensions`, `searchQuality`, and the `OutputFormat`/`ConvertOptions`/`ConvertResult` types are used identically across tasks.
- **Known runtime risk to watch during execution:** Next.js + WASM bundling occasionally needs tweaks beyond `next.config.mjs` (e.g. serving `.wasm` from the lazy chunk). Task 9 is the canary — if AVIF/HEIC tests fail to load WASM, adjust `next.config.mjs` (asset/resource path or `optimizeDeps`-style exclude) before moving on. This is expected integration work, not a design flaw.
```
