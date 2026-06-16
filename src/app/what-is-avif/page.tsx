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
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            AVIF is the image format built on top of AV1, a royalty-free video codec developed by
            the Alliance for Open Media (AOMedia) — a consortium that includes Google, Mozilla,
            Netflix, Microsoft, Amazon, Intel, and Apple, among others. Because AV1 was designed
            from the ground up to compete with proprietary codecs like HEVC without licensing fees,
            AVIF inherited a genuinely modern compression toolkit: larger prediction blocks, better
            motion/spatial prediction even for still frames, and more flexible quantization than
            either JPG or WebP. This lineage is also why AVIF support spread quickly across
            browsers — the same vendors building AV1 video decoders had a direct incentive to ship
            AVIF image support alongside it.
          </p>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            In practical terms, the compression gains show up most in image-heavy contexts. An
            e-commerce site with a product gallery of 20 photos per listing can cut total page
            weight dramatically by switching from JPG to AVIF — shaving even 200–300 KB per page
            load adds up across thousands of monthly visitors and has a measurable effect on
            mobile load times, bounce rate, and ultimately conversion rate. Editorial and
            photography sites see similar wins on hero images and galleries, where dozens of
            large photos are loaded on a single scroll.
          </p>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            AVIF also supports features JPG simply can&apos;t: animated AVIF sequences (a
            higher-quality, smaller-file alternative to animated GIF or even some video use cases),
            HDR and wide color gamut support for displays capable of richer color, and lossless
            compression mode in addition to lossy. JPG is limited to 8-bit standard color and has
            no native animation or transparency support at all, which makes AVIF considerably more
            versatile for modern use cases beyond simple photographs.
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
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            The standard fallback pattern looks like a{" "}
            <code className="text-[13px] bg-ic-cream-b px-1 py-0.5 rounded">&lt;picture&gt;</code>{" "}
            element with multiple{" "}
            <code className="text-[13px] bg-ic-cream-b px-1 py-0.5 rounded">&lt;source&gt;</code>{" "}
            tags: an AVIF source first, a WebP source second, and a plain{" "}
            <code className="text-[13px] bg-ic-cream-b px-1 py-0.5 rounded">&lt;img&gt;</code>{" "}
            tag with a JPG as the final fallback. The browser automatically picks the first format
            it can decode, so modern browsers get the smallest file and older or unusual browsers
            still get a working image. This layered approach is why AVIF adoption on the web has
            been low-risk — sites don&apos;t need to wait for 100% support before using it.
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
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            File naming and MIME types are worth getting right when working with AVIF directly.
            Files use the{" "}
            <code className="text-[13px] bg-ic-cream-b px-1 py-0.5 rounded">.avif</code> extension,
            and the format is served with the MIME type{" "}
            <code className="text-[13px] bg-ic-cream-b px-1 py-0.5 rounded">image/avif</code>. If
            you&apos;re self-hosting AVIF files, make sure your web server or CDN sends this MIME
            type in the Content-Type header — some older server configs don&apos;t recognize the
            extension by default and will serve it as{" "}
            <code className="text-[13px] bg-ic-cream-b px-1 py-0.5 rounded">application/octet-stream</code>,
            which can cause browsers to download the file instead of rendering it inline.
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
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            This asymmetry — slow to encode, fast and cheap to decode — is actually by design.
            AV1 (and therefore AVIF) was built with video streaming in mind, where an encoder runs
            once on powerful server hardware but the resulting file gets decoded millions of times
            on phones, laptops, and TVs. For a one-off conversion of a handful of personal photos,
            the extra second or two per image is a non-issue. For a developer trying to convert
            thousands of source images for a website at build time, encoding speed is worth
            planning around — batching, caching previously converted assets, and only re-encoding
            images that have actually changed will save significant time compared to converting
            an entire image library from scratch on every deploy.
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
