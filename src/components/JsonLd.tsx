export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function articleSchema({
  title,
  description,
  url,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    dateModified,
    author: { "@type": "Organization", name: "ImageConvert" },
    publisher: { "@type": "Organization", name: "ImageConvert" },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ImageConvert",
    url: "https://imageconvert.io",
    description:
      "Free browser-based image converter. Convert HEIC, AVIF, JPG, PNG and WebP — files never uploaded.",
  };
}
