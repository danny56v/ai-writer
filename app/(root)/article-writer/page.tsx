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
      <div className="flex h-full flex-col items-center justify-center gap-8 rounded-[2.5rem] border border-white/70 bg-white/90 p-8 text-center shadow-[0_35px_70px_-45px_rgba(34,7,94,0.22)] backdrop-blur">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#c2afff] border-t-transparent">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#6b4dff]/40 border-t-transparent" />
        </div>
        <div className="space-y-3 text-sm text-slate-500">
          <p className="font-semibold text-[color:var(--foreground)]">Generating your article</p>
          <p className="text-xs leading-6 text-slate-500">
            Aurora is composing structured sections, headings and visual cues tailored to your brief.
          </p>
        </div>
        <div className="w-full max-w-md space-y-3">
          <div className="h-4 w-3/4 rounded-full bg-[#efe7ff]" />
          <div className="h-4 w-1/2 rounded-full bg-[#f8eefc]" />
          <div className="h-4 w-4/5 rounded-full bg-[#ffeef9]" />
        </div>
      </div>
    );
  }

  if (!response || response === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-[2.5rem] border border-dashed border-[#dcd0ff] bg-white/70 p-8 text-center text-sm text-slate-500 shadow-[inset_0_1px_12px_rgba(255,255,255,0.65)]">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#d9cfff] bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
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
    <div className="flex h-full flex-col rounded-[2.5rem] border border-white/70 bg-white/90 p-8 shadow-[0_35px_70px_-40px_rgba(34,7,94,0.25)] backdrop-blur">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#efe6ff] pb-5">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d9cfff] bg-[#f3ecff] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#6b4dff]">
            Aurora output
          </span>
          <h3 className="mt-3 text-lg font-semibold text-[color:var(--foreground)]">Generated article</h3>
          <p className="text-sm text-slate-500">Copy, download or refine the AI-crafted draft below.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <button
            onClick={() => navigator.clipboard.writeText(response)}
            className="inline-flex items-center gap-2 rounded-full border border-[#d9cfff] bg-white/90 px-4 py-2 text-slate-700 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)] transition hover:border-[#c2afff] hover:text-[#6b4dff]"
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
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] px-4 py-2 text-white shadow-[0_20px_36px_-20px_rgba(112,64,255,0.85)] transition hover:opacity-95"
          >
            <span className="text-base">⬇️</span> Download
          </button>
        </div>
      </header>

      <div className="mt-6 flex-1 overflow-auto rounded-2xl border border-[#efe6ff] bg-[#f8f5ff] p-6 text-sm leading-7 text-slate-700 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
        <div className="whitespace-pre-wrap">{response}</div>
      </div>

      <footer className="mt-6 grid gap-4 text-xs font-medium text-slate-500 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
          Words
          <p className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">{wordCount}</p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
          Characters
          <p className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">{response.length}</p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
          Reading time
          <p className="mt-1 text-lg font-semibold text-[color:var(--foreground)]">~{readingTime} min</p>
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
    <div className="relative isolate overflow-hidden rounded-[3.25rem] border border-white/70 bg-gradient-to-br from-[#ffffff]/95 via-[#f6f0ff]/95 to-[#fff1fb]/95 px-6 py-16 shadow-soft-xl backdrop-blur sm:px-10 lg:px-16">
      <div className="absolute -left-28 top-12 h-64 w-64 rounded-full bg-gradient-to-br from-[#c4b0ff]/45 via-[#ff92d7]/35 to-transparent blur-3xl" aria-hidden="true" />
      <div className="absolute -right-32 bottom-8 h-72 w-72 rounded-full bg-gradient-to-br from-[#ffc87f]/45 via-[#ff80cc]/35 to-transparent blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl space-y-4">
          <span className="glow-pill">Article studio</span>
          <h2 className="text-pretty text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">
            Generate elegant, on-brand articles with Aurora’s design-aware AI
          </h2>
          <p className="text-base leading-7 text-slate-600">
            Mix tones, audiences and formats while Aurora structures each piece with design-ready layouts and voice consistency. Inspired by ClickUp’s modern workspace aesthetic.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {callouts.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[inset_0_1px_12px_rgba(255,255,255,0.75)]"
            >
              <p className="text-sm font-semibold text-[color:var(--foreground)]">{item.title}</p>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.05fr),minmax(0,0.95fr)]">
          <form action={formAction} className="rounded-[2.75rem] border border-white/70 bg-white/90 p-8 shadow-[0_35px_70px_-40px_rgba(34,7,94,0.25)] backdrop-blur">
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
                  className="h-12 rounded-2xl border border-[#e8defd] bg-white/90 px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-[#c2afff] focus:outline-none focus:ring-4 focus:ring-[#cabaff]/40"
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
                  className="h-12 rounded-2xl border border-[#e8defd] bg-white/90 px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-[#c2afff] focus:outline-none focus:ring-4 focus:ring-[#cabaff]/40"
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
                  className="h-12 rounded-2xl border border-[#e8defd] bg-white/90 px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-[#c2afff] focus:outline-none focus:ring-4 focus:ring-[#cabaff]/40"
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
                  className="rounded-2xl border border-[#e8defd] bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-[#c2afff] focus:outline-none focus:ring-4 focus:ring-[#cabaff]/40"
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
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] px-6 py-3 text-sm font-semibold text-white shadow-[0_24px_44px_-22px_rgba(110,71,255,0.85)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
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
