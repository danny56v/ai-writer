const RealEstateResponse = ({ onClose, text }: { onClose: () => void; text: string }) => {
  const hasText = Boolean(text);

  return (
    <div className="flex h-full flex-col rounded-[2.75rem] border border-white/70 bg-white/90 p-8 shadow-[0_35px_70px_-40px_rgba(34,7,94,0.25)] backdrop-blur">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#efe6ff] pb-5">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d9cfff] bg-[#f3ecff] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#6b4dff]">
            Listing preview
          </span>
          <h2 className="mt-3 text-lg font-semibold text-[color:var(--foreground)]">Aurora&apos;s property narrative</h2>
          <p className="text-sm text-slate-500">Perfect for brochures, landing pages or marketplace listings.</p>
        </div>
        {hasText && (
          <button
            onClick={onClose}
            className="rounded-full border border-[#d9cfff] bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)] transition hover:border-[#c2afff] hover:text-[#6b4dff]"
          >
            Clear
          </button>
        )}
      </header>

      <div className="mt-6 flex-1 overflow-auto rounded-2xl border border-[#efe6ff] bg-[#f8f5ff] p-6 text-sm leading-7 text-slate-700 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
        {hasText ? text : <p className="text-sm text-slate-500">Generate a description to preview the copy here.</p>}
      </div>

      {hasText && (
        <div className="mt-6 grid gap-4 text-xs font-medium text-slate-500 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
            Tone
            <p className="mt-1 text-base font-semibold text-[color:var(--foreground)]">Lifestyle editorial</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
            CTA ready
            <p className="mt-1 text-base font-semibold text-[color:var(--foreground)]">Yes</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
            Suggested length
            <p className="mt-1 text-base font-semibold text-[color:var(--foreground)]">~250 words</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealEstateResponse;
