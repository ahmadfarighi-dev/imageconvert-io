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
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            HEIC stands for &quot;High Efficiency Image Container.&quot; It&apos;s actually Apple&apos;s
            specific implementation of a broader standard called HEIF (High Efficiency Image
            Format), developed by the Moving Picture Experts Group (MPEG) — the same body behind
            MP4 video. The terms get used almost interchangeably, but technically HEIF is the
            container format and HEIC refers to files inside that container encoded with HEVC.
            You&apos;ll sometimes see a file end in <code className="text-[13px] bg-ic-cream-b px-1 py-0.5 rounded">.heif</code>{" "}
            instead of <code className="text-[13px] bg-ic-cream-b px-1 py-0.5 rounded">.heic</code> — for
            practical purposes on an iPhone, they behave the same way.
          </p>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            The efficiency gain comes from how HEVC encodes images. Where JPG divides a photo into
            8×8 pixel blocks and compresses each independently, HEVC uses larger, variable-size
            blocks and predicts pixel values from neighboring regions before storing only the
            difference. It also supports 16-bit color depth (versus JPG&apos;s 8-bit), so HEIC
            photos can preserve smoother gradients in skies and skin tones with less banding.
            Since iOS 11 launched in September 2017, every iPhone photo and screenshot — by
            default — has been saved in this format, which means well over a billion devices now
            produce HEIC images daily.
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
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            On Windows 10 and older Windows 11 installs without the HEIF extension, double-clicking
            a HEIC file often produces a generic &quot;This file format is not supported&quot;
            message in Photos, or the thumbnail simply renders blank in File Explorer. On Android,
            support is inconsistent: Android 10 and later can decode HEIC at the OS level, but many
            third-party apps — older messaging clients, some upload widgets on e-commerce or
            government sites, and a long tail of web forms — still reject the file outright or
            silently fail. Uploading a HEIC photo to a site that expects JPG can also produce a
            broken image icon with no error at all, which is one of the more confusing failure
            modes users run into.
          </p>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            Batch conversion is the other common scenario. Someone switching from iPhone to a
            Windows PC, replacing a lost phone, or backing up a camera roll to a NAS or cloud
            archive will often have thousands of HEIC files accumulated over several years. Photo
            management tools, slideshow software, and print services frequently can&apos;t ingest
            HEIC directly, so converting the entire library to JPG in one pass — rather than
            one file at a time — is the practical fix.
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
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            Because HEIC is already a fairly aggressive compression format, converting to JPG
            usually means the output file is larger than the original HEIC, not smaller — you&apos;re
            trading file size for compatibility, not gaining efficiency. A 2 MB HEIC photo might
            become a 3.5–4 MB JPG at high quality settings. If storage space matters more than
            universal compatibility, converting to WebP or AVIF instead of JPG can keep file sizes
            small while still working in most modern browsers and apps.
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
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            Windows 10 and 11 users can also install the free &quot;HEIF Image Extensions&quot; and
            &quot;HEVC Video Extensions&quot; from the Microsoft Store, which lets File Explorer and
            Photos preview and open HEIC files natively — though this still doesn&apos;t help when
            uploading to a website that only accepts JPG or PNG. Android users have a few apps
            capable of opening HEIC, but coverage is spotty across manufacturers and Android
            versions, so a browser-based converter that works regardless of OS is usually the more
            reliable option, especially for one-off shares.
          </p>

          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            Is HEIC private?
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            HEIC files embed EXIF metadata including GPS location, camera model, and timestamp —
            the same as JPG. If you&apos;re sharing photos publicly, consider stripping this metadata.
            Our converter preserves EXIF by default; a future Pro feature will offer metadata removal.
          </p>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            The EXIF block in a typical iPhone HEIC photo can include precise latitude and
            longitude (often accurate to a few meters), the date and time the photo was taken, the
            exact iPhone model, lens used, shutter speed, ISO, and even orientation data from the
            device&apos;s gyroscope. This is harmless for personal backups, but it becomes a real
            privacy concern when posting photos to social media, online marketplaces, or forums —
            GPS coordinates embedded in a photo of your house, car, or workplace can reveal exactly
            where it was taken. Many social platforms strip this data automatically on upload, but
            not all of them do, and direct file shares (email, messaging apps, cloud links) usually
            preserve it untouched.
          </p>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            If privacy matters for a specific photo, the safest approach is to strip EXIF data
            before sharing rather than relying on the receiving platform to do it. On iPhone, you
            can remove location data per-photo from the Info panel in the Photos app. On desktop,
            re-exporting or re-encoding an image (which is effectively what a format conversion
            does) often drops most or all of the original EXIF block unless metadata preservation
            is explicitly requested — worth checking in any tool before assuming your data was
            removed.
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
