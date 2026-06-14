# The Best 5 Utility-Tool Niches to Clone-and-Improve in 2026: A Traffic-, Money-, and AI-Resilience-Weighted Scan

## TL;DR
- **Build a browser-side file tool, not an answer calculator.** The single best risk-adjusted bets for a solo Next.js/Supabase/Stripe dev are (1) **image compression/conversion**, (2) a **niche PDF micro-tool** (not a full iLovePDF clone), (3) **developer "format/convert" tools**, (4) **image format/HEIC/WebP converters**, and (5) **background removal (as a freemium play, not an ad play)** — because each requires the user to come to your site to *do* a thing AI can't perform in-place, making them highly AI-resilient.
- **Display ads alone are a trap at utility-tool RPMs.** A real sold AdSense+Ezoic calculator tool earned ~$2.27 per 1,000 pageviews; the "tools/technology" vertical runs roughly $2–$8 RPM, and heavy India/Brazil traffic plus inability to qualify for the premium ad networks caps ad income. **Freemium upsell (no watermark, batch, API, higher limits) out-earns ads per visitor by an order of magnitude.**
- **Avoid the head terms owned by giants.** "pdf to word," "i love pdf," "remove background," "word counter," and "calculator" are dominated by DR 75–90 incumbents (iLovePDF ~229M visits, calculator.net ~58M, remove.bg ~42–76M). Win in under-served sub-niches and long-tail format/spec variations where incumbents have dated UX, watermarks, or daily caps.

## Key Findings

**1. The utility-tool landscape splits into "function tools" (AI-resilient) and "answer tools" (AI-vulnerable) — and this distinction matters more than search volume.** Function tools — compress, convert, merge, remove background — require the visitor to physically transact a file on your page. Answer tools — most calculators, unit/timezone conversions, "days until" — produce a number that Google's AI Overviews and built-in widgets can display in-place. Similarweb data show finance, weather, and conversion queries already hit zero-click rates up to ~100%. Ahrefs (Ryan Law & Xibeijia Guan, "Update: AI Overviews Reduce Clicks by 58%," December 2025) confirms verbatim: "As of December 2025, AI Overviews reduce the organic click-through rate for position one content by 58%" — with position-one CTR for AI-Overview keywords falling from 0.073 (Dec 2023) to 0.016 (Dec 2025). Corroborated by Seer Interactive (49.4–65.2% decline), Authoritas (47.5%), and Kevin Indig (>50%). This single distinction should drive niche selection.

**2. The traffic leaders, by category (Similarweb/Semrush/Ahrefs estimates, late 2025–mid 2026):**
- **PDF:** iLovePDF ~229–269M monthly visits (Semrush April 2026: 229M; Domain Rating 83). Smallpdf ~33M, Sejda ~19.7M, pdf24.org ~13.5M, online2pdf ~4.35M. Head terms are massive: "i love pdf" ~5.9M searches/mo, "jpg to pdf" ~4.8M, "pdf to word" ~4M.
- **Image tools:** iLoveIMG ~22–39M visits (Similarweb March 2026 ~22M; Semrush Jan 2026 ~39M). TinyPNG/Tinify is the compression category leader. remove.bg ~42M (Ahrefs Jan 2026) to ~76M (Semrush Nov 2025); photoroom.com ~21–29M; pixelcut.ai, erase.bg, removal.ai, cutout.pro trail.
- **Calculators:** calculator.net ~58M visits (Semrush May 2026), DR strong; competitors calculatorsoup.com, omnicalculator.com, gigacalculator.com.
- **Word/text:** wordcounter.net ~4.7–14M visits (Ahrefs June 2026: 4.7M; Semrush March 2026: 14.19M), DR 75, ranks #1 for "word counter" (~821K visits from that one keyword). Competitors charactercountonline.com, charactercounter.com.
- **Dev tools:** jsonformatter.org (rising, ~80K–90K pageviews/mo per older estimates), codebeautify.org, jsoneditoronline.org (solo-built by Jos de Jong), jsonformatter.curiousconcept.com.
- **GIF/video:** ezgif.com ~19M+ pageviews/mo and the dominant "gif maker"/"mp4 to gif" property; giphy.com, online-video-cutter.com, cloudconvert.com, freeconvert.com adjacent.
- **QR/generators:** qr-code-generator.com, qrcodemonkey, bitly dominate; the space is heavily commercial (dynamic QR = SaaS).

**3. Monetization reality (grounded in real numbers):** A date-calculator utility sold on Flippa (listing #11121844) made **$39/month on 17,189 pageviews via AdSense + Ezoic** — an effective **~$2.27 RPM**. Industry "SaaS tools/software/gadgets" RPM benchmarks run **$2–$8** (Ranktracker), and AdSense's floor is **$0.2–$2.5 per 1,000 views** (Publisher Collective), heavily depressed by non-tier-1 traffic. By contrast, the *same category* of tool monetized via **freemium subscription** earns vastly more: PDF AI reached **$25,070 MRR with over 1,250 paying users** (founder Damon, Indie Hackers; plans at $15/mo and $50/mo Enterprise, growth aided by a mention in Spanish newspaper La Vanguardia); Api2Pdf reached ~$10K/month; and RecordJoy, a screen-recording tool by ex-Netflix engineer Michael Lin, "was generating around $700/mo and had 3000 registered users" before selling for **$20,000 on Acquire.com**. **iLovePDF, Smallpdf, TinyPNG, and remove.bg all monetize primarily through freemium/SaaS upsell + API, not display ads** — TinyPNG sells a pay-per-compression API; remove.bg sells credits and an API; iLovePDF/Smallpdf sell Premium subscriptions that lift file-size caps, remove watermarks, and unlock batch.

**4. Winnability is inversely correlated with brand dominance of the head term.** The PDF and background-removal *head* terms are unwinnable for a new domain (DR 83–90 incumbents, billions in brand equity). But the *suites* leave gaps: iLovePDF caps free users at ~25MB and shows ads; Smallpdf limits free users to ~2 tasks/day. Single-purpose, no-cap, no-watermark, privacy-first (client-side) tools targeting specific format pairs ("heic to jpg," "webp to png," "avif converter," "compress image to 20kb") are demonstrably winnable — entire indie sites already rank on these long-tails.

**5. Build complexity splits cleanly for the user's stack.** Client-side (browser WASM/Canvas) tools — text tools, JSON/dev formatters, image compress/convert/resize, QR generation, many calculators — are cheap, scale for free on Vercel, and need no Supabase or per-use API cost. Server/compute-heavy tools — OCR, background removal, video compression, PDF↔Word/Excel conversion — carry real per-use costs (GPU/API) that erode ad margins and effectively force a freemium model to survive.

## Details: The Ranked Top 5 Opportunities

### #1 — Image compression + format conversion (client-side, freemium-optional)
- **Head keywords:** "image compressor," "compress image," "compress jpeg," "heic to jpg," "webp to png," "compress image to 20kb/50kb/100kb."
- **Niche leaders to study:** TinyPNG/Tinify (category king; sells pay-per-compression API + WordPress plugin + CDN), iLoveIMG (~22M+ visits, suite model), Squoosh (Google, client-side, no monetization — a UX benchmark, not a competitor), imagecompressor.com, smallseotools.
- **Traffic:** Very high and stable; "compress image," "heic to jpg," and "webp to jpg" are all top organic keywords for iLoveIMG. Image optimization demand is structurally tied to web performance/Core Web Vitals and isn't going away.
- **Monetization:** Display ads as a floor (~$2–$8 RPM) + freemium upsell for batch/no-limit/API. TinyPNG's pay-per-compression API is the proven model. This is the cleanest path to non-trivial revenue.
- **Winnability: HIGH.** TinyPNG is beatable on UX breadth (it's PNG/JPG/WebP/AVIF-focused), and the long-tail format pairs and "compress to X kb" specs are wide open. Squoosh proves browser-side compression is excellent but Google doesn't SEO it or add bulk/ZIP download — beat it on workflow.
- **AI-resilience: HIGH.** AI cannot compress your file in the chat window; you must visit a tool.
- **Build complexity: LOW.** 100% client-side via Canvas/WebAssembly (browser-native). Zero per-use cost, scales free on Vercel. Stripe only needed if you add a Pro/API tier.
- **Rationale:** The best intersection of huge durable demand, low build cost, high AI-resilience, and a proven freemium ceiling.

### #2 — A focused PDF micro-tool (NOT a full iLovePDF clone)
- **Head keywords (pick ONE lane):** "merge pdf," "split pdf," "compress pdf," "jpg to pdf," "pdf to jpg," "rotate pdf," "delete pdf pages," "rearrange pdf." Avoid "pdf to word"/"pdf to excel" (conversion fidelity is hard and giant-dominated).
- **Niche leaders to study:** iLovePDF (~229–269M visits, DR 83), Smallpdf (~33M, free tier ~2 tasks/day), Sejda (~19.7M, no watermark within 3-task cap), pdf24.org, ilovemerge.com (indie, client-side merge).
- **Traffic:** Among the largest in the entire utility category; even a 0.5% slice of "merge pdf"-class demand is meaningful.
- **Monetization:** Ads + freemium (lift file-size cap, batch, no queue). The incumbents' free-tier friction (caps, ads, forced uploads, watermarks) is the wedge.
- **Winnability: MEDIUM.** The head terms are giant-owned, but client-side, no-upload, no-cap, privacy-first single-function tools win on the long tail and on the privacy angle (files never leave the browser). Do NOT try to out-suite iLovePDF.
- **AI-resilience: HIGH.** File-in/file-out function AI can't perform in-place.
- **Build complexity: LOW–MEDIUM.** Merge/split/rotate/reorder/images-to-PDF and basic compression are doable client-side with pdf-lib/pdf.js (browser libraries). PDF→Word/Excel/OCR are NOT — avoid them; they need paid server-side conversion engines.
- **Rationale:** Massive demand, AI-proof, and buildable client-side IF you stay in the "manipulate the PDF" lane and skip lossy format conversion.

### #3 — Developer "format / convert / generate" tools
- **Head keywords:** "json formatter," "json to csv," "base64 decode," "jwt decoder," "cron expression," "regex tester," "uuid generator," "hash generator," "yaml to json," "diff checker."
- **Niche leaders to study:** jsonformatter.org, codebeautify.org, jsoneditoronline.org (solo-built by Jos de Jong), jsonformatter.curiousconcept.com.
- **Traffic:** Solid and high-intent; jsonformatter.org's audience is 70%+ male developers, 25–34, with strong tier-1 (US) representation — which means **higher RPM than typical utility traffic** and excellent affiliate fit (dev tools, hosting, monitoring, API services).
- **Monetization:** Display ads (better RPM here due to tier-1 dev audience) + affiliate to dev SaaS (Sentry, hosting, API platforms) + optional Pro tier (saved snippets, private/no-log processing). **Privacy is a selling point**: in November 2025, watchTowr Labs (researcher Jake Knott) disclosed that jsonformatter.org and codebeautify exposed **over 80,000 saved files (5GB+)** spanning five years of JSONFormatter and one year of CodeBeautify data — including Active Directory, AWS, database, SSH, and API credentials; planted canary AWS keys were tested by attackers within 48 hours, and both sites disabled "Save" in response. A "we never store your data, 100% client-side" competitor now has a real, current trust wedge.
- **Winnability: HIGH.** Incumbents have dated UX, ad clutter, and a publicized data-privacy black eye. A fast, clean, client-side, dark-mode dev-tools suite is very winnable, and developers share good tools.
- **AI-resilience: MEDIUM–HIGH.** Mixed: an AI can format a small JSON snippet in chat, but developers strongly prefer a fast, bookmarkable, paste-big-payload tool with tree view, validation, and no copy-paste-into-chatbot friction — and won't paste secrets into a third-party LLM. Privacy + speed + workflow keep traffic sticky.
- **Build complexity: LOW.** Pure client-side; trivial on the user's stack. Vercel free tier handles it.
- **Rationale:** High-RPM tier-1 audience, strong affiliate angle, beatable incumbents, and a fresh trust differentiator.

### #4 — Image format converters (HEIC/WebP/AVIF and friends)
- **Head keywords:** "heic to jpg," "webp to png," "webp to jpg," "png to jpg," "avif to jpg," "svg converter."
- **Niche leaders to study:** iLoveIMG, cloudconvert.com, freeconvert.com, plus countless single-purpose indie converters that rank on individual format pairs.
- **Traffic:** "heic to jpg" and "webp to jpg" are explicitly among iLoveIMG's top organic keywords; the proliferation of HEIC (iPhone) and WebP/AVIF (web) guarantees durable, growing demand as people hit "I can't open this file" walls.
- **Monetization:** Ads + optional batch/Pro. Lower revenue ceiling than #1/#2 but extremely cheap to run.
- **Winnability: HIGH.** This is the classic programmatic-SEO play: one clean, fast, client-side template page per format pair, dozens of long-tail pages, each low-difficulty. The user's engineering skills are a direct advantage here.
- **AI-resilience: HIGH.** Format conversion is a file function, not an answer.
- **Build complexity: LOW.** Client-side Canvas/WASM for the common raster formats; zero per-use cost. (A few exotic formats need libraries but most are browser-doable.)
- **Rationale:** The single best programmatic-SEO + AI-resilient + zero-cost combination; ideal first build to learn the playbook, though its per-tool ceiling is lower than image compression.

### #5 — Background removal (build ONLY as freemium, not ads)
- **Head keywords:** "remove background," "background remover," "remove bg." (Head term ~4M searches/mo; remove.bg ranks #1.)
- **Niche leaders to study:** remove.bg (~42–76M visits, DR 83, owned by Canva/Kaleido — sells credits + API), photoroom.com (~21–29M), pixelcut.ai, erase.bg, removal.ai, cutout.pro.
- **Traffic:** Among the highest-value in the image category, with strong commercial intent (e-commerce sellers, marketers).
- **Monetization:** **Freemium/credits + API only.** Ad RPM cannot cover the GPU/inference cost per image. remove.bg's entire model is credit-based.
- **Winnability: LOW–MEDIUM.** The head term is owned by a Canva-backed DR 83 incumbent and a well-funded field. A new entrant must niche down hard (e.g., "remove background from product photo," "bulk background remover for Shopify," a specific vertical) and compete on price/workflow, not on the head term.
- **AI-resilience: HIGH (functionally) but with a caveat:** the function is AI-resilient against *Google AI Overviews*, but the underlying capability is increasingly commoditized inside Canva, Photoshop web, Pixelcut, and the phone OS itself — competitive (not search) pressure is the real risk.
- **Build complexity: HIGH.** Needs server-side ML inference (a hosted model like BiRefNet/RMBG or a paid API). Real per-image cost. This is the only top-5 pick that mandates Supabase (accounts/credits) + Stripe (billing) and meaningful infra spend.
- **Rationale:** Included because demand and willingness-to-pay are genuinely high, but flagged as the highest-risk, highest-cost pick — pursue only with a freemium model and a sharp vertical niche, not as a generic ad-supported clone.

### Honest risk flags — what to AVOID
- **General-purpose calculators (mortgage, percentage, age, BMI, "days until"): AVOID for a new site.** calculator.net (DR strong, ~58M visits) and omnicalculator own these, AND the answers are exactly what AI Overviews/Google's built-in calculator widget display in-place. **Low AI-resilience + entrenched incumbents = worst of both worlds.** Niche *professional* calculators (specialized, regulation-driven, with inputs an AI won't bother to model) are the only defensible calculator sub-niche, and even those are answer-tools at risk.
- **Word counter / character counter: AVOID.** wordcounter.net (DR 75) owns it, traffic is flat-to-declining, and it's a borderline answer-tool.
- **Full PDF or image *suites*: AVOID.** Don't clone all of iLovePDF/Smallpdf/iLoveIMG. You cannot out-feature a DR 83 suite as a solo dev. Win one function.
- **Generic QR generator: AVOID as an ad play.** The free generation is commoditized and client-side-trivial, while the money (dynamic/trackable QR) is a crowded SaaS market (Bitly, Uniqode, QR Code Generator Pro) — build it only as a loss-leader funnel into a tracking subscription, not for ad revenue.
- **Currency/timezone/unit converters: AVOID.** Pure answer-tools; Google displays the result directly. Near-zero AI-resilience.
- **Video compression / audio conversion: CAUTION.** ezgif (~19M pageviews) shows the demand is real and GIF/video editing is AI-resilient, but server-side video transcoding is expensive and bandwidth-heavy — only viable with a freemium model and careful cost control.

## Recommendations

**Stage 0 — Validate before building (this week).** Use Google Search Console + a cheap keyword tool (Mangools ~$29/mo or free tier) to pull real search volume and keyword difficulty for 20–30 specific format-pair and function keywords. Target keywords where the top results include beatable indie sites (DR < 40), not just iLovePDF/calculator.net. **Threshold to proceed:** at least 8–10 target keywords with combined ≥100K monthly searches and a beatable SERP.

**Stage 1 — Ship the cheapest, most AI-resilient thing first (weeks 1–6).** Build a **client-side image format converter + compressor** (#1 and #4 combined into one suite of templated tool pages). It's 100% browser-side, zero per-use cost, infinitely scalable on Vercel's free tier, and uses the user's engineering skills for programmatic SEO. Launch on Product Hunt to seed Domain Rating. No Supabase/Stripe needed yet. **Benchmark to advance:** 10K+ monthly organic visits within ~3–4 months (SEO compounds at month 5–7 per indie-hacker norms).

**Stage 2 — Add monetization once traffic is real (at ~10K+ visits/mo).** Start with AdSense as a baseline, but **plan for freemium from the start** — the real money is a Pro tier (batch, no limits, ZIP download, API access, no-log privacy) billed via Stripe. Add Supabase only when you introduce accounts/credits. Given utility RPMs of ~$2–$8, ad income at 100K visits/mo is only ~$200–$800; the freemium upsell is what turns this into a real business. Note that the premium ad networks are largely out of reach for typical utility traffic: per Raptive's 2026 eligibility (and Search Engine Journal, Oct 16 2025), sites at 25,000–99,999 monthly pageviews "need at least 50% of traffic from the United States, United Kingdom, Canada, Australia, or New Zealand" (40% above 100,000 pageviews), and Mediavine replaced its old 50,000-sessions rule with a $5,000/yr ad-revenue threshold effective Jan 15, 2026 (its Journey tier requires 1,000+ sessions). Utility tools with heavy India/Brazil traffic typically can't meet the geography bar — another reason freemium beats ads here.

**Stage 3 — Expand into a focused PDF micro-tool and a dev-tools suite (#2, #3) (months 4–9).** Reuse the templated-page playbook. The dev-tools suite is especially attractive: tier-1 audience → higher RPM, strong affiliate fit, and a fresh privacy differentiator after the November 2025 watchTowr disclosure of the jsonformatter.org / codebeautify credential leak. Lead every dev tool with "100% client-side, we never see or store your data."

**Stage 4 — Only attempt background removal (#5) after you have cash flow and a niche.** It's the one pick that needs real infra spend and a sharp vertical (e.g., e-commerce/Shopify sellers). Don't make it your first build.

**Metrics that should change the plan:**
- If a tool's organic traffic stalls below ~2K/mo at month 4, the SERP was harder than estimated — pivot to a less competitive format pair.
- If freemium conversion exceeds ~1%, prioritize the Pro tier and de-emphasize ads.
- If AI Overviews begin appearing on your function-tool keywords (monitor in Search Console / via an AI-visibility tracker), double down on the "you must come here to do this" function tools and abandon any answer-tool experiments.

## Caveats
- **All traffic figures are third-party estimates (Similarweb, Semrush, Ahrefs) and frequently disagree** — e.g., remove.bg is variously reported at 42M (Ahrefs) and 76M (Semrush) monthly visits; iLovePDF at 229M (Semrush) and ~269M (cited Semrush figure); wordcounter.net at 4.7M (Ahrefs) and 14M (Semrush). Treat them as order-of-magnitude, not precise. SparkToro found Similarweb most accurate for sites with 5K–100K monthly users; accuracy degrades at both extremes.
- **Revenue figures are largely self-reported or seller-provided** (Flippa listings, Indie Hackers posts) and unverified. The ~$2.27 RPM data point is from a single Flippa listing's seller-stated numbers; use it as a sobering reality check, not a guarantee. RPM varies enormously with traffic geography and ad layout.
- **The AI-resilience thesis is directional, not certain.** Google is expanding AI Mode and could eventually embed file-handling "actions"; the function-tool moat is strong today but not permanent. Competitive commoditization (Canva, phone OSes, browser-native features) is arguably a bigger long-term threat to image/background tools than search-side AI.
- **Build-complexity assessments assume current browser capabilities** (WASM, Canvas, File System Access API). Some format conversions and all OCR/ML tasks still require server-side compute with real per-use cost.
- **This is a competitive, crowded space.** "Clone and improve" only works if the improvement is real and defensible — privacy (client-side/no-upload), workflow (batch/ZIP/no caps), UX (speed/clean design), or a sharp niche. A generic clone with no edge will not rank against entrenched DR 75–90 domains.