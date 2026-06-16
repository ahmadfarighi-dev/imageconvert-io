import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ConverterSection from "@/components/ConverterSection";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import { getToolConfig, TOOL_SLUGS } from "@/tools/tools.config";

export function generateStaticParams() {
  return TOOL_SLUGS.map((slug) => ({ tool: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { tool: string };
}): Promise<Metadata> {
  const cfg = getToolConfig(params.tool);
  if (!cfg) return {};
  return {
    title: cfg.h1,
    description: cfg.metaDescription,
    alternates: { canonical: `https://imageconvert.io/${cfg.slug}` },
  };
}

const TrustPill = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1.5 text-[12px] font-medium text-ic-text-600">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z" fill="#F0FDFA" stroke="#0D9488" strokeWidth="1" />
      <path d="M5 8l2 2 4-4" stroke="#0D9488" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {label}
  </div>
);

const RelatedCard = ({ slug, label }: { slug: string; label: string }) => (
  <Link
    href={`/${slug}`}
    className="ic-card flex items-center gap-3 p-3.5 no-underline
               hover:border-ic-teal-300 hover:shadow-[0_4px_14px_rgba(13,148,136,.1)] transition-all"
  >
    <div className="w-9 h-9 bg-ic-teal-50 border border-ic-teal-100 rounded-[10px]
                    flex items-center justify-center flex-shrink-0">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="14" height="12" rx="2.5" stroke="#0D9488" strokeWidth="1.4" />
        <path d="M5 11l2.5-3 2 2.5 1.5-2L14 11" stroke="#0D9488" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div>
      <p className="text-[13px] font-bold text-ic-text-900">
        {label.includes("what-is")
          ? `What is ${label.replace("what-is-", "").toUpperCase()}?`
          : label
              .split("-")
              .map((w, i) => (i === 1 ? "→" : w.toUpperCase()))
              .join(" ")}
      </p>
    </div>
  </Link>
);

export default function ToolPage({ params }: { params: { tool: string } }) {
  const cfg = getToolConfig(params.tool);
  if (!cfg) notFound();

  return (
    <>
      <JsonLd data={faqSchema(cfg.faq)} />
      <Nav />

      <main>
        {/* Hero */}
        <section className="text-center pt-10 pb-7 px-6 bg-white border-b border-ic-cream-b">
          <div className="ic-badge mb-4">
            <span className="w-1.5 h-1.5 bg-ic-teal-500 rounded-full" />
            Free · No signup required
          </div>
          <h1 className="text-[30px] font-extrabold text-ic-text-900 tracking-tight leading-tight mb-2.5">
            {cfg.h1}
          </h1>
          <p className="text-[14px] text-ic-text-600 leading-relaxed max-w-sm mx-auto mb-6">
            Converts instantly in your browser — files never leave your device.
          </p>
          <div className="flex items-center justify-center gap-5 flex-wrap">
            <TrustPill label="100% private" />
            <TrustPill label="No uploads" />
            <TrustPill label="Batch free up to 10" />
          </div>
        </section>

        {/* Converter */}
        <div className="pt-6">
          <ConverterSection config={cfg} />
        </div>

        {/* How it works */}
        <section className="px-6 py-7 border-t border-ic-cream-b">
          <p className="ic-section-label">How it works</p>
          <h2 className="text-[18px] font-extrabold text-ic-text-900 tracking-tight mb-4">
            Convert {cfg.fromLabel} to {cfg.toLabel} in 3 steps
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { n: "1", title: "Drop your files", desc: `Drag ${cfg.fromLabel} photos or tap to browse — batch supported.` },
              { n: "2", title: "Converts instantly", desc: "WebAssembly runs locally in your browser. No upload, no waiting." },
              { n: "3", title: "Download & share", desc: `Grab individual ${cfg.toLabel}s or download everything as a ZIP.` },
            ].map(({ n, title, desc }) => (
              <div key={n} className="ic-card p-4">
                <div className="w-7 h-7 bg-ic-teal-50 border border-ic-teal-100 rounded-ic-sm
                                flex items-center justify-center text-[13px] font-extrabold
                                text-ic-teal-600 mb-2.5">
                  {n}
                </div>
                <p className="text-[13px] font-bold text-ic-text-900 mb-1">{title}</p>
                <p className="text-[12px] text-ic-text-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Unique content */}
        <section className="px-6 py-7 border-t border-ic-cream-b">
          <p className="ic-section-label">About this conversion</p>
          <h2 className="text-[18px] font-extrabold text-ic-text-900 tracking-tight mb-3">
            {cfg.fromLabel} to {cfg.toLabel}: what you need to know
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed">{cfg.uniqueContent}</p>
        </section>

        {/* FAQ */}
        <section className="px-6 py-7 border-t border-ic-cream-b">
          <p className="ic-section-label">FAQ</p>
          <h2 className="text-[18px] font-extrabold text-ic-text-900 tracking-tight mb-4">
            Common questions
          </h2>
          <div className="flex flex-col gap-2.5">
            {cfg.faq.map(({ q, a }) => (
              <div key={q} className="ic-card p-4">
                <p className="text-[13px] font-bold text-ic-text-900 mb-2">{q}</p>
                <p className="text-[12px] text-ic-text-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related converters */}
        <section className="px-6 py-7 border-t border-ic-cream-b">
          <p className="ic-section-label">Also useful</p>
          <h2 className="text-[18px] font-extrabold text-ic-text-900 tracking-tight mb-4">
            Related converters
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {cfg.related.map((slug) => (
              <RelatedCard key={slug} slug={slug} label={slug} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
