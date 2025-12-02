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
  imageUrl?: string | null;
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
  imageUrl,
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
    <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-100 bg-gradient-to-b from-white via-neutral-50 to-white shadow-[0_55px_140px_-70px_rgba(15,23,42,0.45)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-8 hidden h-72 w-72 rounded-full bg-neutral-100 blur-3xl sm:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 left-8 hidden h-64 w-64 rounded-full bg-neutral-100/60 blur-3xl sm:block"
      />

      <div className="relative flex flex-col gap-4 p-4 ">
        <header className="flex flex-col gap-4 rounded-xl border border-neutral-100 bg-white/90 p-4 shadow-[0_35px_80px_-60px_rgba(15,23,42,0.45)] sm:gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-[0_25px_60px_-40px_rgba(15,23,42,0.9)]">
                <SparklesIcon className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] ">AI result</p>
                <h2 className="text-base font-semibold  sm:text-lg">Generated description</h2>
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
                    : "bg-neutral-50 ring-1 ring-neutral-200",
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
                      loading || isWaitingNewAnswer ? "bg-amber-500" : text ? "bg-emerald-500" : "bg-neutral-400",
                    ].join(" ")}
                  />
                </span>
                {loading || isWaitingNewAnswer
                  ? "Generating a new version…"
                  : text
                  ? `Ready`
                  : "Waiting for the first result"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-200/80 bg-white/80 px-2.5 py-1 text-xs font-semibold shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)]">
              <button
                type="button"
                onClick={() => onNavigate(-1)}
                disabled={totalResults === 0 || currentIndex <= 0}
                className="rounded-lg p-1 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
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
                className="rounded-lg p-1 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
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
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)] transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ClipboardDocumentCheckIcon className="h-4 w-4" aria-hidden />
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!text}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold  shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)] transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                  "inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_30px_70px_-40px_rgba(15,23,42,0.9)] transition",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                  regenerateDisabled ? "bg-neutral-400 text-neutral-100" : "bg-neutral-900 hover:bg-neutral-800",
                ].join(" ")}
              >
                {isWaitingNewAnswer || loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 0 1 8-8v3.5a4.5 4.5 0 0 0-4.5 4.5H4z"
                      />
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

        {imageUrl && !loading ? (
          <figure className="">
            <div className="overflow-hidden rounded-xl bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Street View preview of the property"
                className="h-64 w-full object-cover sm:h-72"
                loading="lazy"
              />
            </div>
            <figcaption className="mt-2 px-2 text-center text-xs ">
              Captured automatically from Google Street View to keep the copy realistic.
            </figcaption>
          </figure>
        ) : null}

        <section className="">
          <div className="relative ">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-32 bg-gradient-to-l from-white via-white/70 to-transparent sm:block"
            />
            {loading ? (
              <div className="relative flex min-h-[220px] flex-col justify-center gap-8">
                <div className="flex items-center gap-3 text-sm font-medium ">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 shadow-sm ring-1 ring-neutral-200">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-base font-semibold ">Crafting a standout version…</p>
                    <p className="text-xs ">The algorithm blends your details with optimized templates.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className="animate-pulse space-y-3 rounded-2xl border border-neutral-100 bg-white/80 p-4 shadow-[0_20px_50px_-45px_rgba(15,23,42,0.6)]"
                    >
                      <div className="h-2.5 w-3/4 rounded-full bg-neutral-200/80" />
                      <div className="h-2 w-full rounded-full bg-neutral-100/70" />
                      <div className="h-2 w-5/6 rounded-full bg-neutral-100/60" />
                    </div>
                  ))}
                </div>
              </div>
            ) : text ? (
              <article className="relative space-y-2 text-sm leading-6 ">
                {text
                  .split(/\n{2,}/)
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)
                  .map((paragraph, idx, arr) => {
                    const isTitle = idx === 0 && /^\*\*(.+)\*\*$/.test(paragraph);
                    const isHashtags =
                      idx === arr.length - 1 &&
                      /(^|\s)#/.test(paragraph) &&
                      paragraph.replace(/#\w+/g, "").trim().length < paragraph.length;

                    if (isTitle) {
                      const titleText = paragraph.replace(/^\*\*(.+)\*\*$/, "$1").trim();
                      return (
                        <h3
                          key={`title-${idx}`}
                          className="rounded-xl border text-black border-neutral-200/70 bg-white/90 px-4 py-3 text-base font-semibold shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)]"
                        >
                          {titleText}
                        </h3>
                      );
                    }

                    if (isHashtags) {
                      return (
                        <p
                          key={`hashtags-${idx}`}
                          className="rounded-xl border border-neutral-200/70 bg-neutral-50/80 px-4 py-3 text-sm font-semibold shadow-[0_12px_35px_-28px_rgba(15,23,42,0.4)]"
                        >
                          {paragraph}
                        </p>
                      );
                    }

                    return (
                      <p
                        key={`paragraph-${idx}`}
                        className="rounded-xl border border-neutral-100 bg-white/90 p-4 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.4)]"
                      >
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
              <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 text-center text-sm ">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 ">
                  <SparklesIcon className="h-6 w-6" aria-hidden />
                </span>
                <p className="max-w-xs text-sm ">
                  Your generated result will appear here as soon as you submit the property information.
                </p>
                <button type="button" onClick={onClose} className="text-xs font-semibold  transition hover:underline">
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
