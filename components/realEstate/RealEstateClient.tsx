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
    <section className="relative isolate overflow-hidden rounded-[3.25rem] border border-white/70 bg-gradient-to-br from-[#ffffff]/95 via-[#f6f0ff]/95 to-[#fff1fb]/95 px-6 py-16 shadow-soft-xl backdrop-blur sm:px-10 lg:px-16">
      <div className="absolute -left-28 top-16 h-60 w-60 rounded-full bg-gradient-to-br from-[#c4b0ff]/45 via-[#ff92d7]/35 to-transparent blur-3xl" aria-hidden="true" />
      <div className="absolute -right-32 bottom-12 h-72 w-72 rounded-full bg-gradient-to-br from-[#ffc87f]/45 via-[#ff80cc]/35 to-transparent blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl space-y-4">
          <span className="glow-pill">Real estate studio</span>
          <h2 className="text-pretty text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">
            Generate premium property listings that read like editorial features
          </h2>
          <p className="text-base leading-7 text-slate-600">
            Combine property specs, lifestyle cues and audience preferences so Aurora can deliver evocative descriptions tailored to your market.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[inset_0_1px_12px_rgba(255,255,255,0.75)]"
            >
              <p className="text-sm font-semibold text-[color:var(--foreground)]">{highlight.title}</p>
              <p className="mt-2 text-sm text-slate-600">{highlight.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.05fr),minmax(0,0.95fr)]">
          <div className="rounded-[2.75rem] border border-white/70 bg-white/90 p-8 shadow-[0_35px_70px_-40px_rgba(34,7,94,0.25)] backdrop-blur">
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
