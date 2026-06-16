import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import ProBanner from "@/components/ProBanner";
import JsonLd, { websiteSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Free Image Converter — HEIC, AVIF, JPG, PNG, WebP",
  description:
    "Convert HEIC, AVIF, JPG, PNG, and WebP images free in your browser. No uploads, no account, no limits on the free tier. 100% private.",
  alternates: { canonical: "https://imageconvert.io" },
};

const HEIC_TOOLS = [
  { href: "/heic-to-jpg",  name: "HEIC → JPG",  desc: "Most compatible format, great quality",  volume: "~110K/mo" },
  { href: "/heic-to-png",  name: "HEIC → PNG",  desc: "Lossless, supports transparency",         volume: "~28K/mo" },
  { href: "/heic-to-webp", name: "HEIC → WebP", desc: "Modern web format, smaller files",        volume: "~8K/mo" },
  { href: "/heic-to-avif", name: "HEIC → AVIF", desc: "Next-gen format, best compression",       volume: "~3K/mo" },
];

const HEIC_GUIDE = { href: "/what-is-heic", name: "What is HEIC?", desc: "Why iPhones use it, how to open it" };

const AVIF_TOOLS = [
  { href: "/avif-to-jpg", name: "AVIF → JPG", desc: "Universal fallback format", volume: "~14K/mo" },
  { href: "/avif-to-png", name: "AVIF → PNG", desc: "Lossless, with transparency", volume: "~7K/mo" },
];

const AVIF_GUIDE = { href: "/what-is-avif", name: "What is AVIF?", desc: "The future of web images" };

const WHY = [
  {
    title: "Instant, no waiting",
    desc: "WebAssembly converts in your browser. No upload queue, no server round-trip.",
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z" stroke="#0D9488" strokeWidth="1.3" />
        <path d="M8 4v4l2.5 2.5" stroke="#0D9488" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Actually private",
    desc: "Your photos never touch our servers. Zero storage, zero tracking.",
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5C5 1.5 2.5 4 2.5 7c0 2.5 1.5 4.5 3.5 5.5l2 1.5 2-1.5c2-1 3.5-3 3.5-5.5 0-3-2.5-5.5-5.5-5.5z" stroke="#0D9488" strokeWidth="1.3" />
        <path d="M5.5 7.5l1.5 1.5L10 5.5" stroke="#0D9488" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "No account ever",
    desc: "Pick a tool, drop your files, download. That's it — no email needed.",
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="12" height="9" rx="2" stroke="#0D9488" strokeWidth="1.3" />
        <path d="M5 4V3a3 3 0 0 1 6 0v1" stroke="#0D9488" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteSchema()} />
      <Nav />

      <main>
        {/* Hero */}
        <section className="text-center pt-14 pb-11 px-6 bg-gradient-to-b from-white to-ic-cream border-b border-ic-cream-b">
          <div className="ic-badge mb-5">
            <span className="w-1.5 h-1.5 bg-ic-teal-500 rounded-full" />
            Free image tools — no account needed
          </div>
          <h1 className="text-[34px] font-extrabold text-ic-text-900 tracking-tight leading-[1.18] mb-3.5">
            Convert any image format<br />
            <span className="text-ic-teal-600">right in your browser</span>
          </h1>
          <p className="text-[15px] text-ic-text-600 leading-relaxed max-w-sm mx-auto mb-8">
            HEIC from your iPhone. AVIF from the web. JPG, PNG, WebP —
            all converted client-side so your files never leave your device.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {["100% private", "No uploads", "No signup", "Batch free up to 10"].map((label) => (
              <div key={label} className="flex items-center gap-1.5 text-[12px] font-medium text-ic-text-600">
                <span className="text-ic-teal-600 font-bold text-sm">✓</span>
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* HEIC cluster */}
        <section className="px-6 pt-7 pb-8 border-b border-ic-cream-b">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-ic-teal-700
                             bg-ic-teal-50 border border-ic-teal-100 rounded-full px-3 py-0.5">
              HEIC · iPhone Photos
            </span>
            <span className="text-[12px] text-ic-text-400">Apple&apos;s format — convert to share anywhere</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            {HEIC_TOOLS.map((t) => (
              <ToolCard key={t.href} {...t} />
            ))}
          </div>
          <ToolCard {...HEIC_GUIDE} isGuide />
        </section>

        {/* AVIF cluster */}
        <section className="px-6 pt-7 pb-8 border-b border-ic-cream-b">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-ic-violet-700
                             bg-ic-violet-50 border border-ic-violet-100 rounded-full px-3 py-0.5">
              AVIF · Next-Gen Web
            </span>
            <span className="text-[12px] text-ic-text-400">The new standard for web images</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            {AVIF_TOOLS.map((t) => (
              <ToolCard key={t.href} {...t} violet />
            ))}
          </div>
          <ToolCard {...AVIF_GUIDE} violet isGuide />
        </section>

        {/* Why section */}
        <section className="px-6 pt-7 pb-8 border-b border-ic-cream-b">
          <p className="ic-section-label">Why imageconvert</p>
          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mb-5">Built different</h2>
          <div className="grid grid-cols-3 gap-3">
            {WHY.map(({ title, desc, Icon }) => (
              <div key={title} className="ic-card p-4">
                <div className="w-8 h-8 bg-ic-teal-50 rounded-ic-sm flex items-center justify-center mb-2.5">
                  <Icon />
                </div>
                <p className="text-[13px] font-bold text-ic-text-900 mb-1">{title}</p>
                <p className="text-[11px] text-ic-text-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pro banner */}
        <div className="pt-7">
          <ProBanner />
        </div>
      </main>

      <Footer />
    </>
  );
}
