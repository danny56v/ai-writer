"use client";

import Image from "next/image";
import React, { useState } from "react";

import {
  DocumentTextIcon,
  PencilSquareIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

import RealEstateForm from "./RealEstateForm";
import RealEstateResponse from "./RealEstateResponse";

type Plan = { planType: string; currentPeriodEnd: Date | null; status: string };

interface Props {
  userPlan: Plan;
  isAuthenticated: boolean;
}

const RealEstateClient = ({ userPlan, isAuthenticated }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [regenerateSignal, setRegenerateSignal] = useState(0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/60 via-white to-purple-100/70" />
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-200/60 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white via-white/80 to-transparent" />
        <div className="absolute right-6 bottom-0 hidden h-48 w-48 rounded-full bg-purple-200/50 blur-3xl sm:block" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-white/80 to-white" />
      </div>

      <div className="mx-auto max-w-full px-4 pb-10 pt-16 sm:pt-20">
        <div className="flex flex-col lg:flex-row gap-4">
          <div
            className={[
              "min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
              "transition-all duration-500 ease-out",
              "w-full p-4",
              isOpen ? "lg:w-7/12" : "lg:w-5xl lg:mx-auto",
            ].join(" ")}
          >
            <RealEstateForm
              userPlan={userPlan}
              isAuthenticated={isAuthenticated}
              onOpen={() => {
                setIsOpen(true);
                setResult("");
                setLoading(true);
              }}
              onLoadingChange={setLoading}
              onResult={(value) => {
                setResult(value);
                setLoading(false);
              }}
              regenerateSignal={regenerateSignal}
            />
          </div>
          <div
            className={[
              "min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
              "transition-all duration-500 ease-out",
              "w-full",
              isOpen ? "lg:w-5/12 md:opacity-100 lg:translate-x-0" : "lg:w-0 md:opacity-0 lg:translate-x-4",
              isOpen ? "max-h-[75vh] opacity-100 translate-y-0 p-4" : "max-h-0 opacity-0 -translate-y-1 p-0",
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
              text={result}
              loading={loading}
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
              Cum folosești generatorul de listări HomeListerAi
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Urmează pașii de mai jos pentru a trece de la brief la descriere finală în câteva minute. Tot ce completezi
              se salvează în formular, astfel încât să poți ajusta rapid tonul, limba sau publicul țintă fără să reiei procesul.
            </p>
            <dl className="mt-8 space-y-6">
              <div className="flex gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                <DocumentTextIcon className="h-8 w-8 flex-none text-indigo-600" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">1. Completezi brief-ul</dt>
                  <dd className="text-sm leading-6 text-gray-700">
                    Adaugă detaliile de proprietate, amenajările, tonul și limba. Formularul ghidează agenții și marketerii
                    să nu uite informațiile esențiale pentru descrieri persuasive și conforme.
                  </dd>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                <SparklesIcon className="h-8 w-8 flex-none text-indigo-600" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">2. Generezi descrierea</dt>
                  <dd className="text-sm leading-6 text-gray-700">
                    După trimiterea formularului, HomeListerAi combină contextul tău cu șabloane verificate pentru a crea o
                    descriere MLS-ready, optimizată pentru conversie și conformitate.
                  </dd>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                <PencilSquareIcon className="h-8 w-8 flex-none text-indigo-600" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">3. Revizuiești și ajustezi</dt>
                  <dd className="text-sm leading-6 text-gray-700">
                    Deschiderea panelului de rezultat îți permite să copiezi textul, să descarci varianta generată sau să
                    refaci formularele pentru a testa tonuri și scenarii alternative.
                  </dd>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                <PaperAirplaneIcon className="h-8 w-8 flex-none text-indigo-600" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">4. Publici sau partajezi</dt>
                  <dd className="text-sm leading-6 text-gray-700">
                    După validare internă, textul poate fi trimis către MLS, site-ul agenției sau newsletter. Folosești aceeași
                    sesiune pentru a crea mai multe versiuni și a monitoriza consumul de credite.
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
                alt="Interfața generatorului de descrieri HomeListerAi"
                width={1200}
                height={850}
                className="w-full rounded-2xl border border-indigo-100 object-cover"
              />
              <p className="mt-4 text-center text-xs font-medium uppercase tracking-wide text-indigo-600">
                Previzualizare interfață – formularul și panoul de rezultate HomeListerAi
              </p>
            </div>
          </div>
        </div>
      </section>
{/* 
      <section className="relative mt-12 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center justify-center rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100">
            Continuă parcursul
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Creează o experiență completă pentru clienții tăi
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            După ce finalizezi pașii generatorului, explorează resursele care te ajută să transformi descrierile în
            campanii coerente: studii de caz, planuri tarifare și ghiduri pentru echipe hibride.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/pricing"
              className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              Vezi opțiunile de upgrade
            </Link>
            <Link
              href="/blog"
              className="text-sm font-semibold leading-6 text-indigo-700 transition hover:text-indigo-600"
            >
              Descoperă povești reale <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section> */}

    </div>
  );
};

export default RealEstateClient;
