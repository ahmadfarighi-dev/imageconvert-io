import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-6 py-5
                       bg-white border-t border-ic-cream-b text-[11px] text-ic-text-400">
      <div className="font-bold text-ic-text-900 text-[13px]">
        image<span className="text-ic-teal-600">convert</span>
      </div>
      <div className="flex gap-4">
        <Link href="/privacy" className="hover:text-ic-teal-600 transition-colors">Privacy</Link>
        <Link href="/" className="hover:text-ic-teal-600 transition-colors">All tools</Link>
      </div>
      <span>100% client-side · no cookies</span>
    </footer>
  );
}
