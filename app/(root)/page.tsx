import Hero from "@/components/Hero";
import Link from "next/link";
import {
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  DevicePhoneMobileIcon,
  BoltIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline";

const teamHighlights = [
  {
    title: "Templates that scale",
    description: "Launch new campaigns in minutes with reusable briefs, synced brand kits and AI prompts your team already loves.",
    icon: SparklesIcon,
  },
  {
    title: "Design system intelligence",
    description: "Aurora maps typography, spacing and motion tokens from your product so every output looks launch-ready.",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    title: "Collaborative rituals",
    description: "Assign reviewers, capture context and ship faster with inline feedback, status updates and click-to-publish handoffs.",
    icon: DevicePhoneMobileIcon,
  },
  {
    title: "Insights on autopilot",
    description: "Track sentiment, performance and completion in one view—Aurora loops learnings back into your next brief.",
    icon: ChartBarSquareIcon,
  },
];

const flow = [
  {
    label: "Plan",
    description: "Spin up spaces for product launches, newsletters or property listings with automations tuned to your workflow.",
  },
  {
    label: "Create",
    description: "Blend human direction with Aurora&apos;s AI drafts, component blocks and motion cues—all inside one shared canvas.",
  },
  {
    label: "Launch",
    description: "Publish to your CMS, export decks or schedule emails without leaving the workspace, complete with analytics hooks.",
  },
];

const integrations = [
  "Figma", "Notion", "HubSpot", "Webflow", "Slack", "Sheets",
];

export default async function Home() {
  return (
    <>
      <Hero />

      <section className="relative mt-24 overflow-hidden rounded-[3.25rem] border border-white/70 bg-white/90 px-8 py-16 shadow-soft-xl backdrop-blur sm:px-12 lg:px-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(ellipse_at_top,_rgba(203,186,255,0.35),transparent_65%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-20 bottom-10 h-60 w-60 rounded-full bg-gradient-to-br from-[#c5b1ff]/45 via-[#ff97d8]/35 to-transparent blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-12 lg:grid-cols-[0.95fr,1.05fr] lg:items-center">
          <div className="space-y-7">
            <span className="glow-pill">Everything in one workspace</span>
            <h2 className="text-pretty text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">
              Orchestrate strategy, creation and approvals like the best ClickUp boards
            </h2>
            <p className="text-base leading-7 text-slate-600">
              Aurora mirrors the rituals your team already trusts. Group briefs, resources and AI outputs into scenes so everyone stays aligned from kickoff to launch.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {teamHighlights.map((item) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/75 bg-white/90 p-6 shadow-[inset_0_1px_12px_rgba(255,255,255,0.75)] transition hover:-translate-y-1 hover:shadow-[0_25px_60px_-35px_rgba(34,7,94,0.25)]"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6b4dff] via-[#ff47c5] to-[#ffb347] text-white shadow-[0_18px_30px_-18px_rgba(107,77,255,0.75)]">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--foreground)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-[2.75rem] border border-white/70 bg-gradient-to-br from-[#f7f3ff] via-white to-[#fff7fb] p-6 shadow-[0_30px_65px_-40px_rgba(30,4,86,0.2)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Aurora scenes</p>
                  <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">Brand launch HQ</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-xs font-semibold text-[#6b4dff] shadow-[0_12px_24px_-18px_rgba(111,71,255,0.65)]">
                  <BoltIcon className="h-4 w-4" /> Automations on
                </span>
              </div>
              <div className="mt-6 space-y-4 text-sm">
                {flow.map((stage, index) => (
                  <div key={stage.label} className="flex items-start gap-4 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[inset_0_1px_12px_rgba(255,255,255,0.7)]">
                    <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] text-xs font-semibold text-white shadow-[0_16px_30px_-18px_rgba(107,77,255,0.65)]">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--foreground)]">{stage.label}</p>
                      <p className="mt-1 text-sm text-slate-600">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                {integrations.map((item) => (
                  <span key={item} className="rounded-full bg-white/70 px-3 py-1 shadow-[inset_0_1px_6px_rgba(255,255,255,0.8)]">
                    {item} sync
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_25px_55px_-35px_rgba(32,5,94,0.18)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6b4dff]">Performance</p>
                <p className="mt-3 text-3xl font-semibold text-[color:var(--foreground)]">+142% engagement</p>
                <p className="mt-2 text-sm text-slate-500">Campaigns launched with Aurora outperform manual workflows after 30 days.</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_25px_55px_-35px_rgba(32,5,94,0.18)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff47c5]">Team joy</p>
                <p className="mt-3 text-3xl font-semibold text-[color:var(--foreground)]">94% adoption</p>
                <p className="mt-2 text-sm text-slate-500">Writers, marketers and designers collaborate in one place without losing context.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mt-24 overflow-hidden rounded-[3.25rem] border border-[#1d0b5c]/50 bg-gradient-to-br from-[#1b084f] via-[#220b66] to-[#17044f] px-6 py-18 text-white shadow-soft-xl sm:px-12 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.2),transparent_60%)]" aria-hidden="true" />
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-[#8b5cf6]/40 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-[#f472b6]/35 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
              Workflow theatre
            </span>
            <h2 className="mt-6 text-pretty text-3xl font-semibold sm:text-4xl">
              Watch copy, design and ops align in one cinematic flow
            </h2>
            <p className="mt-4 text-base leading-7 text-white/75">
              Customize rituals with automations, approvals and AI copilots. Aurora updates statuses, nudges owners and assembles launch packs as if your operations team built it.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {flow.map((stage, index) => (
                <div key={stage.label} className="rounded-3xl border border-white/15 bg-white/10 p-5 text-sm leading-6 text-white/80 shadow-[0_30px_70px_-45px_rgba(0,0,0,0.6)]">
                  <p className="flex items-center text-xs uppercase tracking-[0.3em] text-white/60">
                    <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[0.6rem] font-semibold text-white/80">
                      {index + 1}
                    </span>
                    {stage.label}
                  </p>
                  <p className="mt-3 text-sm leading-6">{stage.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 p-6 shadow-[0_30px_70px_-45px_rgba(0,0,0,0.6)] backdrop-blur">
            <div className="rounded-2xl border border-white/20 bg-white/5 p-5 text-left text-white/85">
              <p className="text-sm font-semibold">Content pulse</p>
              <p className="mt-2 text-sm text-white/70">Monitor tone, approvals and channel-ready assets in real time. Aurora keeps the queue balanced across email, social and web.</p>
              <div className="mt-6 space-y-4 text-xs">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-white/70">Launch lineup</p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center justify-between">
                      <span>Workspace teaser</span>
                      <span className="rounded-full bg-white/15 px-3 py-1">Approved</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Investor update</span>
                      <span className="rounded-full bg-white/15 px-3 py-1">Drafting</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Property spotlight</span>
                      <span className="rounded-full bg-white/15 px-3 py-1">Reviewing</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Velocity</p>
                  <p className="mt-2 text-xs text-white/70">12 scenes shipped this week · 3 launches live</p>
                  <div className="mt-4 h-24 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#7c5cff]/30 via-[#f472b6]/30 to-[#fbbf24]/30">
                    <div className="h-full w-[78%] rounded-xl bg-gradient-to-r from-[#7c5cff] via-[#f472b6] to-[#fbbf24]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mt-24 flex flex-col items-center justify-center gap-8 overflow-hidden rounded-[3.25rem] border border-white/70 bg-white/90 px-8 py-16 text-center shadow-soft-xl backdrop-blur sm:px-12 lg:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(215,198,255,0.28),transparent_60%)]" aria-hidden="true" />
        <div className="relative space-y-6">
          <h2 className="max-w-3xl text-pretty text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">
            Ready to craft captivating stories with a workspace that feels like ClickUp?
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-7 text-slate-600">
            From investor updates to real estate spotlights, Aurora keeps your visuals, tone and metrics aligned so every launch feels orchestrated.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] px-6 py-3 text-base font-semibold text-white shadow-[0_24px_44px_-22px_rgba(110,71,255,0.85)] transition hover:opacity-95"
            >
              Create a free account
            </Link>
            <Link
              href="/article-writer"
              className="inline-flex items-center justify-center rounded-full border border-[#d9cfff] bg-white/90 px-6 py-3 text-base font-semibold text-slate-700 shadow-[inset_0_1px_12px_rgba(255,255,255,0.75)] transition hover:border-[#c2afff] hover:text-[color:var(--foreground)]"
            >
              Try the article studio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
