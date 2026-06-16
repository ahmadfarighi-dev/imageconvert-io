export default function ProBanner() {
  return (
    <div className="mx-6 mb-7 rounded-ic-lg px-6 py-5 flex items-center justify-between gap-4
                    bg-gradient-to-br from-ic-teal-600 to-ic-teal-700 shadow-ic-teal">
      <div>
        <p className="text-[10px] font-extrabold tracking-widest uppercase text-white/70 mb-1.5">
          Pro · Coming soon
        </p>
        <p className="text-[17px] font-extrabold text-white tracking-tight mb-2">
          Need more? Upgrade to Pro.
        </p>
        <div className="flex flex-wrap gap-3.5">
          {["Unlimited files per batch", "No file size cap", "API access"].map((feat) => (
            <span key={feat} className="flex items-center gap-1.5 text-[12px] text-white/80">
              <span className="text-ic-teal-300 font-bold">✓</span>
              {feat}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="bg-white text-ic-teal-700 font-extrabold text-[13px]
                   rounded-ic-md px-5 py-2.5 flex-shrink-0 cursor-pointer border-0
                   hover:bg-ic-teal-50 transition-colors"
      >
        Get notified →
      </button>
    </div>
  );
}
