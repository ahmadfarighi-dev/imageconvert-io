import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { articleSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "What is HEIC? — Everything You Need to Know",
  description:
    "HEIC is Apple's photo format used by iPhones since iOS 11. Learn what it is, how to open it, and how to convert it to JPG on any device.",
  alternates: { canonical: "https://imageconvert.io/what-is-heic" },
};

const RELATED = [
  { href: "/heic-to-jpg", label: "HEIC → JPG" },
  { href: "/heic-to-png", label: "HEIC → PNG" },
  { href: "/heic-to-webp", label: "HEIC → WebP" },
  { href: "/heic-to-avif", label: "HEIC → AVIF" },
];

export default function WhatIsHeic() {
  return (
    <>
      <JsonLd
        data={articleSchema({
          title: "What is HEIC?",
          description: metadata.description as string,
          url: "https://imageconvert.io/what-is-heic",
          dateModified: "2026-06-15",
        })}
      />
      <Nav />

      <main className="max-w-2xl mx-auto px-6 py-10">
        <p className="ic-section-label mb-2">Format guide</p>
        <h1 className="text-[30px] font-extrabold text-ic-text-900 tracking-tight leading-tight mb-2">
          What is HEIC?
        </h1>
        <p className="text-[13px] text-ic-text-400 mb-8">Updated June 2026</p>

        {/* Quick answer box */}
        <div className="bg-ic-teal-50 border border-ic-teal-100 rounded-ic-lg p-5 mb-8">
          <p className="text-[13px] font-bold text-ic-teal-700 mb-1.5">Quick answer</p>
          <p className="text-[14px] text-ic-text-600 leading-relaxed">
            HEIC (High Efficiency Image Container) is Apple&apos;s default photo format since iOS 11.
            It delivers the same quality as JPG at roughly half the file size — but many apps and
            devices still don&apos;t support it, which is why people need to convert it.
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            Why Apple uses HEIC
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            Before HEIC, iPhones saved photos as JPG. JPG is universally compatible but inefficient —
            a typical iPhone photo runs 3–6 MB. With iOS 11 in 2017, Apple switched to HEIC, which
            uses the HEVC (H.265) compression algorithm to achieve roughly 50% smaller files at
            equivalent or better visual quality. A 4 MB JPG becomes a 2 MB HEIC — significant when
            you&apos;re storing thousands of photos on a phone.
          </p>

          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            Why you might need to convert it
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            While macOS, iOS, and recent versions of Windows 11 can open HEIC files, many apps,
            websites, and older devices cannot. Social media platforms, email clients, and most
            photo editing software still expect JPG or PNG. When you share a HEIC file with
            someone on an Android device or Windows 10, they may see an error or a blank preview.
            Converting to JPG solves this instantly.
          </p>

          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            Quality and size trade-offs
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            Converting HEIC to JPG involves a small quality trade-off since JPG uses its own
            lossy compression. At 90% quality (our default), the difference is visually
            imperceptible for most photographs. If you need pixel-perfect fidelity — for example,
            for professional photo editing — convert to PNG instead. PNG is lossless but
            produces larger files than JPG.
          </p>

          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            How to open or convert HEIC on any device
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-1">
            <strong>iPhone / iPad:</strong> Go to Settings → Camera → Formats → Most Compatible.
            This makes the Camera app save new photos as JPG instead of HEIC going forward.
          </p>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-1">
            <strong>Mac:</strong> Preview can open HEIC natively and export to JPG via File → Export.
          </p>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            <strong>Windows / Linux / anywhere:</strong> Use this converter — drop the HEIC files,
            get JPG (or PNG, WebP, AVIF) back in seconds, nothing uploaded.
          </p>

          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            Is HEIC private?
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            HEIC files embed EXIF metadata including GPS location, camera model, and timestamp —
            the same as JPG. If you&apos;re sharing photos publicly, consider stripping this metadata.
            Our converter preserves EXIF by default; a future Pro feature will offer metadata removal.
          </p>
        </div>

        {/* Mid-page converter CTA */}
        <div className="bg-white border border-ic-cream-b rounded-ic-lg p-5 my-8 shadow-ic-sm">
          <p className="text-[14px] font-bold text-ic-text-900 mb-1">
            Ready to convert your HEIC files?
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
        <p className="ic-section-label mt-8 mb-3">HEIC converters</p>
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
