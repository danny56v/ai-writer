"use client";

import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface Props {
  onClose: () => void;
  onRegenerate: () => void;
  text: string;
  loading: boolean;
  requestSeq: number;
  resultSeq: number;
  totalResults: number;
  currentIndex: number;
  onNavigate: (direction: -1 | 1) => void;
}

const RealEstateResponse = ({
  onClose,
  onRegenerate,
  text,
  loading,
  requestSeq,
  resultSeq,
  totalResults,
  currentIndex,
  onNavigate,
}: Props) => {
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setCopied(false);
  }, [text, currentIndex]);

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
    link.download = "listologyai-listing.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isWaitingNewAnswer = requestSeq > resultSeq;

  const regenerateDisabled = isWaitingNewAnswer || loading || !text;

  const handleRegenerate = () => {
    if (regenerateDisabled) return;
    onRegenerate();
  };

  return (
    <div className="relative w-full overflow-hidden bg-white sm:rounded-3xl sm:border sm:border-indigo-100/60 sm:bg-gradient-to-br sm:from-white sm:via-indigo-50/50 sm:to-white sm:shadow-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 hidden h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl sm:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 left-16 hidden h-64 w-64 rounded-full bg-purple-200/40 blur-3xl sm:block"
      />

      <div className="relative flex flex-col gap-5 p-3 sm:p-6">
        <header className="flex flex-col gap-4 rounded-xl border border-white/60 bg-white/90 p-3 shadow-sm sm:rounded-2xl sm:bg-white/80 sm:p-4 sm:backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-lg">
                <SparklesIcon className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">AI result</p>
                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">Generated description</h2>
                {!loading && text ? (
                  <p className="mt-1 text-xs text-gray-500">
                    Copy the draft, download it, or generate another version while keeping the same details.
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-400">
                    Fill out the form to view the generated description here.
                  </p>
                )}
              </div>
            </div>

            <div>
              <span
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow-inner",
                  loading || isWaitingNewAnswer
                    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                    : text
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200",
                ].join(" ")}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={[
                      "absolute inline-flex h-full w-full rounded-full opacity-75",
                      loading || isWaitingNewAnswer ? "animate-ping bg-amber-400" : "bg-emerald-300",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "relative inline-flex h-2 w-2 rounded-full",
                      loading || isWaitingNewAnswer ? "bg-amber-500" : text ? "bg-emerald-500" : "bg-indigo-400",
                    ].join(" ")}
                  />
                </span>
                {loading || isWaitingNewAnswer
                  ? "Generating a new version…"
                  : text
                  ? `Version ${currentIndex + 1} of ${totalResults}`
                  : "Waiting for the first result"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-white/70 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm backdrop-blur-sm">
              <button
                type="button"
                onClick={() => onNavigate(-1)}
                disabled={totalResults === 0 || currentIndex <= 0}
                className="rounded-full p-1 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous result"
              >
                <ChevronLeftIcon className="h-4 w-4" aria-hidden />
              </button>
              <span className="min-w-[4rem] text-center">
                {totalResults > 0 ? `${currentIndex + 1}/${totalResults}` : "0/0"}
              </span>
              <button
                type="button"
                onClick={() => onNavigate(1)}
                disabled={totalResults === 0 || currentIndex >= totalResults - 1}
                className="rounded-full p-1 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next result"
              >
                <ChevronRightIcon className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!text}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ClipboardDocumentCheckIcon className="h-4 w-4" aria-hidden />
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!text}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ArrowDownTrayIcon className="h-4 w-4" aria-hidden />
                Download
              </button>
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={regenerateDisabled}
                aria-busy={isWaitingNewAnswer || loading || undefined}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                  regenerateDisabled
                    ? "bg-indigo-300 text-indigo-100"
                    : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 hover:from-indigo-500 hover:via-indigo-500 hover:to-purple-500",
                ].join(" ")}
              >
                {isWaitingNewAnswer || loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3.5a4.5 4.5 0 0 0-4.5 4.5H4z" />
                    </svg>
                    Regenerating…
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="h-4 w-4" aria-hidden />
                    Generate again
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-xl bg-white shadow-inner sm:rounded-2xl sm:border sm:border-indigo-100/70 sm:bg-white/75 sm:backdrop-blur">
          <div className="relative px-3 py-6 sm:px-6">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-32 bg-gradient-to-l from-white via-white/70 to-transparent sm:block"
            />
            {loading ? (
              <div className="relative flex min-h-[220px] flex-col justify-center gap-8">
                <div className="flex items-center gap-3 text-sm font-medium text-indigo-600">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm ring-1 ring-indigo-200">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-base font-semibold text-indigo-700">Crafting a standout version…</p>
                    <p className="text-xs text-indigo-500/80">The algorithm blends your details with optimized templates.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className="animate-pulse space-y-3 rounded-2xl border border-indigo-100/70 bg-gradient-to-br from-white via-indigo-50/60 to-white p-4 shadow-sm"
                    >
                      <div className="h-2.5 w-3/4 rounded-full bg-indigo-200/80" />
                      <div className="h-2 w-full rounded-full bg-indigo-100/70" />
                      <div className="h-2 w-5/6 rounded-full bg-indigo-100/60" />
                    </div>
                  ))}
                </div>
              </div>
            ) : text ? (
              <article className="relative space-y-4 text-sm leading-6 text-gray-700">
                {text
                  .split(/\n{2,}/)
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)
                  .map((paragraph, idx, arr) => {
                    const isTitle = idx === 0 && /^\*\*(.+)\*\*$/.test(paragraph);
                    const isHashtags = idx === arr.length - 1 && /(^|\s)#/.test(paragraph) && paragraph.replace(/#\w+/g, "").trim().length < paragraph.length;

                    if (isTitle) {
                      const titleText = paragraph.replace(/^\*\*(.+)\*\*$/, "$1").trim();
                      return (
                        <h3
                          key={`title-${idx}`}
                          className="rounded-xl bg-white/80 px-4 py-3 text-base font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-100"
                        >
                          {titleText}
                        </h3>
                      );
                    }

                    if (isHashtags) {
                      return (
                        <p
                          key={`hashtags-${idx}`}
                          className="rounded-xl bg-indigo-50/70 px-4 py-3 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-indigo-100"
                        >
                          {paragraph}
                        </p>
                      );
                    }

                    return (
                      <p key={`paragraph-${idx}`} className="rounded-xl bg-white/70 p-4 shadow-sm ring-1 ring-indigo-50">
                        {paragraph.split("\n").map((line, lineIdx) => (
                          <React.Fragment key={lineIdx}>
                            {lineIdx > 0 ? <br /> : null}
                            {line}
                          </React.Fragment>
                        ))}
                      </p>
                    );
                  })}
              </article>
            ) : (
              <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 text-center text-sm text-gray-500">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <SparklesIcon className="h-6 w-6" aria-hidden />
                </span>
                <p className="max-w-xs text-sm text-gray-500">
                  Your generated result will appear here as soon as you submit the property information.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-500"
                >
                  Close panel
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RealEstateResponse;
