import Link from "next/link";

const HEIC_TOOLS = [
  { href: "/heic-to-jpg", label: "HEIC → JPG" },
  { href: "/heic-to-png", label: "HEIC → PNG" },
  { href: "/heic-to-webp", label: "HEIC → WebP" },
  { href: "/heic-to-avif", label: "HEIC → AVIF" },
];

const AVIF_TOOLS = [
  { href: "/avif-to-jpg", label: "AVIF → JPG" },
  { href: "/avif-to-png", label: "AVIF → PNG" },
];

const LogoIcon = () => (
  <div className="w-7 h-7 bg-ic-teal-600 rounded-ic-sm flex items-center justify-center flex-shrink-0">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity=".9" />
      <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity=".6" />
      <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".6" />
      <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".9" />
    </svg>
  </div>
);

export default function Nav() {
  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5
                 bg-white border-b border-ic-cream-b"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 no-underline">
        <LogoIcon />
        <span className="text-[17px] font-extrabold text-ic-text-900 tracking-tight leading-none">
          image<span className="text-ic-teal-600">convert</span>
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-1">
        {/* HEIC dropdown */}
        <div className="group relative">
          <button
            className="flex items-center gap-1 text-[13px] font-medium text-ic-text-600
                       px-3 py-1.5 rounded-ic-sm hover:bg-ic-teal-50 hover:text-ic-teal-600
                       transition-colors duration-150"
            aria-haspopup="true"
          >
            HEIC
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div
            className="absolute left-0 top-full mt-1 w-44 bg-white border border-ic-cream-b
                       rounded-ic-md shadow-ic-md py-1 opacity-0 pointer-events-none
                       group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50"
          >
            {HEIC_TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="block px-3.5 py-2 text-[13px] font-medium text-ic-text-600
                           hover:bg-ic-teal-50 hover:text-ic-teal-600 transition-colors"
              >
                {t.label}
              </Link>
            ))}
            <div className="border-t border-ic-cream-b my-1" />
            <Link
              href="/what-is-heic"
              className="block px-3.5 py-2 text-[13px] font-medium text-ic-text-400
                         hover:bg-ic-teal-50 hover:text-ic-teal-600 transition-colors"
            >
              What is HEIC?
            </Link>
          </div>
        </div>

        {/* AVIF dropdown */}
        <div className="group relative">
          <button
            className="flex items-center gap-1 text-[13px] font-medium text-ic-text-600
                       px-3 py-1.5 rounded-ic-sm hover:bg-ic-teal-50 hover:text-ic-teal-600
                       transition-colors duration-150"
            aria-haspopup="true"
          >
            AVIF
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div
            className="absolute left-0 top-full mt-1 w-44 bg-white border border-ic-cream-b
                       rounded-ic-md shadow-ic-md py-1 opacity-0 pointer-events-none
                       group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50"
          >
            {AVIF_TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="block px-3.5 py-2 text-[13px] font-medium text-ic-text-600
                           hover:bg-ic-teal-50 hover:text-ic-teal-600 transition-colors"
              >
                {t.label}
              </Link>
            ))}
            <div className="border-t border-ic-cream-b my-1" />
            <Link
              href="/what-is-avif"
              className="block px-3.5 py-2 text-[13px] font-medium text-ic-text-400
                         hover:bg-ic-teal-50 hover:text-ic-teal-600 transition-colors"
            >
              What is AVIF?
            </Link>
          </div>
        </div>

        {/* Pro chip */}
        <span className="ml-2 text-[12px] font-bold text-ic-teal-600 bg-ic-teal-50
                         border border-ic-teal-100 rounded-ic-sm px-3.5 py-1.5 cursor-default">
          Pro
        </span>
      </div>
    </nav>
  );
}
