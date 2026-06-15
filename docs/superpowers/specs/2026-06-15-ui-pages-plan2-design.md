# Plan 2 — UI & Pages Design Spec
_imageconvert.io (brand name TBD) · 2026-06-15_

## Overview

Build the full public-facing website for the client-side image converter product. This covers the homepage hub, 7 converter tool pages, and 2 "What is X?" guide pages — 10 pages total forming the HEIC + AVIF topical authority cluster.

The engine (Plan 1) is already built and tested. Plan 2 wires it to real pages, real URLs, and real content so Google can find it.

---

## Design System

### Color Tokens

| Token | Value | Use |
|---|---|---|
| `--cream` | `#FFFDF7` | Page background |
| `--cream-border` | `#F0EBE0` | Dividers, card borders |
| `--teal-50` | `#F0FDFA` | Hover fills, badge bg |
| `--teal-100` | `#CCFBF1` | Active fills, badge borders |
| `--teal-300` | `#5EEAD4` | Drop zone dashed border |
| `--teal-500` | `#14B8A6` | Accent dots, secondary icons |
| `--teal-600` | `#0D9488` | Primary action color |
| `--teal-700` | `#0F766E` | Primary hover, Pro banner gradient end |
| `--text-900` | `#1C2B2D` | Headings, primary text |
| `--text-600` | `#475569` | Body text, nav links |
| `--text-400` | `#94A3B8` | Captions, footer, muted |
| `--white` | `#FFFFFF` | Card backgrounds, nav |

AVIF cluster accent: `#7C3AED` (violet-700) with `#F5F3FF` / `#EDE9FE` fills — visually distinguishes the two format families on the homepage.

### Typography

**Font:** `Plus Jakarta Sans` (Google Fonts) — rounded, friendly, professional.

| Role | Size | Weight | Use |
|---|---|---|---|
| Display | 34px | 800 | Homepage H1 |
| Heading | 30px | 800 | Tool page H1 |
| Section | 20–18px | 800 | Section headings |
| Body | 15–14px | 400–500 | Paragraphs, subtitles |
| Label | 13–12px | 600–700 | Cards, badges, nav |
| Caption | 11–10px | 400–600 | Meta, footer, volume badges |

Line height: 1.5–1.65 for body. Letter spacing: −0.3px to −0.8px on headings for tightness.

### Spacing (8px rhythm)

`4 / 8 / 10 / 12 / 14 / 16 / 20 / 24 / 28 / 32 / 36 / 40 / 52px`

### Border Radius Scale

| Name | Value | Use |
|---|---|---|
| `--radius-sm` | 8px | Buttons, tags, file badges |
| `--radius-md` | 12px | Cards, file rows, FAQ items |
| `--radius-lg` | 18px | Drop zone |
| `--radius-xl` | 24px | Drop zone outer |

### Shadow Scale

| Name | Value | Use |
|---|---|---|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,.06)` | Cards, file rows |
| `shadow-md` | `0 4px 12px rgba(0,0,0,.08)` | Drop zone icon |
| `shadow-teal` | `0 6px 20px rgba(13,148,136,.18)` | Primary CTA buttons, Pro banner |

### Icons

SVG only — no emoji as UI elements. Style: 1.2–1.5px stroke, rounded caps, teal-600 fill/stroke on light surfaces, white on teal surfaces. Lucide icon family is the reference for visual consistency.

---

## Page Inventory (10 pages)

### Cluster 1 — HEIC (iPhone Photos)

| Route | Title | Monthly Volume | KD |
|---|---|---|---|
| `/heic-to-jpg` | Convert HEIC to JPG | ~110K | Low |
| `/heic-to-png` | Convert HEIC to PNG | ~28K | Low |
| `/heic-to-webp` | Convert HEIC to WebP | ~8K | Low |
| `/heic-to-avif` | Convert HEIC to AVIF | ~3K | Low |
| `/what-is-heic` | What is HEIC? | ~22K | Low |

### Cluster 2 — AVIF (Next-Gen Web)

| Route | Title | Monthly Volume | KD |
|---|---|---|---|
| `/avif-to-jpg` | Convert AVIF to JPG | ~14K | Low |
| `/avif-to-png` | Convert AVIF to PNG | ~7K | Low |
| `/what-is-avif` | What is AVIF? | ~18K | Low |

### Hub

| Route | Title | Notes |
|---|---|---|
| `/` | Homepage | Hub for both clusters, brand intro |

**Total addressable volume: ~210K searches/month** across these 10 pages.

---

## Component Library

### Navigation Bar

- Logo: icon (2×2 grid of rounded squares, teal-600) + wordmark `image` + `convert` (teal accent)
- Nav links: HEIC ▾ (dropdown), AVIF ▾ (dropdown), Compress, Resize — 13px medium weight
- CTA chip: "Pro" — teal-50 bg, teal-600 text, teal-100 border
- Mobile: hamburger collapses to drawer (Phase 2 — not in Plan 2 scope)
- Sticky on scroll, white background, cream-border bottom

### Drop Zone

- Dashed teal-300 border, 2px, radius-xl
- Background: teal-50, hover → teal-100 + teal shadow
- Icon: upload arrow SVG in white card (shadow-md)
- Title 16px/700, sub 13px/400
- Primary CTA button: teal-600 filled, "Choose HEIC Files" (label varies per tool)
- Accepted formats note: 11px caption
- Hover state: border → teal-600, bg → teal-100, box-shadow appears

### File Results Row

Three states: processing (skeleton shimmer), done (badge + save button), error (red border + retry).

Done state anatomy:
- Thumbnail (36×36, teal-50 bg, 8px radius, SVG photo icon)
- File name (13px/700, truncated with ellipsis)
- Meta: `4.1 MB → 1.2 MB · 3024×4032` (11px/400)
- Status badge: teal-50 bg, teal-100 border, checkmark + format label
- Save button: teal-300 border, teal-600 text, 12px/600

### Action Row (below file list)

- "Download All as ZIP" — teal-600 filled, flex:1, primary CTA
- "More files" — white bg, cream-border, secondary, icon + label
- Savings note below: `Saved X MB total · Pro removes the 10-file limit` (11px, teal accent on "Pro")

### Tool Cards (homepage grid)

- White card, cream-border, radius-md, shadow-sm
- Icon in teal-50 box (36×36)
- Name: 13px/800
- Desc: 11px/400 muted
- Volume badge: 10px/600 teal, teal-50 bg, pill shape
- Hover: border → teal-300, box-shadow, −2px translateY

### Pro Banner

- Linear gradient: teal-600 → teal-700
- "Pro · Coming soon" eyebrow (10px/800, white 70%)
- Title: "Need more? Upgrade to Pro." (17px/800 white)
- Feature pills: ✓ Unlimited files · ✓ No size cap · ✓ API access
- CTA button: white bg, teal-700 text — "Get notified →"
- box-shadow: shadow-teal

### Trust Pills (hero area)

Row of 4: `✓ 100% private`, `✓ No uploads`, `✓ No signup`, `✓ Batch free up to 10`
12px/500, teal-600 checkmark, text-600 label.

---

## Page Anatomy

### Tool Pages (`/heic-to-jpg`, etc.)

```
Nav (sticky)
└─ Hero
   ├─ Badge pill: "Free · No signup required"
   ├─ H1: "Convert [FROM] to [TO] in seconds"
   ├─ Subtitle: privacy promise
   └─ Trust pills (4)
└─ Drop Zone
└─ Results Section (appears after conversion)
   ├─ File rows (×N)
   └─ Action row (Download ZIP + More files)
└─ Divider
└─ How it Works (3-step grid)
└─ Unique Content Section
   └─ Format-specific explainer (~200 words, unique per page)
└─ FAQ (4–5 questions, schema markup via JSON-LD)
└─ Related Converters (2×2 card grid — sibling pages)
└─ Footer
```

### Homepage (`/`)

```
Nav
└─ Hero
   ├─ Badge: "Free image tools — no account needed"
   ├─ H1: "Convert any image format right in your browser"
   ├─ Subtitle
   └─ Trust row
└─ HEIC Cluster Section (teal)
   └─ 4 tool cards + 1 hub card
└─ AVIF Cluster Section (violet accent)
   └─ 2 tool cards + 1 hub card
└─ "Built Different" (3-column why section)
└─ Pro Banner
└─ Footer
```

### Guide Pages (`/what-is-heic`, `/what-is-avif`)

```
Nav
└─ Article Hero
   ├─ H1: "What is HEIC?"
   └─ Last updated date
└─ Quick-answer box (above fold — answers the query immediately)
└─ Long-form content (~800 words, unique, helpful)
   ├─ Why Apple uses it
   ├─ Quality vs size tradeoffs
   ├─ How to open/convert on iPhone/Mac/Windows
   └─ Is it private to keep?
└─ Converter CTA box (soft upsell mid-page)
   └─ "Convert your HEIC files → [Try HEIC to JPG]"
└─ Related tools grid
└─ Footer
```

---

## SEO Structure

### H1 Pattern

Tool pages: `Convert [FROM FORMAT] to [TO FORMAT]` — exact-match to top keyword.
Guide pages: `What is [FORMAT]? — Everything You Need to Know`

### Meta Description Pattern

Tool: `Free HEIC to JPG converter. Works entirely in your browser — photos never uploaded. Batch convert up to 10 files and download as ZIP.`
Guide: `HEIC is Apple's photo format used by iPhones since iOS 11. Learn what it is, how to open it, and how to convert it to JPG on any device.`

### Schema Markup

- Tool pages: `FAQPage` JSON-LD (4–5 Q&A from the FAQ section)
- Guide pages: `Article` JSON-LD with `dateModified`
- Homepage: `WebSite` + `SoftwareApplication` JSON-LD

### Internal Linking

Each tool page links to:
- 3–4 sibling converters (the "Related converters" grid)
- The cluster hub guide (`/what-is-heic` or `/what-is-avif`)

Each guide page links to:
- All converter tools in its cluster
- The homepage

Homepage links to all 9 sub-pages.

---

## Pro Freemium Hooks

Free tier limits (enforced client-side, entitlements abstraction already scaffolded in Plan 1):
- Max 10 files per batch
- Max 25 MB per file
- Download individually or ZIP (both free)

Pro hooks (displayed but not yet activated — "Get notified" CTA collects email):
- Unlimited files per batch
- No per-file size cap
- API access (future)

Hook placements:
1. Savings note below action row: `Saved X MB · Pro removes the 10-file limit`
2. Pro banner on homepage (above footer)
3. If user drops >10 files: inline gate toast "Batch limit reached — Pro removes the cap"

No hard-sell modals. No conversion interruption on the free tier under the limit.

---

## Implementation Notes

### Data-Driven Pages (Programmatic SEO)

All 10 pages share a single `ToolPage` layout component. Page-specific config lives in a `src/tools/tools.config.ts` file:

```ts
type ToolConfig = {
  slug: string          // 'heic-to-jpg'
  from: string          // 'HEIC'
  to: string            // 'JPG'
  h1: string            // 'Convert HEIC to JPG in seconds'
  description: string   // meta description
  chooseLabel: string   // 'Choose HEIC Files'
  formats: string[]     // ['heic', 'heif']
  related: string[]     // ['heic-to-png', 'avif-to-jpg', ...]
  cluster: 'heic' | 'avif'
}
```

### Engine Integration

The drop zone calls `convertImage()` from `src/engine/index.ts` (Plan 1). No changes needed to the engine — only the UI layer is new in Plan 2.

### Fonts

Load via `next/font/google` (subset, display:swap). No separate `<link>` tag.

### Tailwind

Extend the Tailwind config with the custom tokens above as CSS variables. Use `@layer base` to define them on `:root`.

---

## Out of Scope (Plan 2)

- Pro payment flow (Stripe) — future plan
- Email capture backend for "Get notified" — stub with a static form for now
- Mobile hamburger nav — desktop-first for launch
- Dark mode — future enhancement
- Image preview in drop zone — Phase 2
- Quality/resize controls — Phase 2

---

## Approved Decisions

| Decision | Choice |
|---|---|
| Visual direction | B — Warm & Friendly (cream/teal/rounded) |
| First cluster | HEIC + AVIF (10 pages) |
| Tool page layout | Tool above fold, content below, related converters interlinked |
| Homepage structure | Hub with cluster sections, Why section, Pro banner |
| Font | Plus Jakarta Sans |
| Icon style | SVG only, Lucide reference, 1.2–1.5px stroke |
| Pro strategy | Freemium hooks visible, "Get notified" CTA, no hard gate on free tier |
