# Design: Client-Side Image Tool ("WebMoney" project)

> Status: Approved 2026-06-14. Next step: implementation plan via writing-plans skill.
> Source strategy docs: `SESSION_HANDOFF_utility_tools 06142026.md`, `Best 5 Utility niches to Clone.md`.

## Decisions locked during brainstorming

- **Timeline posture:** Slow burn. Optimize for a high-ceiling compounding asset built right, not speed-to-first-dollar. First revenue is realistically months out (SEO compounds month 5–7; monetization starts Stage 2 at ~10K visits/mo).
- **Validation route:** Free pass (Google Autocomplete + Trends) to shortlist, then DataForSEO (pay-as-you-go, ~a few dollars) for hard volume/difficulty/SERP confirmation.
- **Build scope:** One domain, one shared engine, homepage tool + 8–12 keyword-targeted pages at launch, built to expand cheaply.
- **Engine:** Hybrid lazy-loaded — native Canvas for common formats; WASM loaded only when HEIC/AVIF is needed.

## 1. What we're building — and the only reason it can win

A single-domain, **100% client-side** image **compress + convert + resize** tool. Files never leave the
visitor's browser. Launch the homepage tool plus 8–12 keyword-targeted pages sharing one engine.

**The defensible edge** (without this, it's a generic clone that won't rank against DR 75–90 incumbents):

- **Privacy:** "Your files never leave your device. No uploads, no servers, no storage." True (client-side),
  and a live wedge after the Nov 2025 jsonformatter/codebeautify credential-leak disclosure.
- **No friction:** no daily caps, no watermarks, no forced signup, no upload wait — attacking iLovePDF's
  ~25MB cap and Smallpdf's ~2-tasks/day limit.
- **Workflow:** batch multiple files + download-all-as-ZIP, which Squoosh (the UX benchmark) deliberately omits.
- **Speed/UX:** instant, clean, dark-mode-friendly.

## 2. Architecture

- **Next.js 14 (App Router) + TypeScript**, statically generated (SSG). Every tool page is prerendered HTML
  for SEO; the engine hydrates client-side. Zero server compute, zero per-use cost, deploys free on Vercel.
- **Data-driven pages:** one `tools.config.ts` defines each tool (slug, source format, target format, title,
  H1, FAQ, copy). A single `[slug]` route template renders any tool from that config. Adding page #13 = adding
  one config object, not a new page.
- **Hybrid engine:** native Canvas for JPG/PNG/WebP; lazy-loaded WASM (`jSquash`/`libheif`) fetched only when a
  visitor hits HEIC or AVIF.

## 3. Components (each independently testable)

| Unit | Responsibility | Depends on |
|---|---|---|
| `engine/` | Pure functions: decode → transform (convert/compress/resize) → encode. Format-agnostic interface. | Canvas, lazy WASM modules |
| `engine/loaders` | Lazy-load + cache WASM only when needed | dynamic import |
| `components/Dropzone` | File intake (drag/drop, picker, paste), validation | engine types |
| `components/ToolWorkspace` | Orchestrates UI: queue, options, progress, results, ZIP download | engine, Dropzone |
| `config/tools.config.ts` | Source of truth for all tool pages | — |
| `app/[slug]/page.tsx` | Renders any tool page from config (SSG + metadata + FAQ schema) | config, ToolWorkspace |
| `lib/seo` | Per-page title, meta, OpenGraph, JSON-LD FAQ/SoftwareApplication schema | config |

**Data flow:** Visitor drops files → Dropzone validates → ToolWorkspace calls engine **in a Web Worker** (so the
UI never freezes on big batches) → results rendered → individual or ZIP download. Nothing touches a network.

## 4. Anatomy of each tool page (this is the SEO product)

Every page = the working tool above the fold + below it: a keyword-targeted H1, a 2–3 sentence intro, a 3-step
"how to," a genuinely useful FAQ (with FAQ schema markup), and the privacy promise. This is what makes each page
rank rather than read as thin/templated spam.

## 5. Stage 0 research pipeline (a real deliverable)

Before locking the 8–12 pages, build + run:

- **Free pass:** scripts hitting Google Autocomplete + Google Trends (`pytrends`) to harvest and rank candidate
  format-pairs/specs by relative demand. Output: ranked shortlist CSV.
- **DataForSEO confirmation** (once a key is provided): real monthly volume, keyword difficulty, and live SERP for
  the shortlist, so we only build pages where the SERP includes beatable indie sites (DR < ~40). Output:
  `keyword-research.md` decision table.
- **Proceed gate:** ≥8–10 targets, combined ≥100K monthly searches, beatable SERPs. If it fails, pivot format
  pairs before building — not after.

## 6. Monetization-readiness (build the hooks, don't turn them on)

Launch is clean — no ads, no billing (ads earn ~$0 at zero traffic and hurt the Product Hunt launch + early UX).
But architect for it now: the engine's limits (batch size, output caps, watermark) live behind a single
`entitlements` abstraction, so the future Pro tier (Stripe) and ad slots (AdSense) bolt on without a rewrite.
Supabase/Stripe come in **Stage 2 at ~10K visits/mo**.

## 7. Repo & stack

`Next.js 14 · TypeScript · Tailwind · Vitest + Playwright · Vercel`. Client-side libs: `jSquash`/`libheif-wasm`
(lazy), `fflate` (ZIP). No backend, no DB, no auth at launch.

## 8. Testing

- **Unit (Vitest):** engine round-trips (PNG→JPG→PNG integrity, compression actually reduces bytes, resize
  dimensions correct, HEIC decode produces valid output).
- **E2E (Playwright):** drop file → convert → download works on a real page; batch + ZIP; lazy WASM loads only
  on HEIC.
- TDD on the engine (pure functions — ideal for test-first).

## 9. Open item (does not block building)

**Domain + brand name.** Build with a placeholder brand so coding isn't blocked; choose a domain before launch.
Target: short, brandable, hinting at fast/private image tools.

## 10. Build order (milestones)

1. Git + Next.js scaffold + CI (tests run on every push)
2. Stage 0 research pipeline → locked keyword list
3. Engine (TDD) — convert/compress/resize, native formats
4. Lazy WASM — HEIC/AVIF
5. ToolWorkspace UI + Dropzone + Web Worker + ZIP
6. Data-driven page template + SEO/schema
7. The 8–12 configured pages + homepage
8. Polish, Lighthouse pass, deploy to Vercel, Product Hunt launch prep

## 11. Risks / kill-criteria

- Stage 0 fails the proceed gate → pivot pairs before building.
- < 2K visits/mo by month 4 → SERP harder than estimated; pivot to easier format pairs.
- AI Overviews appear on the function keywords → double down on pure function tools.
- Honest reminder: first revenue is months out. The milestone list ends at "launched + indexed," not "earning."
