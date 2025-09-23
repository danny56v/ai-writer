"use client";

import { useState } from "react";
import RealEstateForm from "./RealEstateForm";
import RealEstateResponse from "./RealEstateResponse";

type Plan = { planType: string; currentPeriodEnd: Date | null; status: string };

interface Props {
  userPlan: Plan;
}

const highlights = [
  {
    title: "Lifestyle storytelling",
    description: "Blend amenities with neighbourhood moodboards to create aspirational narratives for buyers.",
  },
  {
    title: "Buyer segmentation",
    description: "Adjust tone instantly for investors, families or renters with contextual prompts.",
  },
  {
    title: "One-click localisation",
    description: "Translate listings across 40+ languages without losing nuance or emotion.",
  },
];

const RealEstateClient = ({ userPlan }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState("");

  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-white/80 bg-white/80 px-6 py-16 shadow-soft-xl backdrop-blur sm:px-10 lg:px-16">
      <div className="absolute -left-24 top-16 h-56 w-56 rounded-full bg-purple-400/25 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-32 bottom-12 h-64 w-64 rounded-full bg-fuchsia-400/25 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-purple-700">
            Real estate studio
          </span>
          <h2 className="mt-6 text-pretty text-3xl font-semibold text-slate-900 sm:text-4xl">
            Generate premium property listings that read like editorial features
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Combine property specs, lifestyle cues and audience preferences so Aurora can deliver evocative descriptions tailored
            to your market.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {highlights.map((highlight) => (
            <div key={highlight.title} className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-inner shadow-white/60">
              <p className="text-sm font-semibold text-slate-900">{highlight.title}</p>
              <p className="mt-2 text-sm text-slate-600">{highlight.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.05fr),minmax(0,0.95fr)]">
          <div className="rounded-3xl border border-white/80 bg-white/80 p-8 shadow-soft-xl backdrop-blur">
            <RealEstateForm
              userPlan={userPlan}
              onOpen={() => setIsOpen(true)}
              onResult={setResult}
            />
          </div>

          <div
            className={`transition-all duration-500 ${
              isOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-4 opacity-0"
            }`}
          >
            <RealEstateResponse onClose={() => setIsOpen(false)} text={result} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealEstateClient;
