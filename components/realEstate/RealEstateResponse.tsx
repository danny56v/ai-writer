const RealEstateResponse = ({ onClose, text }: { onClose: () => void; text: string }) => {
  const hasText = Boolean(text);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/80 bg-white/80 p-8 shadow-soft-xl backdrop-blur">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 pb-5">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/60 bg-purple-50/70 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-purple-600">
            Listing preview
          </span>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">Aurora&apos;s property narrative</h2>
          <p className="text-sm text-slate-500">Perfect for brochures, landing pages or marketplace listings.</p>
        </div>
        {hasText && (
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-inner shadow-white/60 transition hover:border-purple-200 hover:text-purple-600"
          >
            Clear
          </button>
        )}
      </header>

      <div className="mt-6 flex-1 overflow-auto rounded-2xl border border-slate-200/60 bg-slate-50/80 p-6 text-sm leading-7 text-slate-700 shadow-inner shadow-white/40">
        {hasText ? text : <p className="text-sm text-slate-500">Generate a description to preview the copy here.</p>}
      </div>

      {hasText && (
        <div className="mt-6 grid gap-4 text-xs font-medium text-slate-500 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3">
            Tone
            <p className="mt-1 text-base font-semibold text-slate-900">Lifestyle editorial</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3">
            CTA ready
            <p className="mt-1 text-base font-semibold text-slate-900">Yes</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3">
            Suggested length
            <p className="mt-1 text-base font-semibold text-slate-900">~250 words</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealEstateResponse;
