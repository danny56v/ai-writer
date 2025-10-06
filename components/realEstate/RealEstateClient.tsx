"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  CheckCircleIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Transition } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import RealEstateForm from "./RealEstateForm";
import RealEstateResponse from "./RealEstateResponse";

type Plan = { planType: string; currentPeriodEnd: Date | null; status: string };

interface Props {
  userPlan: Plan;
  isAuthenticated: boolean;
}

const RealEstateClient = ({ userPlan, isAuthenticated }: Props) => {
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

  const handleResult = useCallback((value: string) => {
    setResults((prev) => {
      const next = [...prev, value];
      setCurrentIndex(next.length - 1);
      return next;
    });
    setLoading(false);
    setResultSeq((s) => s + 1);
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
        responseContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  return (
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

      <section className="relative py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 lg:grid-cols-5 lg:items-start lg:px-8">
          <div className="lg:col-span-2 lg:sticky lg:top-6">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Workflow
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How to use the HomeListerAi listing generator
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
                  <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">2. Generezi descrierea</dt>
                  <dd className="text-sm leading-6 text-gray-700">
                    After you submit the form, HomeListerAi blends your context with proven templates to deliver an MLS-ready description optimized for conversion and compliance.
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
                  <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">4. Publici sau partajezi</dt>
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
                alt="HomeListerAi listing generator interface"
                width={1200}
                height={850}
                className="w-full rounded-2xl border border-indigo-100 object-cover"
              />
              <p className="mt-4 text-center text-xs font-medium uppercase tracking-wide text-indigo-600">
                Interface preview – HomeListerAi form and results panel
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
  );
};

export default RealEstateClient;
