"use client";

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
  streetViewImage?: string | null;
  createdAt: string;
};

type GeneratedResult = {
  text: string;
  imageUrl?: string | null;
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
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [currentUsageSummary, setCurrentUsageSummary] = useState<RealEstateUsageSummary>(usageSummary);
  const lastSigRef = useRef<string | null>(null);
  const responseContainerRef = useRef<HTMLDivElement | null>(null);
  const walkthroughVideoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyModalEntry, setHistoryModalEntry] = useState<HistoryEntry | null>(null);
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);
  const [fullyVisibleHistoryCount, setFullyVisibleHistoryCount] = useState(COLLAPSED_HISTORY_FULL_COUNT);
  const [isDesktopHistoryLayout, setIsDesktopHistoryLayout] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 1024;
  });
  const historyCopyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCurrentUsageSummary((prev) => {
      if (
        prev.limit === usageSummary.limit &&
        prev.remaining === usageSummary.remaining &&
        prev.used === usageSummary.used
      ) {
        return prev;
      }
      return usageSummary;
    });
  }, [usageSummary]);

  const handleUsageUpdate = useCallback((summary: RealEstateUsageSummary) => {
    setCurrentUsageSummary((prev) => {
      if (prev.limit === summary.limit && prev.remaining === summary.remaining && prev.used === summary.used) {
        return prev;
      }
      return summary;
    });
  }, []);

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

  const handleResult = useCallback(
    (value: GeneratedResult) => {
      setResults((prev) => {
        const next = [...prev, value];
        setCurrentIndex(next.length - 1);
        return next;
      });
      setLoading(false);
      setResultSeq((s) => s + 1);
      void refreshHistory();
    },
    [refreshHistory]
  );

  const handleHistoryViewDetails = useCallback((entry: HistoryEntry) => {
    setHistoryModalEntry(entry);
  }, []);

  const handleHistoryModalClose = useCallback(() => {
    setHistoryModalEntry(null);
  }, []);

  useEffect(() => {
    if (!historyModalEntry) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleHistoryModalClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [historyModalEntry, handleHistoryModalClose]);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const video = walkthroughVideoRef.current;
    if (!video) return;
    video.muted = true;
    const playAttempt = video.play();
    if (playAttempt instanceof Promise) {
      playAttempt.catch(() => {
        /* Safari may still block playback until user interaction */
      });
    }
  }, []);

  const previewCount =
    history.length > fullyVisibleHistoryCount
      ? isDesktopHistoryLayout
        ? COLLAPSED_HISTORY_PREVIEW_COUNT_DESKTOP
        : COLLAPSED_HISTORY_PREVIEW_COUNT_MOBILE
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

  const currentResult = currentIndex >= 0 ? results[currentIndex] : null;

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
                      <p className="text-sm font-semibold  ">Payment successful!</p>
                      <p className="mt-1 text-sm text-neutral-600">
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
                        className="inline-flex rounded-md bg-white  transition hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
        <div
          className={[
            "mx-auto w-full px-4 pb-10 pt-8 sm:px-6 sm:pt-10",
            isOpen ? "max-w-screen-2xl" : "max-w-7xl",
          ].join(" ")}
        >
          <div className="flex flex-col lg:flex-row gap-3">
            <div
              className={[
                "transition-all duration-500 ease-out",
                "w-full p-0 ",
                isOpen ? "lg:w-1/2 xl:w-1/2" : "lg:max-w-7xl lg:mx-auto",
              ].join(" ")}
            >
              <RealEstateForm
                userPlan={userPlan}
                usageSummary={currentUsageSummary}
                isAuthenticated={isAuthenticated}
                onLoadingChange={setLoading}
                onResult={handleResult}
                regenerateSignal={regenerateSignal}
                onSubmitStart={handleSubmitStart}
                onError={handleError}
                onUsageUpdate={handleUsageUpdate}
              />
            </div>
            <div
              ref={responseContainerRef}
              className={[
                // "min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm",
                "transition-all duration-500 ease-out",
                "max-w-none",
                isOpen ? "lg:w-1/2 xl:w-1/2 md:opacity-100 lg:translate-x-0" : "lg:w-0 md:opacity-0 lg:translate-x-4",
                isOpen ? "opacity-100 translate-y-0 " : "opacity-0 -translate-y-1 p-0 h-0 overflow-hidden",
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
                text={currentResult?.text ?? ""}
                imageUrl={currentResult?.imageUrl}
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
        <section className="relative mt-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-xl border border-neutral-100 bg-white/95 p-5 shadow-[0_55px_140px_-70px_rgba(15,23,42,0.45)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em">
                    History
                  </span>
                  <h2 className="mt-3 text-2xl font-semibold  sm:text-3xl">Latest generated descriptions</h2>
                  <p className="mt-2 text-sm ">
                    Review your recent versions and copy the text without completing the form again.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void refreshHistory()}
                    disabled={historyLoading}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)] transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {historyLoading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 0 1 8-8v3.5a4.5 4.5 0 0 0-4.5 4.5H4z"
                          />
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
                  <span className="text-xs font-semibold ">
                    {history.length} {history.length === 1 ? "entry" : "entries"}
                  </span>
                </div>
              </div>

              {historyError ? (
                <div className="mt-4 rounded-2xl border border-rose-200/80 bg-rose-50/70 p-4 text-sm text-rose-700">
                  {historyError}
                </div>
              ) : null}

              {historyLoading && history.length === 0 ? (
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  {[0, 1].map((idx) => (
                    <div
                      key={idx}
                      className="animate-pulse rounded-xl border border-neutral-100 bg-white/80 p-6 shadow-[0_25px_60px_-50px_rgba(15,23,42,0.6)]"
                    >
                      <div className="h-4 w-1/2 rounded-full bg-neutral-100" />
                      <div className="mt-4 h-3 w-5/6 rounded-full bg-neutral-50" />
                      <div className="mt-2 h-3 w-3/4 rounded-full bg-neutral-50" />
                      <div className="mt-6 space-y-2">
                        <div className="h-2.5 w-full rounded-full bg-neutral-100/80" />
                        <div className="h-2.5 w-5/6 rounded-full bg-neutral-100/80" />
                        <div className="h-2.5 w-4/6 rounded-full bg-neutral-100/80" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {!historyLoading && history.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-neutral-200 bg-white/90 p-12 text-center shadow-[0_25px_60px_-50px_rgba(15,23,42,0.6)]">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 ">
                    <SparklesIcon className="h-6 w-6" aria-hidden />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold ">You do not have any saved generations yet</p>
                    <p className="text-sm ">
                      Complete the form on the left to start building and saving generated versions here.
                    </p>
                  </div>
                </div>
              ) : null}

              {history.length > 0 ? (
                <div className="mt-8">
                  <div className={["relative", historyHasMoreToReveal ? "pb-24" : ""].join(" ")}>
                    <div className="grid gap-6 lg:grid-cols-2">
                      {historyToDisplay.map((entry, index) => {
                        const paragraphs = extractBodyParagraphs(entry);
                        const previewSource = paragraphs.length ? paragraphs.join(" ") : entry.text;
                        const preview = previewSource.length > 220 ? `${previewSource.slice(0, 220)}…` : previewSource;
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
                          "group relative overflow-hidden rounded-lg border border-neutral-100 bg-white/90 p-5 shadow-[0_35px_80px_-60px_rgba(15,23,42,0.45)] backdrop-blur transition",
                          isCollapsedPreview
                            ? "pointer-events-none max-h-56 opacity-80 saturate-75 ring-1 ring-inset ring-neutral-100/70"
                            : "hover:-translate-y-1 hover:shadow-[0_45px_100px_-70px_rgba(15,23,42,0.55)]",
                          isCollapsedPreview && isSecondPreview ? "hidden lg:block" : "",
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <article key={entry.id} className={cardClasses} aria-hidden={isCollapsedPreview}>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <h3 className="text-base font-semibold ">{entry.title || "Untitled listing"}</h3>
                                <p className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                                  <ClockIcon className="h-4 w-4" aria-hidden />
                                  {historyDateFormatter.format(new Date(entry.createdAt))}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleHistoryCopy(entry)}
                                  className={[
                                    "inline-flex items-center gap-2 rounded-lg border border-neutral-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)] transition hover:border-neutral-300 hover:bg-neutral-50",
                                    isCollapsedPreview ? "opacity-60" : "",
                                  ].join(" ")}
                                  disabled={isCollapsedPreview}
                                >
                                  {copiedHistoryId === entry.id ? "Copied" : "Copy"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleHistoryViewDetails(entry)}
                                  className={[
                                    "inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_30px_70px_-40px_rgba(15,23,42,0.9)] transition hover:bg-neutral-800",
                                    isCollapsedPreview ? "opacity-70" : "",
                                  ].join(" ")}
                                  disabled={isCollapsedPreview}
                                >
                                  View details
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold ">
                              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1">
                                <HomeModernIcon className="h-4 w-4" aria-hidden />
                                {entry.propertyType}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1">
                                <MapPinIcon className="h-4 w-4" aria-hidden />
                                {entry.location}
                              </span>
                              {entry.price !== null ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1">
                                  <CurrencyDollarIcon className="h-4 w-4" aria-hidden />
                                  {priceFormatter.format(entry.price)}
                                </span>
                              ) : null}
                              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1">
                                {listingLabel}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-3 text-xs">
                              <span>{entry.language}</span>
                              {bedroomLabel ? <span>{bedroomLabel}</span> : null}
                              {bathroomsLabel ? <span>{bathroomsLabel}</span> : null}
                              {amenitiesLabel ? <span>{amenitiesLabel}</span> : null}
                            </div>

                            {entry.streetViewImage ? (
                              <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-100 bg-white/80 shadow-inner">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={entry.streetViewImage}
                                  alt={`Street View preview for ${entry.title || entry.location}`}
                                  className="h-48 w-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ) : null}

                            <div className="mt-5 rounded-2xl border border-neutral-100 bg-white/90 p-4 text-sm leading-6shadow-inner">
                              <p>{preview}</p>
                            </div>

                            {entry.hashtags.length ? (
                              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold ">
                                <HashtagIcon className="h-4 w-4 " aria-hidden />
                                {entry.hashtags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 "
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
                          className="pointer-events-none absolute inset-x-0 bottom-20 z-10 h-24 bg-gradient-to-b from-transparent via-white/90 to-white"
                        />
                        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                          <button
                            type="button"
                            onClick={handleHistoryLoadMore}
                            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2 text-sm font-semibold text-white shadow-[0_25px_70px_-45px_rgba(15,23,42,0.8)] transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
                          >
                            Show more
                          </button>
                          <button
                            type="button"
                            onClick={handleHistoryShowAll}
                            className="text-sm font-semibold  underline decoration-neutral-300 decoration-2 underline-offset-4 transition cursor-pointer hover:text-neutral-600"
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
          </div>
        </section>

        <section className="relative py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-0 md:px-6 lg:px-8">
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] ">
              Workflow
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              How to use the ListologyAi listing generator
            </h2>
            <p className="mt-4 text-base leading-7 ">
              Follow the steps below to move from brief to final description in minutes. Everything you enter is saved
              so you can quickly adjust tone, language, or audience without starting over.
            </p>

            <div className="relative mt-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-16 hidden h-64 w-64 rounded-full  blur-3xl lg:block"
              />
              <div className="relative aspect-video overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-[0_55px_140px_-70px_rgba(15,23,42,0.45)]">
                <video
                  ref={walkthroughVideoRef}
                  src="/ListologyAi%20Video.mp4"
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  poster="/screenshot.png"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.35em]">
                Product walkthrough – ListologyAi generator in action
              </p>
            </div>

            <dl className="mt-12 space-y-6">
              <div className="flex gap-4 rounded-lg border border-neutral-100 bg-white/95 p-5 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)]">
                <DocumentTextIcon className="h-8 w-8 flex-none " aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-sm font-semibold uppercase tracking-[0.35em]">1. Complete the brief</dt>
                  <dd className="text-sm leading-6 ">
                    Add property details, features, and language. The form guides agents and marketers so they never
                    miss persuasive, compliant information.
                  </dd>
                </div>
              </div>

              <div className="flex gap-4 rounded-lg border border-neutral-100 bg-white/95 p-5 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)]">
                <SparklesIcon className="h-8 w-8 flex-none " aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-sm font-semibold uppercase tracking-[0.35em] ">2. Generate the description</dt>
                  <dd className="text-sm leading-6">
                    After you submit the form, ListologyAi blends your context with proven templates to deliver an
                    MLS-ready description optimized for conversion and compliance.
                  </dd>
                </div>
              </div>

              <div className="flex gap-4 rounded-lg border border-neutral-100 bg-white/95 p-5 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)]">
                <PencilSquareIcon className="h-8 w-8 flex-none" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-sm font-semibold uppercase tracking-[0.35em]">3. Review and refine</dt>
                  <dd className="text-sm leading-6 ">
                    Open the results panel to copy the text, download the generated version, or tweak the form to try
                    alternative scenarios.
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </section>

        {historyModalEntry
          ? (() => {
              const modalParagraphs = extractBodyParagraphs(historyModalEntry);
              const displayParagraphs = modalParagraphs.length ? modalParagraphs : [historyModalEntry.text];
              const listingLabel = historyModalEntry.listingType === "rent" ? "Rent" : "Sale";
              const bedroomLabel = historyModalEntry.bedrooms
                ? historyModalEntry.bedrooms.toLowerCase() === "studio"
                  ? "Studio"
                  : `${historyModalEntry.bedrooms} ${historyModalEntry.bedrooms === "1" ? "bedroom" : "bedrooms"}`
                : null;
              const bathroomsLabel = historyModalEntry.bathrooms
                ? `${historyModalEntry.bathrooms} ${historyModalEntry.bathrooms === "1" ? "bathroom" : "bathrooms"}`
                : null;
              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
                  <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    aria-hidden
                    onClick={handleHistoryModalClose}
                  />
                  <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-neutral-100 bg-gradient-to-b from-white via-neutral-50 to-white shadow-[0_55px_140px_-70px_rgba(15,23,42,0.65)]">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-neutral-100/50 blur-3xl"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -bottom-16 left-8 h-64 w-64 rounded-full bg-neutral-100/60 blur-3xl"
                    />

                    <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-white/85 px-6 py-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] ">Saved version</p>
                        <h3 className="text-lg font-semibold">{historyModalEntry.title || "Untitled listing"}</h3>
                        <p className="mt-1 flex items-center gap-2 text-xs ">
                          <ClockIcon className="h-4 w-4" aria-hidden />
                          {historyDateFormatter.format(new Date(historyModalEntry.createdAt))}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleHistoryCopy(historyModalEntry)}
                          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)] transition hover:border-neutral-300 hover:bg-neutral-50"
                        >
                          {copiedHistoryId === historyModalEntry.id ? "Copied" : "Copy"}
                        </button>
                        <button
                          type="button"
                          onClick={handleHistoryModalClose}
                          className="absolute right-4 top-4 rounded-full bg-neutral-100 p-2 text-black transition hover:bg-neutral-200 sm:relative sm:right-auto sm:top-auto"
                          aria-label="Close history details"
                        >
                          <XMarkIcon className="h-5 w-5" aria-hidden />
                        </button>
                      </div>
                    </div>

                    <div className="relative space-y-6 p-6 sm:p-8">
                      <div className="grid gap-4 lg:grid-cols-3">
                        <div className="space-y-4 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)] rounded-2xl border border-neutral-100 bg-white/90 p-4 lg:col-span-2">
                          <div>
                            <p className="text-xs  font-semibold uppercase tracking-[0.35em] ">Location</p>
                            <p className="mt-2 text-base font-semibold ">{historyModalEntry.location}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold ">
                              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1">
                                <HomeModernIcon className="h-4 w-4" aria-hidden />
                                {historyModalEntry.propertyType}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1">
                                {listingLabel}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1">
                                {historyModalEntry.language}
                              </span>
                            </div>
                          </div>

                          {historyModalEntry.amenities.length ? (
                            <div className="">
                              <p className="text-[13px] font-semibold uppercase tracking-[0.3em]">Amenities</p>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold ">
                                {historyModalEntry.amenities.map((amenity) => (
                                  <span
                                    key={`modal-amenity-${amenity}`}
                                    className="rounded-full bg-neutral-100 px-2.5 py-1 "
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                        <div className="rounded-2xl border border-neutral-100 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)] bg-white/90 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.35em] ">Snapshot</p>
                          <dl className="mt-3 space-y-2 text-sm ">
                            <div className="flex items-center justify-between rounded-xl bg-neutral-50/70 px-3 py-2">
                              <dt>Price</dt>
                              <dd>
                                {historyModalEntry.price !== null
                                  ? priceFormatter.format(historyModalEntry.price)
                                  : "—"}
                              </dd>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-neutral-50/70 px-3 py-2">
                              <dt>Bedrooms</dt>
                              <dd>{bedroomLabel ?? "—"}</dd>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-neutral-50/70 px-3 py-2">
                              <dt>Bathrooms</dt>
                              <dd>{bathroomsLabel ?? "—"}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      {historyModalEntry.streetViewImage ? (
                        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-inner">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={historyModalEntry.streetViewImage}
                            alt={`Street View preview for ${historyModalEntry.title || historyModalEntry.location}`}
                            className="h-72 w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : null}

                      <article className="space-y-3 text-sm leading-6 ">
                        {displayParagraphs.map((paragraph, idx) => (
                          <p
                            key={`modal-paragraph-${idx}`}
                            className="rounded-xl border border-neutral-200/70 bg-white/90 px-4 py-3 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.6)]"
                          >
                            {paragraph.split("\n").map((line, lineIdx) => (
                              <React.Fragment key={lineIdx}>
                                {lineIdx > 0 ? <br /> : null}
                                {line}
                              </React.Fragment>
                            ))}
                          </p>
                        ))}
                      </article>

                      {historyModalEntry.hashtags.length ? (
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold ">
                          <HashtagIcon className="h-4 w-4 " aria-hidden />
                          {historyModalEntry.hashtags.map((tag) => (
                            <span
                              key={`modal-hashtag-${tag}`}
                              className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 "
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })()
          : null}
      </div>
    </div>
  );
};

export default RealEstateClient;
