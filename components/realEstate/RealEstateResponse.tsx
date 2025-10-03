"use client";

import React, { useState } from "react";

interface Props {
  onClose: () => void;
  onRegenerate: () => void;
  text: string;
  loading: boolean;
}

const RealEstateResponse = ({ onClose, onRegenerate, text, loading }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "homelisterai-listing.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = () => {
    if (loading || !text) return;
    onRegenerate();
  };

  const regenerateDisabled = loading || !text;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Descriere generată</h2>
          {!loading && text && (
            <p className="mt-1 text-xs text-gray-500">
              Copiază textul, descarcă varianta curentă sau generează încă o versiune folosind aceleași detalii.
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={loading || !text}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? "Copiat!" : "Copiază"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={loading || !text}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Descarcă
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerateDisabled}
            className={
              `inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition ` +
              (regenerateDisabled
                ? "cursor-not-allowed bg-indigo-200 text-indigo-500"
                : "bg-indigo-600 text-white hover:bg-indigo-500")
            }
          >
            Generează din nou
          </button>
        </div>
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
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-gray-500">
            <p>Rezultatul va apărea aici după ce trimiți formularul din stânga.</p>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Închide panoul
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealEstateResponse;
