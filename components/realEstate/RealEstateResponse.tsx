import React from "react";

interface Props {
  onClose: () => void;
  text: string;
  loading: boolean;
}

const RealEstateResponse = ({ onClose, text, loading }: Props) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Generated listing</h2>
        {/* <button onClick={onClose} className="text-sm text-indigo-600 hover:underline">
          Închide
        </button> */}
      </div>

      <div className="mt-4 flex-1 overflow-auto rounded-2xl border border-dashed border-indigo-100 bg-indigo-50/40 p-4 text-sm text-gray-700">
        {loading ? (
          <div className="flex h-full flex-col justify-center gap-6">
            <div className="flex items-center gap-3 text-sm font-medium text-indigo-600">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-indigo-100">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                </svg>
              </span>
              <div>
                <p className="text-base font-semibold text-indigo-700">We’re polishing your listing…</p>
                <p className="text-xs text-indigo-500/80">This usually takes just a few seconds.</p>
              </div>
            </div>

            <div className="space-y-3">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="animate-pulse space-y-2 rounded-xl border border-indigo-100/60 bg-white/70 p-4 shadow-sm"
                >
                  <div className="h-2.5 w-3/4 rounded-full bg-indigo-200/70" />
                  <div className="h-2.5 w-full rounded-full bg-indigo-100/80" />
                  <div className="h-2.5 w-5/6 rounded-full bg-indigo-100/60" />
                </div>
              ))}
            </div>
          </div>
        ) : text ? (
          <pre className="whitespace-pre-wrap rounded-xl border bg-gray-50 p-4 text-sm">{text}</pre>
        ) : (
          <p className="text-sm text-gray-500">No content yet.</p>
        )}
      </div>
    </div>
  );
};

export default RealEstateResponse;
