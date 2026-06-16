import type { OutputFormat } from "@/engine";

export interface ToolConfig {
  /** URL slug, e.g. 'heic-to-jpg' */
  slug: string;
  fromLabel: string;      // 'HEIC'
  toLabel: string;        // 'JPG'
  outputFormat: OutputFormat;
  /** Accepted MIME types / extensions for the file picker */
  acceptedExtensions: string[];
  h1: string;
  metaDescription: string;
  /** Label on the "Choose files" button */
  chooseLabel: string;
  /** Format-specific accepted line below the drop zone */
  acceptsNote: string;
  cluster: "heic" | "avif";
  /** slugs of related tool pages to show at the bottom */
  related: string[];
  /** Unique body copy (2-3 sentences) shown in the content section */
  uniqueContent: string;
  /** 4 FAQ entries */
  faq: { q: string; a: string }[];
  /** Monthly search volume (approx) for display on homepage card */
  monthlyVolume: string;
}

const HEIC_FAQ_BASE: ToolConfig["faq"] = [
  {
    q: "Are my photos uploaded to a server?",
    a: "Never. All conversion happens locally in your browser using WebAssembly. Your files never leave your device — we cannot see them.",
  },
  {
    q: "Why does my iPhone use HEIC instead of JPG?",
    a: "Apple switched to HEIC in iOS 11 because it stores the same quality in roughly half the file size. The downside is that many apps still expect JPG.",
  },
  {
    q: "How many files can I convert at once?",
    a: "Up to 10 files free per batch, with ZIP download included. Pro removes the limit.",
  },
  {
    q: "Is there a file size limit?",
    a: "Free tier: 25 MB per file. Pro removes the limit.",
  },
];

const AVIF_FAQ_BASE: ToolConfig["faq"] = [
  {
    q: "Are my files uploaded anywhere?",
    a: "No. Conversion runs entirely in your browser via WebAssembly. Your files never leave your device.",
  },
  {
    q: "What is AVIF?",
    a: "AVIF (AV1 Image File Format) is a next-generation image format offering significantly better compression than JPG or WebP at the same visual quality.",
  },
  {
    q: "How many files can I convert at once?",
    a: "Up to 10 files free per batch, with ZIP download included. Pro removes the limit.",
  },
  {
    q: "Is there a file size limit?",
    a: "Free tier: 25 MB per file. Pro removes the limit.",
  },
];

export const TOOLS: ToolConfig[] = [
  {
    slug: "heic-to-jpg",
    fromLabel: "HEIC",
    toLabel: "JPG",
    outputFormat: "jpeg",
    acceptedExtensions: [".heic", ".heif"],
    h1: "Convert HEIC to JPG in seconds",
    metaDescription:
      "Free HEIC to JPG converter. Works entirely in your browser — photos never uploaded. Batch convert up to 10 files and download as ZIP.",
    chooseLabel: "Choose HEIC Files",
    acceptsNote: "Accepts .heic · .heif · Multiple files OK",
    cluster: "heic",
    related: ["heic-to-png", "heic-to-webp", "avif-to-jpg", "what-is-heic"],
    uniqueContent:
      "HEIC (High Efficiency Image Container) is the format iPhones use by default since iOS 11. It delivers the same photo quality as JPG at roughly half the file size — great for storage, frustrating when you need to share with someone on Windows or an older app. This converter decodes your HEIC files using a WebAssembly build of libheif running directly in your browser, then re-encodes to JPG at 90% quality — visually indistinguishable from the original for most photos.",
    faq: [
      ...HEIC_FAQ_BASE.slice(0, 2),
      {
        q: "Will I lose quality converting HEIC to JPG?",
        a: "JPG is lossy, so there is a small quality trade-off. We default to 90% quality, which is visually indistinguishable from the original for most photos while still being significantly smaller than PNG.",
      },
      HEIC_FAQ_BASE[2],
    ],
    monthlyVolume: "~110K/mo",
  },
  {
    slug: "heic-to-png",
    fromLabel: "HEIC",
    toLabel: "PNG",
    outputFormat: "png",
    acceptedExtensions: [".heic", ".heif"],
    h1: "Convert HEIC to PNG — Lossless",
    metaDescription:
      "Free HEIC to PNG converter. Lossless output with transparency support. Runs in your browser — no uploads, no account.",
    chooseLabel: "Choose HEIC Files",
    acceptsNote: "Accepts .heic · .heif · Multiple files OK",
    cluster: "heic",
    related: ["heic-to-jpg", "heic-to-webp", "avif-to-png", "what-is-heic"],
    uniqueContent:
      "PNG is a lossless format — every pixel is preserved exactly from the original. That makes HEIC→PNG ideal when you need to edit the result further (e.g., in Photoshop or Canva) without generation loss, or when the image contains transparency. The trade-off: PNG files are significantly larger than JPG. If file size matters more than pixel-perfect quality, use HEIC→JPG instead.",
    faq: [
      HEIC_FAQ_BASE[0],
      {
        q: "Does HEIC support transparency, and will PNG preserve it?",
        a: "HEIC does support an alpha channel, and PNG will preserve it. If you need transparency in the output, PNG is the right choice over JPG.",
      },
      {
        q: "Why are PNG files so much bigger than JPG?",
        a: "PNG uses lossless compression — no data is thrown away — so files are larger. For photos, JPG is usually the better choice. PNG shines for graphics, screenshots, and images with transparency.",
      },
      HEIC_FAQ_BASE[2],
    ],
    monthlyVolume: "~28K/mo",
  },
  {
    slug: "heic-to-webp",
    fromLabel: "HEIC",
    toLabel: "WebP",
    outputFormat: "webp",
    acceptedExtensions: [".heic", ".heif"],
    h1: "Convert HEIC to WebP",
    metaDescription:
      "Free HEIC to WebP converter. Modern web format, smaller than JPG. Runs in your browser — no uploads.",
    chooseLabel: "Choose HEIC Files",
    acceptsNote: "Accepts .heic · .heif · Multiple files OK",
    cluster: "heic",
    related: ["heic-to-jpg", "heic-to-png", "avif-to-jpg", "what-is-heic"],
    uniqueContent:
      "WebP is Google's modern image format designed for the web. It typically produces files 25–35% smaller than JPG at equivalent visual quality, with support for both lossy and lossless compression plus transparency. If you're uploading photos to a website or web app, HEIC→WebP gives you excellent quality at the smallest file size among widely supported formats. All major browsers have supported WebP since 2022.",
    faq: [
      HEIC_FAQ_BASE[0],
      {
        q: "Is WebP supported everywhere?",
        a: "WebP is supported in all modern browsers (Chrome, Firefox, Safari 14+, Edge). For older Safari or non-browser use cases, JPG is safer.",
      },
      {
        q: "What quality level does the converter use?",
        a: "We default to 82% quality, which provides an excellent balance between file size and visual quality. This is configurable in the Pro tier.",
      },
      HEIC_FAQ_BASE[2],
    ],
    monthlyVolume: "~8K/mo",
  },
  {
    slug: "heic-to-avif",
    fromLabel: "HEIC",
    toLabel: "AVIF",
    outputFormat: "avif",
    acceptedExtensions: [".heic", ".heif"],
    h1: "Convert HEIC to AVIF",
    metaDescription:
      "Free HEIC to AVIF converter. Best-in-class compression for the modern web. Runs in your browser — no uploads.",
    chooseLabel: "Choose HEIC Files",
    acceptsNote: "Accepts .heic · .heif · Multiple files OK",
    cluster: "heic",
    related: ["heic-to-jpg", "heic-to-webp", "avif-to-jpg", "what-is-avif"],
    uniqueContent:
      "AVIF (AV1 Image File Format) is the next generation of web image compression — it routinely produces files 50% smaller than JPG and 20% smaller than WebP at the same visual quality. Browser support is strong in Chrome and Firefox; Safari added full support in version 16. If you're optimizing images for a modern website and your users are on current browsers, HEIC→AVIF gives the best quality-to-size ratio available.",
    faq: [
      HEIC_FAQ_BASE[0],
      {
        q: "Is AVIF supported in all browsers?",
        a: "AVIF is supported in Chrome 85+, Firefox 93+, and Safari 16+. If you need to support older browsers, use WebP or JPG instead.",
      },
      {
        q: "How does AVIF compare to WebP and HEIC?",
        a: "AVIF typically beats WebP by 20% and HEIC by 30–50% in file size at equivalent quality. It is the most efficient format for web delivery available today.",
      },
      HEIC_FAQ_BASE[2],
    ],
    monthlyVolume: "~3K/mo",
  },
  {
    slug: "avif-to-jpg",
    fromLabel: "AVIF",
    toLabel: "JPG",
    outputFormat: "jpeg",
    acceptedExtensions: [".avif"],
    h1: "Convert AVIF to JPG",
    metaDescription:
      "Free AVIF to JPG converter. Universal fallback format. Runs in your browser — no uploads, no account needed.",
    chooseLabel: "Choose AVIF Files",
    acceptsNote: "Accepts .avif · Multiple files OK",
    cluster: "avif",
    related: ["avif-to-png", "heic-to-jpg", "heic-to-webp", "what-is-avif"],
    uniqueContent:
      "AVIF is the most efficient image format for the web, but many apps, email clients, and older devices still don't support it. Converting to JPG gives you universal compatibility — every device, every app, every browser dating back 30 years can open a JPG. This converter decodes your AVIF file using a WebAssembly build of the AV1 decoder and re-encodes to JPG at 90% quality.",
    faq: [
      AVIF_FAQ_BASE[0],
      AVIF_FAQ_BASE[1],
      {
        q: "Will I lose quality converting AVIF to JPG?",
        a: "JPG is a lossy format, so there is a small quality trade-off from the original. We output at 90% quality, which is visually indistinguishable for most images.",
      },
      AVIF_FAQ_BASE[2],
    ],
    monthlyVolume: "~14K/mo",
  },
  {
    slug: "avif-to-png",
    fromLabel: "AVIF",
    toLabel: "PNG",
    outputFormat: "png",
    acceptedExtensions: [".avif"],
    h1: "Convert AVIF to PNG — Lossless",
    metaDescription:
      "Free AVIF to PNG converter. Lossless output with transparency. Runs entirely in your browser — no uploads.",
    chooseLabel: "Choose AVIF Files",
    acceptsNote: "Accepts .avif · Multiple files OK",
    cluster: "avif",
    related: ["avif-to-jpg", "heic-to-png", "heic-to-jpg", "what-is-avif"],
    uniqueContent:
      "PNG gives you a lossless copy of your AVIF image — every pixel preserved exactly. This is the right choice when you need to edit the image further without any quality loss, or when the image contains transparency that AVIF encoded and you want PNG to preserve. For web delivery where file size matters, AVIF or JPG are better choices; use PNG when edit headroom or transparency is the priority.",
    faq: [
      AVIF_FAQ_BASE[0],
      AVIF_FAQ_BASE[1],
      {
        q: "Does AVIF support transparency, and will PNG preserve it?",
        a: "Yes — AVIF supports an alpha channel, and PNG will preserve it. If your AVIF has transparent areas, PNG is the correct output format.",
      },
      AVIF_FAQ_BASE[2],
    ],
    monthlyVolume: "~7K/mo",
  },
];

/** Look up a ToolConfig by slug. Returns undefined for unknown slugs. */
export function getToolConfig(slug: string): ToolConfig | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

/** All valid tool slugs (used in generateStaticParams). */
export const TOOL_SLUGS = TOOLS.map((t) => t.slug);
