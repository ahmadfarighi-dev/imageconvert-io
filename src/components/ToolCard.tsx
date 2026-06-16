import Link from "next/link";

const ImageIcon = ({ violet = false }: { violet?: boolean }) => (
  <div
    className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0
               ${violet
                 ? 'bg-ic-violet-50 border border-ic-violet-100'
                 : 'bg-ic-teal-50 border border-ic-teal-100'}`}
  >
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="14" height="12" rx="2.5"
            stroke={violet ? "#7C3AED" : "#0D9488"} strokeWidth="1.4" />
      <path d="M5 11l2.5-3 2 2.5 1.5-2L14 11"
            stroke={violet ? "#7C3AED" : "#0D9488"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const GuideIcon = ({ violet = false }: { violet?: boolean }) => (
  <div
    className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0
               ${violet
                 ? 'bg-ic-violet-50 border border-ic-violet-100'
                 : 'bg-ic-teal-50 border border-ic-teal-100'}`}
  >
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 3v12M9 3l-3 3M9 3l3 3" stroke={violet ? "#7C3AED" : "#0D9488"}
            strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 13h12" stroke={violet ? "#7C3AED" : "#0D9488"} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  </div>
);

interface ToolCardProps {
  href: string;
  name: string;
  desc: string;
  volume?: string;
  violet?: boolean;
  isGuide?: boolean;
}

export default function ToolCard({ href, name, desc, volume, violet = false, isGuide = false }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="ic-card flex flex-col gap-2.5 p-4 cursor-pointer no-underline
                 hover:border-ic-teal-300 hover:shadow-[0_4px_16px_rgba(13,148,136,.12)]
                 hover:-translate-y-0.5 transition-all duration-150 group"
    >
      <div className="flex items-center justify-between">
        {isGuide
          ? <GuideIcon violet={violet} />
          : <ImageIcon violet={violet} />}
        <span className="text-ic-text-400 text-base font-light">→</span>
      </div>
      <p className="text-[13px] font-extrabold text-ic-text-900 tracking-tight leading-tight">
        {name}
      </p>
      <p className="text-[11px] text-ic-text-400 leading-relaxed">{desc}</p>
      {volume && (
        <span
          className={`text-[10px] font-semibold rounded-full px-2 py-0.5 w-fit
                      ${violet
                        ? 'text-ic-violet-700 bg-ic-violet-50'
                        : 'text-ic-teal-600 bg-ic-teal-50'}`}
        >
          {volume}
        </span>
      )}
    </Link>
  );
}
