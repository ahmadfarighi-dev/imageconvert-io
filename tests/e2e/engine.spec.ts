import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

test.beforeEach(async ({ page }) => {
  await page.goto('/dev/engine-harness');
  await expect(page.getByTestId('engine-ready')).toBeVisible();
});

async function convertInBrowser(
  page: import('@playwright/test').Page,
  sourceType: string,
  opts: object,
) {
  return page.evaluate(
    async ({ sourceType, opts }) => {
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

test('PNG -> JPEG produces a jpeg of same dimensions', async ({ page }) => {
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
