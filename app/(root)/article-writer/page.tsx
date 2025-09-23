"use client";
import LanguageSelect from "@/components/LanguageSelect";
import RadioButtons from "@/components/RadioButtons";
import Select from "@/components/SelectOld";
import { GeneratePrompt } from "@/lib/actions/actions";
import { languages } from "@/utils/languages";
import React, { useActionState, useState } from "react";

const tone = ["Professional", "Neutral", "Friendly", "Technical", "Optimistic", "Casual", "Humorous"];
const audiences = [
  "General Audience",
  "Students",
  "Developers",
  "Journalists",
  "Investors",
  "Entrepreneurs",
  "Researchers",
  "Parents",
  "Consumers",
  "Healthcare Professionals",
];
const lengths = ["Short", "Medium", "Long"];

const callouts = [
  {
    title: "Voice harmony",
    description: "Upload guardrails so every paragraph mirrors your brand cadence and vocabulary.",
  },
  {
    title: "Structure aware",
    description: "Generate outlines with hero sections, pull quotes and CTA prompts ready for design.",
  },
  {
    title: "Instant exports",
    description: "Download text files or drop into your CMS workflow in a single click.",
  },
];

interface ArticleDisplayProps {
  response: string;
  pending: boolean;
}

const ArticleDisplay: React.FC<ArticleDisplayProps> = ({ response, pending }) => {
  if (pending) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-8 rounded-3xl border border-white/80 bg-white/80 p-8 text-center shadow-soft-xl backdrop-blur">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-purple-200/80 border-t-transparent">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-purple-400/60 border-t-transparent" />
        </div>
        <div className="space-y-3 text-sm text-slate-500">
          <p className="font-semibold text-slate-700">Generating your article</p>
          <p className="text-xs leading-6 text-slate-500">
            Aurora is composing structured sections, headings and visual cues tailored to your brief.
          </p>
        </div>
        <div className="w-full max-w-md space-y-3">
          <div className="h-4 w-3/4 rounded-full bg-slate-200/80" />
          <div className="h-4 w-1/2 rounded-full bg-slate-200/70" />
          <div className="h-4 w-4/5 rounded-full bg-slate-200/60" />
        </div>
      </div>
    );
  }

  if (!response || response === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500 shadow-inner shadow-white/40">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Preview space
        </span>
        <p className="max-w-xs text-sm leading-6 text-slate-600">
          Generate an article to see Aurora&apos;s design-aware copy preview.
        </p>
      </div>
    );
  }

  const wordCount = response.split(" ").length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/80 bg-white/80 p-8 shadow-soft-xl backdrop-blur">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 pb-5">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/60 bg-purple-50/70 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-purple-600">
            Aurora output
          </span>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">Generated article</h3>
          <p className="text-sm text-slate-500">Copy, download or refine the AI-crafted draft below.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <button
            onClick={() => navigator.clipboard.writeText(response)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-slate-700 transition hover:border-purple-200 hover:text-purple-600"
          >
            <span className="text-base">📋</span> Copy
          </button>
          <button
            onClick={() => {
              const element = document.createElement("a");
              const file = new Blob([response], { type: "text/plain" });
              element.href = URL.createObjectURL(file);
              element.download = "article.txt";
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 px-4 py-2 text-white shadow-lg shadow-fuchsia-400/40 transition hover:opacity-95"
          >
            <span className="text-base">⬇️</span> Download
          </button>
        </div>
      </header>

      <div className="mt-6 flex-1 overflow-auto rounded-2xl border border-slate-200/60 bg-slate-50/80 p-6 text-sm leading-7 text-slate-700 shadow-inner shadow-white/40">
        <div className="whitespace-pre-wrap">{response}</div>
      </div>

      <footer className="mt-6 grid gap-4 text-xs font-medium text-slate-500 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3">
          Words
          <p className="mt-1 text-lg font-semibold text-slate-900">{wordCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3">
          Characters
          <p className="mt-1 text-lg font-semibold text-slate-900">{response.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3">
          Reading time
          <p className="mt-1 text-lg font-semibold text-slate-900">~{readingTime} min</p>
        </div>
      </footer>
    </div>
  );
};

const ArticleWriter = () => {
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [selectedAudience, setSelectedAudience] = useState("General Audience");
  const [selectedLength, setSelectedLength] = useState("Medium");
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const [state, formAction, pending] = useActionState(GeneratePrompt, {
    success: true,
    message: "",
    response: "",
  });

  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-white/80 bg-white/75 px-6 py-16 shadow-soft-xl backdrop-blur sm:px-10 lg:px-16">
      <div className="absolute -left-24 top-12 h-60 w-60 rounded-full bg-purple-400/25 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-28 bottom-10 h-64 w-64 rounded-full bg-fuchsia-400/25 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-purple-700">
            Article studio
          </span>
          <h2 className="mt-6 text-pretty text-3xl font-semibold text-slate-900 sm:text-4xl">
            Generate elegant, on-brand articles with Aurora’s design-aware AI
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Mix tones, audiences and formats while Aurora structures each piece with design-ready layouts and voice consistency.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {callouts.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-inner shadow-white/60">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.05fr),minmax(0,0.95fr)]">
          <form action={formAction} className="rounded-3xl border border-white/80 bg-white/80 p-8 shadow-soft-xl backdrop-blur">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-semibold text-slate-900">
                  Article title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="ex. The design systems shaping AI-first brands"
                  className="h-12 rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200/60"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Select label="Tone" data={tone} value={selectedTone} onChange={setSelectedTone} />
                  <input type="hidden" name="tone" value={selectedTone} />
                </div>
                <div className="space-y-2">
                  <Select
                    label="Target audience"
                    data={audiences}
                    value={selectedAudience}
                    onChange={setSelectedAudience}
                  />
                  <input type="hidden" name="audience" value={selectedAudience} />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="topic" className="text-sm font-semibold text-slate-900">
                  Topic
                </label>
                <input
                  id="topic"
                  name="topic"
                  type="text"
                  placeholder="ex. Crafting immersive onboarding flows"
                  className="h-12 rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200/60"
                  required
                />
              </div>

              <div className="grid gap-2">
                <RadioButtons data={lengths} label="Article length" value={selectedLength} onChange={setSelectedLength} />
                <input type="hidden" name="length" value={selectedLength} />
              </div>

              <div className="grid gap-2">
                <label htmlFor="keywords" className="text-sm font-semibold text-slate-900">
                  Keywords (optional)
                </label>
                <input
                  id="keywords"
                  name="keywords"
                  type="text"
                  placeholder="ex. design systems, ai collaboration, product storytelling"
                  className="h-12 rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200/60"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-semibold text-slate-900">
                  Additional context (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Share goals, must-have callouts or formatting preferences so Aurora can tailor the draft."
                  className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200/60"
                />
              </div>

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <LanguageSelect value={selectedLanguage} onChange={setSelectedLanguage} data={languages} />
                  <input type="hidden" name="language" value={selectedLanguage} />
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-400/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                      Generating...
                    </span>
                  ) : (
                    "Generate article"
                  )}
                </button>
              </div>
            </div>
          </form>

          <ArticleDisplay response={state.response} pending={pending} />
        </div>

        {!state.success && state.message && (
          <div className="mt-8 rounded-3xl border border-red-200/60 bg-red-50/70 p-5 text-sm font-medium text-red-700">
            {state.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleWriter;
