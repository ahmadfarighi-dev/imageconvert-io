import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { articleSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "What is AVIF? — Everything You Need to Know",
  description:
    "AVIF is the next-generation image format offering significantly better compression than JPG and WebP. Learn what it is, browser support, and how to convert it.",
  alternates: { canonical: "https://imageconvert.io/what-is-avif" },
};

const RELATED = [
  { href: "/avif-to-jpg", label: "AVIF → JPG" },
  { href: "/avif-to-png", label: "AVIF → PNG" },
  { href: "/heic-to-avif", label: "HEIC → AVIF" },
];

export default function WhatIsAvif() {
  return (
    <>
      <JsonLd
        data={articleSchema({
          title: "What is AVIF?",
          description: metadata.description as string,
          url: "https://imageconvert.io/what-is-avif",
          dateModified: "2026-06-15",
        })}
      />
      <Nav />

      <main className="max-w-2xl mx-auto px-6 py-10">
        <p className="ic-section-label mb-2">Format guide</p>
        <h1 className="text-[30px] font-extrabold text-ic-text-900 tracking-tight leading-tight mb-2">
          What is AVIF?
        </h1>
        <p className="text-[13px] text-ic-text-400 mb-8">Updated June 2026</p>

        {/* Quick answer */}
        <div className="bg-ic-violet-50 border border-ic-violet-100 rounded-ic-lg p-5 mb-8">
          <p className="text-[13px] font-bold text-ic-violet-700 mb-1.5">Quick answer</p>
          <p className="text-[14px] text-ic-text-600 leading-relaxed">
            AVIF (AV1 Image File Format) is a next-generation image format based on the AV1
            video codec. It offers roughly 50% better compression than JPG and 20% better than
            WebP at equivalent visual quality. Browser support is strong in Chrome and Firefox;
            Safari added full support in version 16.
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            How AVIF compares to other formats
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            JPG has been the web&apos;s image format for 30 years. WebP was Google&apos;s answer
            in 2010, offering better compression with broad browser support. AVIF, standardized in
            2019, goes further: it typically produces files 50% smaller than JPG and 20% smaller
            than WebP at the same visual quality. For high-volume websites where image weight
            directly affects Core Web Vitals and bandwidth costs, AVIF is the best choice
            available in 2026.
          </p>

          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            Browser support in 2026
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            AVIF is supported in Chrome 85+, Firefox 93+, Edge 121+, and Safari 16+. Combined,
            these browsers account for over 92% of web traffic as of 2026. For the remaining
            fraction, serve JPG as a fallback via the HTML{" "}
            <code className="text-[13px] bg-ic-cream-b px-1 py-0.5 rounded">&lt;picture&gt;</code>{" "}
            element. If you&apos;re converting AVIF files for use outside a browser — in an app,
            email, or document — JPG or PNG remain safer choices.
          </p>

          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            When to use AVIF vs. alternatives
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-1">
            <strong>Use AVIF</strong> when you need the best possible compression for web delivery
            and your users are on modern browsers. Ideal for product photography, editorial
            images, and any high-volume image asset.
          </p>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-1">
            <strong>Use WebP</strong> when you need broad compatibility including Safari 13/14
            and don&apos;t need AVIF&apos;s extra compression gains.
          </p>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            <strong>Use JPG</strong> for maximum compatibility — every device, every app, every
            browser since the 1990s.
          </p>

          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            Encoding speed trade-off
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            AVIF encoding is significantly slower than JPG or WebP because the AV1 codec
            performs more sophisticated analysis. Our converter uses a WASM build of the AV1
            encoder running in your browser — expect a few seconds per image rather than
            milliseconds. This is normal and inherent to the codec, not a limitation of the tool.
          </p>
        </div>

        {/* Mid-page CTA */}
        <div className="bg-white border border-ic-cream-b rounded-ic-lg p-5 my-8 shadow-ic-sm">
          <p className="text-[14px] font-bold text-ic-text-900 mb-1">
            Need to convert an AVIF file?
          </p>
          <p className="text-[12px] text-ic-text-600 mb-3">Free, no upload, works in your browser.</p>
          <div className="flex flex-wrap gap-2">
            {RELATED.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="text-[13px] font-semibold text-ic-teal-600 bg-ic-teal-50
                           border border-ic-teal-100 rounded-ic-sm px-3.5 py-1.5
                           hover:bg-ic-teal-100 transition-colors no-underline"
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Related tools */}
        <p className="ic-section-label mt-8 mb-3">AVIF converters</p>
        <div className="grid grid-cols-2 gap-2.5">
          {RELATED.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="ic-card p-4 no-underline hover:border-ic-teal-300 transition-colors"
            >
              <p className="text-[13px] font-bold text-ic-text-900">{r.label}</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
