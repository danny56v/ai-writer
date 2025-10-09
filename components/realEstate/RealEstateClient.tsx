"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  HashtagIcon,
  HomeModernIcon,
  MapPinIcon,
  PencilSquareIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Transition } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import RealEstateForm from "./RealEstateForm";
import RealEstateResponse from "./RealEstateResponse";

type Plan = { planType: string; currentPeriodEnd: Date | null; status: string };
type RealEstateUsageSummary = {
  limit: number | null;
  remaining: number | null;
  used: number | null;
};

type HistoryEntry = {
  id: string;
  title: string;
  text: string;
  hashtags: string[];
  propertyType: string;
  listingType: string;
  location: string;
  price: number | null;
  bedrooms: string | null;
  bathrooms: string | null;
  language: string;
  amenities: string[];
  createdAt: string;
};

interface Props {
  userPlan: Plan;
  usageSummary: RealEstateUsageSummary;
  isAuthenticated: boolean;
  initialHistory: HistoryEntry[];
}

const historyDateFormatter = new Intl.DateTimeFormat("ro-RO", {
  dateStyle: "medium",
  timeStyle: "short",
});

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const extractBodyParagraphs = (entry: HistoryEntry) => {
  const segments = entry.text
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (segments.length) {
    const potentialTitle = segments[0].replace(/^\*\*(.+)\*\*$/, "$1").trim();
    if (entry.title && potentialTitle && potentialTitle.toLowerCase() === entry.title.toLowerCase()) {
      segments.shift();
    }
  }

  if (segments.length && entry.hashtags.length) {
    const last = segments[segments.length - 1];
    const containsHashtag = /(^|\s)#/.test(last);
    if (containsHashtag) {
      segments.pop();
    }
  }

  return segments;
};

const COLLAPSED_HISTORY_FULL_COUNT = 2;
const COLLAPSED_HISTORY_PREVIEW_COUNT_DESKTOP = 2;
const COLLAPSED_HISTORY_PREVIEW_COUNT_MOBILE = 1;
const HISTORY_LOAD_INCREMENT_DESKTOP = 6;
const HISTORY_LOAD_INCREMENT_MOBILE = 4;

const RealEstateClient = ({ userPlan, usageSummary, isAuthenticated, initialHistory }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regenerateSignal, setRegenerateSignal] = useState(0);
  const [requestSeq, setRequestSeq] = useState(0);
  const [resultSeq, setResultSeq] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const lastSigRef = useRef<string | null>(null);
  const responseContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);
  const [fullyVisibleHistoryCount, setFullyVisibleHistoryCount] = useState(COLLAPSED_HISTORY_FULL_COUNT);
  const [isDesktopHistoryLayout, setIsDesktopHistoryLayout] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 1024;
  });
  const historyCopyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);
      const response = await fetch("/api/real-estate/history");
      if (!response.ok) {
        throw new Error(`Failed to load history: ${response.status}`);
      }
      const data: { history?: HistoryEntry[] } = await response.json();
      if (Array.isArray(data.history)) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error("Failed to refresh history", error);
      setHistoryError("We couldn't load your history. Please try again.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const handleResult = useCallback((value: string) => {
    setResults((prev) => {
      const next = [...prev, value];
      setCurrentIndex(next.length - 1);
      return next;
    });
    setLoading(false);
    setResultSeq((s) => s + 1);
    setExpandedHistoryId(null);
    void refreshHistory();
  }, [refreshHistory]);

  const toggleHistoryEntry = useCallback((id: string) => {
    setExpandedHistoryId((prev) => (prev === id ? null : id));
  }, []);

  const handleHistoryCopy = useCallback(async (entry: HistoryEntry) => {
    if (!entry.text) return;
    try {
      await navigator.clipboard.writeText(entry.text);
      setCopiedHistoryId(entry.id);
      if (historyCopyTimer.current) {
        clearTimeout(historyCopyTimer.current);
      }
      historyCopyTimer.current = setTimeout(() => {
        setCopiedHistoryId((current) => (current === entry.id ? null : current));
        historyCopyTimer.current = null;
      }, 2000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setResultSeq((s) => s + 1);
  }, []);

  const handleSubmitStart = useCallback((sig: string) => {
    setIsOpen(true);
    setLoading(true);
    setRequestSeq((s) => s + 1);

    const prev = lastSigRef.current;
    if (prev !== sig) {
      setResults([]);
      setCurrentIndex(-1);
    }
    lastSigRef.current = sig;

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        const target = responseContainerRef.current;
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const viewportOffset = window.scrollY || window.pageYOffset;
        const desiredOffset = rect.top + viewportOffset - 200;

        window.scrollTo({ top: desiredOffset > 0 ? desiredOffset : 0, behavior: "smooth" });
      });
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      setShowSuccessToast(true);
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  useEffect(() => {
    if (!showSuccessToast) return;
    const timeout = setTimeout(() => setShowSuccessToast(false), 6000);
    return () => clearTimeout(timeout);
  }, [showSuccessToast]);

  useEffect(() => {
    return () => {
      if (historyCopyTimer.current) {
        clearTimeout(historyCopyTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktopHistoryLayout(event.matches);
    };
    setIsDesktopHistoryLayout(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    setFullyVisibleHistoryCount((current) => {
      if (history.length <= COLLAPSED_HISTORY_FULL_COUNT) {
        return history.length;
      }
      return Math.min(Math.max(current, COLLAPSED_HISTORY_FULL_COUNT), history.length);
    });
  }, [history]);

  const previewCount = history.length > fullyVisibleHistoryCount
    ? (isDesktopHistoryLayout ? COLLAPSED_HISTORY_PREVIEW_COUNT_DESKTOP : COLLAPSED_HISTORY_PREVIEW_COUNT_MOBILE)
    : 0;
  const historyRenderLimit = Math.min(history.length, fullyVisibleHistoryCount + previewCount);
  const historyToDisplay = history.slice(0, historyRenderLimit);
  const historyHasMoreToReveal = fullyVisibleHistoryCount < history.length;

  const handleHistoryLoadMore = useCallback(() => {
    setFullyVisibleHistoryCount((current) => {
      const increment = isDesktopHistoryLayout ? HISTORY_LOAD_INCREMENT_DESKTOP : HISTORY_LOAD_INCREMENT_MOBILE;
      const next = Math.min(history.length, current + increment);
      return next;
    });
  }, [history.length, isDesktopHistoryLayout]);

  const handleHistoryShowAll = useCallback(() => {
    setFullyVisibleHistoryCount(history.length);
  }, [history.length]);

  return (
    <div className="mt-10">
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={showSuccessToast}
            enter="transform transition duration-300 ease-out"
            enterFrom="opacity-0 translate-y-2 sm:translate-y-0 sm:translate-x-2"
            enterTo="opacity-100 translate-y-0 translate-x-0"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-semibold text-gray-900">Payment successful!</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Your premium features are now unlocked. Start generating listings right away.
                    </p>
                    <Link
                      href="/profile"
                      className="mt-3 inline-flex text-sm font-semibold text-indigo-600 underline decoration-indigo-300 decoration-2 underline-offset-4 transition hover:text-indigo-700"
                    >
                      View details
                    </Link>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowSuccessToast(false)}
                      className="inline-flex rounded-md bg-white text-gray-400 transition hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/60 via-white to-purple-100/70" />
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-200/60 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white via-white/80 to-transparent" />
        <div className="absolute right-6 bottom-0 hidden h-48 w-48 rounded-full bg-purple-200/50 blur-3xl sm:block" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-white/80 to-white" />
      </div>

      <div className="mx-auto max-w-full px-4 pb-10 pt-8 sm:pt-10">
        <div className="flex flex-col lg:flex-row gap-4">
          <div
            className={[
              // "min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
              "transition-all duration-500 ease-out",
              "w-full p-4",
              isOpen ? "lg:w-7/12" : "lg:w-5xl lg:mx-auto",
            ].join(" ")}
          >
            <RealEstateForm
              userPlan={userPlan}
              usageSummary={usageSummary}
              isAuthenticated={isAuthenticated}
              onLoadingChange={setLoading}
              onResult={handleResult}
              regenerateSignal={regenerateSignal}
              onSubmitStart={handleSubmitStart}
              onError={handleError}
            />
          </div>
          <div
            ref={responseContainerRef}
            className={[
              // "min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
              "transition-all duration-500 ease-out",
              "w-full",
              isOpen ? "lg:w-5/12 md:opacity-100 lg:translate-x-0" : "lg:w-0 md:opacity-0 lg:translate-x-4",
              isOpen ? "opacity-100 translate-y-0 p-4" : "opacity-0 -translate-y-1 p-0 h-0 overflow-hidden",
              isOpen ? "pointer-events-auto" : "pointer-events-none",
            ].join(" ")}
            aria-hidden={!isOpen}
          >
            <RealEstateResponse
              onClose={() => setIsOpen(false)}
              onRegenerate={() => {
                setRegenerateSignal((prev) => prev + 1);
                setLoading(true);
              }}
              loading={loading}
              requestSeq={requestSeq}
              resultSeq={resultSeq}
              text={currentIndex >= 0 ? results[currentIndex] : ""}
              totalResults={results.length}
              currentIndex={currentIndex}
              onNavigate={(direction) => {
                setCurrentIndex((prev) => {
                  const next = prev + direction;
                  if (next < 0 || next >= results.length) return prev;
                  return next;
                });
              }}
            />
          </div>
        </div>
      </div>

      <section className="relative mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
                History
              </span>
              <h2 className="mt-3 text-2xl font-semibold text-gray-900 sm:text-3xl">
                Latest generated descriptions
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Review your recent versions and copy the text without completing the form again.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void refreshHistory()}
                disabled={historyLoading}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {historyLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3.5a4.5 4.5 0 0 0-4.5 4.5H4z" />
                    </svg>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="h-4 w-4" aria-hidden />
                    Refresh history
                  </>
                )}
              </button>
              <span className="text-xs font-semibold text-indigo-500">
                {history.length} {history.length === 1 ? "entry" : "entries"}
              </span>
            </div>
          </div>

          {historyError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {historyError}
            </div>
          ) : null}

          {historyLoading && history.length === 0 ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-3xl border border-indigo-100/70 bg-white/70 p-6 shadow-inner"
                >
                  <div className="h-4 w-1/2 rounded-full bg-indigo-100" />
                  <div className="mt-4 h-3 w-5/6 rounded-full bg-indigo-50" />
                  <div className="mt-2 h-3 w-3/4 rounded-full bg-indigo-50" />
                  <div className="mt-6 space-y-2">
                    <div className="h-2.5 w-full rounded-full bg-indigo-100/70" />
                    <div className="h-2.5 w-5/6 rounded-full bg-indigo-100/70" />
                    <div className="h-2.5 w-4/6 rounded-full bg-indigo-100/70" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!historyLoading && history.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-indigo-200 bg-white/70 p-12 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <SparklesIcon className="h-6 w-6" aria-hidden />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">You do not have any saved generations yet</p>
                <p className="text-sm text-gray-500">
                  Complete the form on the left to start building and saving generated versions here.
                </p>
              </div>
            </div>
          ) : null}

          {history.length > 0 ? (
            <div className="mt-8">
              <div
                className={[
                  "relative",
                  historyHasMoreToReveal ? "pb-24" : "",
                ].join(" ")}
              >
                <div className="grid gap-6 lg:grid-cols-2">
                  {historyToDisplay.map((entry, index) => {
                    const paragraphs = extractBodyParagraphs(entry);
                    const previewSource = paragraphs.length ? paragraphs.join(" ") : entry.text;
                    const preview = previewSource.length > 220 ? `${previewSource.slice(0, 220)}…` : previewSource;
                    const isExpanded = expandedHistoryId === entry.id;
                    const listingLabel = entry.listingType === "rent" ? "Rent" : "Sale";
                    const bedroomLabel = entry.bedrooms
                      ? entry.bedrooms.toLowerCase() === "studio"
                        ? "Studio"
                        : `${entry.bedrooms} ${entry.bedrooms === "1" ? "bedroom" : "bedrooms"}`
                      : null;
                    const bathroomsLabel = entry.bathrooms
                      ? `${entry.bathrooms} ${entry.bathrooms === "1" ? "bathroom" : "bathrooms"}`
                      : null;
                    const amenitiesLabel = entry.amenities.length
                      ? `${entry.amenities.length} ${entry.amenities.length === 1 ? "amenity" : "amenities"}`
                      : null;
                    const isCollapsedPreview = index >= fullyVisibleHistoryCount;
                    const isSecondPreview = index >= fullyVisibleHistoryCount + 1;
                    const cardClasses = [
                      "group relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 p-5 shadow-xl shadow-indigo-100/40 backdrop-blur transition",
                      isCollapsedPreview
                        ? "pointer-events-none max-h-56 opacity-80 saturate-75 ring-1 ring-inset ring-indigo-100/70"
                        : "hover:-translate-y-1 hover:shadow-2xl",
                      isCollapsedPreview && isSecondPreview ? "hidden lg:block" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <article key={entry.id} className={cardClasses} aria-hidden={isCollapsedPreview}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-semibold text-indigo-700">
                              {entry.title || "Untitled listing"}
                            </h3>
                            <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                              <ClockIcon className="h-4 w-4" aria-hidden />
                              {historyDateFormatter.format(new Date(entry.createdAt))}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleHistoryCopy(entry)}
                              className={[
                                "inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50",
                                isCollapsedPreview ? "opacity-60" : "",
                              ].join(" ")}
                              disabled={isCollapsedPreview}
                            >
                              {copiedHistoryId === entry.id ? "Copied" : "Copy"}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleHistoryEntry(entry.id)}
                              className={[
                                "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500",
                                isCollapsedPreview ? "opacity-70" : "",
                              ].join(" ")}
                              disabled={isCollapsedPreview}
                            >
                              {isExpanded ? "Hide" : "View details"}
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-600">
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1">
                            <HomeModernIcon className="h-4 w-4" aria-hidden />
                            {entry.propertyType}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1">
                            <MapPinIcon className="h-4 w-4" aria-hidden />
                            {entry.location}
                          </span>
                          {entry.price !== null ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1">
                              <CurrencyDollarIcon className="h-4 w-4" aria-hidden />
                              {priceFormatter.format(entry.price)}
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1">
                            {listingLabel}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                          <span>{entry.language}</span>
                          {bedroomLabel ? <span>{bedroomLabel}</span> : null}
                          {bathroomsLabel ? <span>{bathroomsLabel}</span> : null}
                          {amenitiesLabel ? <span>{amenitiesLabel}</span> : null}
                        </div>

                        <div className="mt-5 rounded-2xl border border-indigo-50 bg-white/85 p-4 text-sm leading-6 text-gray-700 shadow-inner">
                          {isExpanded ? (
                            <div className="space-y-3">
                              {paragraphs.map((paragraph, paragraphIndex) => (
                                <p key={paragraphIndex}>
                                  {paragraph.split("\n").map((line, lineIdx) => (
                                    <React.Fragment key={lineIdx}>
                                      {lineIdx > 0 ? <br /> : null}
                                      {line}
                                    </React.Fragment>
                                  ))}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p>{preview}</p>
                          )}
                        </div>

                        {entry.hashtags.length ? (
                          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-600">
                            <HashtagIcon className="h-4 w-4 text-indigo-500" aria-hidden />
                            {entry.hashtags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {isCollapsedPreview ? (
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent via-white/75 to-white"
                          />
                        ) : null}
                      </article>
                    );
                  })}
                </div>

                {historyHasMoreToReveal ? (
                  <>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-20 z-10 h-24 bg-gradient-to-b from-transparent via-white/85 to-white"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                      <button
                        type="button"
                        onClick={handleHistoryLoadMore}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Show more
                      </button>
                      <button
                        type="button"
                        onClick={handleHistoryShowAll}
                        className="text-sm font-semibold text-indigo-600 underline decoration-indigo-200 decoration-2 underline-offset-4 transition hover:text-indigo-500"
                      >
                        View full history
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="relative py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 lg:grid-cols-5 lg:items-start lg:px-8">
          <div className="lg:col-span-2 lg:sticky lg:top-6">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Workflow
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How to use the ListologyAi listing generator
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Follow the steps below to move from brief to final description in minutes. Everything you enter is saved so you can quickly adjust tone, language, or audience without starting over.
            </p>
            <dl className="mt-8 space-y-6">
              <div className="flex gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                <DocumentTextIcon className="h-8 w-8 flex-none text-indigo-600" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">1. Complete the brief</dt>
                  <dd className="text-sm leading-6 text-gray-700">
                    Add property details, amenities, tone, and language. The form guides agents and marketers so they never miss persuasive, compliant information.
                  </dd>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                <SparklesIcon className="h-8 w-8 flex-none text-indigo-600" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">2. Generate the description</dt>
                  <dd className="text-sm leading-6 text-gray-700">
                    After you submit the form, ListologyAi blends your context with proven templates to deliver an MLS-ready description optimized for conversion and compliance.
                  </dd>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                <PencilSquareIcon className="h-8 w-8 flex-none text-indigo-600" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">3. Review and refine</dt>
                  <dd className="text-sm leading-6 text-gray-700">
                    Open the results panel to copy the text, download the generated version, or tweak the form to try alternative tones and scenarios.
                  </dd>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                <PaperAirplaneIcon className="h-8 w-8 flex-none text-indigo-600" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">4. Publish or share</dt>
                  <dd className="text-sm leading-6 text-gray-700">
                    After internal approval, send the copy straight to the MLS, your agency site, or a newsletter. Use the same session to create multiple versions and track credit usage.
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="relative lg:col-span-3">
            <div className="absolute -top-24 -right-16 hidden h-64 w-64 rounded-full bg-indigo-100 blur-3xl lg:block" />
            <div className="rounded-3xl border border-indigo-100 bg-white/80 p-4 shadow-xl shadow-indigo-100/40 backdrop-blur-sm">
              <Image
                src="https://images.unsplash.com/photo-1604079628040-94301bb21b11?auto=format&fit=crop&w=1600&q=80"
                alt="ListologyAi listing generator interface"
                width={1200}
                height={850}
                className="w-full rounded-2xl border border-indigo-100 object-cover"
              />
              <p className="mt-4 text-center text-xs font-medium uppercase tracking-wide text-indigo-600">
                Interface preview – ListologyAi form and results panel
              </p>
            </div>
          </div>
        </div>
      </section>
{/* 
      <section className="relative mt-12 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center justify-center rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100">
            Keep exploring
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create a complete experience for your clients
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            After you complete the generator steps, explore resources that help you turn descriptions into cohesive campaigns: case studies, pricing plans, and guides for hybrid teams.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/pricing"
              className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              See upgrade options
            </Link>
            <Link
              href="/blog"
              className="text-sm font-semibold leading-6 text-indigo-700 transition hover:text-indigo-600"
            >
              Discover real stories <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section> */}

    </div>
    </div>
  );
};

export default RealEstateClient;
