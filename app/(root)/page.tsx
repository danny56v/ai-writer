import Hero from "@/components/Hero";
import Link from "next/link";
import {
  SparklesIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  ArrowUpRightIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "On-brand intelligence",
    description:
      "Train Aurora with your brand voice, tone libraries and component tokens so every output feels instantly on-brand.",
    icon: SparklesIcon,
  },
  {
    title: "Design system ready",
    description:
      "Export responsive sections with typographic scales, spacing and colour palettes that mirror your product system.",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    title: "Collaborative canvas",
    description:
      "Review edits together, gather feedback and orchestrate multi-market launches inside a cinematic workspace.",
    icon: DevicePhoneMobileIcon,
  },
  {
    title: "Enterprise grade",
    description: "Advanced permissions, SOC2 readiness and audit trails keep your organisation secure and compliant.",
    icon: ShieldCheckIcon,
  },
];

const workflow = [
  {
    title: "Sketch",
    description:
      "Feed Aurora mood boards, keywords or goals. It instantly drafts structured outlines and voice options to explore.",
  },
  {
    title: "Design",
    description:
      "Blend copy with your visual language – Aurora applies component spacing, colour, motion cues and typography automatically.",
  },
  {
    title: "Publish",
    description:
      "Push directly to your CMS, export polished decks or handoff design-ready listings for your sales team in seconds.",
  },
];

const valueColumns = [
  {
    title: "System orchestration",
    points: [
      "Send prompts straight from Figma or Notion.",
      "Sync brand guardrails to keep tone aligned.",
    ],
  },
  {
    title: "Creative acceleration",
    points: [
      "Ideate, brief and present without leaving Aurora.",
      "Hand-off deliverables with annotated context for teams.",
    ],
  },
];

export default async function Home() {
  return (
    <>
      <Hero />

      <section className="relative mt-24 overflow-hidden rounded-[3rem] border border-white/75 bg-white/80 px-8 py-16 shadow-soft-xl backdrop-blur lg:mt-28 lg:px-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-purple-200/40 via-transparent to-transparent blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-16 bottom-12 h-56 w-56 rounded-full bg-fuchsia-200/40 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-12 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/60 bg-purple-50/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-purple-600 shadow-inner shadow-white/60">
              Workflow
            </span>
            <div className="space-y-4">
              <h2 className="text-balance text-3xl font-semibold text-slate-900 sm:text-4xl">
                A design-first operating system for AI-driven storytelling
              </h2>
              <p className="text-lg leading-8 text-slate-600">
                Aurora unites strategy, copy, art direction and distribution so your team can move from idea to published masterpiece without handoffs breaking momentum.
              </p>
            </div>
            <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
              {valueColumns.map((column) => (
                <div key={column.title} className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-inner shadow-white/60">
                  <p className="text-sm font-semibold text-slate-900">{column.title}</p>
                  <ul className="mt-3 space-y-2">
                    {column.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-amber-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 text-left shadow-inner shadow-white/50 transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-amber-400 text-white shadow-lg shadow-fuchsia-400/40">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-purple-600">
                  Explore capability
                  <ArrowUpRightIcon className="ml-1 h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mt-24 overflow-hidden rounded-[3rem] border border-slate-200/70 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-6 py-16 text-white shadow-soft-xl sm:px-12">
        <div className="absolute -top-32 left-8 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-fuchsia-500/30 blur-3xl" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),transparent_60%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">Bring your creative rituals into one cinematic flow</h2>
            <p className="mt-4 text-base leading-7 text-white/75">
              Every stage in Aurora feels like a polished creative review – from immersive brainstorming scenes to annotated presentation boards and launch-ready distribution decks.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {workflow.map((step, index) => (
                <div key={step.title} className="rounded-3xl border border-white/10 bg-white/10 p-5 text-sm leading-6 text-white/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.55)]">
                  <p className="flex items-center text-xs uppercase tracking-[0.3em] text-white/50">
                    <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[0.6rem] font-semibold text-white/80">
                      {index + 1}
                    </span>
                    {step.title}
                  </p>
                  <p className="mt-3 text-sm leading-6">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="glass-panel relative rounded-[2.25rem] border border-white/30 p-6 text-slate-900">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Content pulse</p>
                <span className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white/80">Live</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Track tone, sentiment and performance in one glance while Aurora adjusts distribution and formatting for each channel.
              </p>
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl bg-slate-900/90 p-4 text-white shadow-xl">
                  <p className="text-sm text-white/70">Upcoming campaigns</p>
                  <div className="mt-3 grid gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Product launch</span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Ready</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Investment memo</span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Drafting</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Real estate update</span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Review</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-4">
                  <p className="text-sm font-semibold text-slate-900">Team velocity</p>
                  <p className="mt-2 text-sm text-slate-500">12 articles published this week · 96% positive sentiment</p>
                  <div className="mt-4 h-24 w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-100 via-fuchsia-100 to-amber-100">
                    <div className="h-full w-[78%] rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mt-24 flex flex-col items-center justify-center gap-8 overflow-hidden rounded-[3rem] border border-white/80 bg-white/80 px-8 py-16 text-center shadow-soft-xl backdrop-blur sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),transparent_55%)]" aria-hidden="true" />
        <div className="relative space-y-6">
          <h2 className="max-w-3xl text-pretty text-3xl font-semibold text-slate-900 sm:text-4xl">
            Ready to craft captivating stories with a design system that keeps up?
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-7 text-slate-600">
            From funding announcements to global property launches, Aurora keeps your visual identity consistent, delightful and unmistakably you.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-fuchsia-400/40 transition hover:opacity-95"
            >
              Create a free account
            </Link>
            <Link
              href="/article-writer"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-base font-semibold text-slate-700 shadow-inner shadow-white/60 transition hover:border-purple-200 hover:text-slate-900"
            >
              Try the article studio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
