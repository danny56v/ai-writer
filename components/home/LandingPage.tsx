"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  FlagIcon,
  FolderOpenIcon,
  MagnifyingGlassCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Squares2X2Icon,
  MinusSmallIcon,
  PlusSmallIcon,
} from "@heroicons/react/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import Pricing from "@/components/Pricing";
import { FeaturedPosts } from "@/components/blog/FeaturedPosts";
import { blogPosts } from "@/data/blogPosts";

const homeFeaturedPosts = blogPosts.slice(0, 3);

interface LandingPageProps {
  currentPriceId: string | null;
}

const features = [
  {
    name: "AI descriptions that sell",
    description: "Transform any address into a persuasive listing instantly. Add optional details for 100% accuracy.",
    icon: SparklesIcon,
  },
  {
    name: "Street View auto-context",
    description:
      "We pull curb appeal, surroundings, and visual cues directly from Street View to make your listing feel real.",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    name: "Keep your style consistent",
    description:
      "Your tone and structure stay aligned across all listings — even when switching between different properties.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Boost engagement & interest",
    description:
      "Descriptions created with AI context get more clicks and attention across MLS, Zillow, and social media.",
    icon: ChartBarIcon,
  },
];

const heroLogos = [
  { name: "Microsoft", src: "/microsoft.svg", width: 128, height: 32 },
  { name: "Stripe", src: "/stripe-3.svg", width: 128, height: 32 },
  { name: "Uber", src: "/uber.svg", width: 112, height: 32 },
  { name: "Statamic", src: "/statamic.svg", width: 128, height: 32 },
  { name: "Primer", src: "/primer.svg", width: 120, height: 32 },
  { name: "Transistor", src: "/transistor-horizontal-logo.svg", width: 150, height: 32 },
];

const workspaceTags = [
  "Projects",
  "Chat",
  "Brain AI",
  "AI Agents",
  "Sprints",
  "Time Tracking",
  "Calendar",
  "Docs",
  "Whiteboards",
  "Automations",
  "Dashboards",
  "Scheduling",
];

const gridFeatures = [
  { name: "Connected Search", icon: MagnifyingGlassCircleIcon },
  { name: "Tasks", icon: ClipboardDocumentListIcon },
  { name: "Mind Maps", icon: Squares2X2Icon },
  { name: "Wikis", icon: BookOpenIcon },
  { name: "AI Notetaker", icon: SparklesIcon },
  { name: "Calendar", icon: CalendarDaysIcon },
  { name: "Proofing", icon: ChatBubbleOvalLeftEllipsisIcon },
  { name: "Portfolios", icon: FolderOpenIcon },
  { name: "Reporting", icon: ChartBarIcon },
  { name: "Goals", icon: FlagIcon },
  { name: "Sprints", icon: ArrowPathIcon },
  { name: "Custom Status", icon: AdjustmentsHorizontalIcon },
];

const productStats = [
  { value: "10K+", label: "Descriptions generated" },
  { value: "~7 sec", label: "Avg. output time" },
  { value: "98%", label: "Agent satisfaction" },
];

const workflowHighlights = [
  {
    title: "Start with an address",
    description:
      "Paste the property address and we instantly gather Street View details to understand the surroundings.",
  },
  {
    title: "Enhance with your own notes",
    description: "Add bedrooms, upgrades, renovations, or special features to get a perfectly matched description.",
  },
  {
    title: "Publish in seconds",
    description:
      "Get a clean, ready-to-use MLS description you can copy straight into listings, websites, or marketing materials.",
  },
];

const testimonialChecklist = [
  "Address → AI description in under a minute",
  "Street View context that makes listings feel real",
  "First description free, then simple subscription",
];
const ctaHighlights = [
  "First description free",
  "No credit card required",
  "Address → AI listing in seconds",
  "Add your own details anytime",
];

const faqs = [
  {
    question: "What do I need to generate my first property description?",
    answer:
      "All you need is the property address. ListologyAI scans Street View for context and instantly generates a polished description. You can optionally add details like upgrades, rooms, or special features for even more accuracy.",
  },
  {
    question: "Is the first description really free?",
    answer:
      "Yes. Your first description is completely free—no credit card required. If you like the results, you can upgrade to a simple monthly plan to keep generating unlimited listings.",
  },
  {
    question: "What if the property is not available on Google Street View?",
    answer:
      "No problem. The AI will still generate a high-quality description using your written notes. You can add any custom details and the text will adapt perfectly.",
  },
  {
    question: "Can I make the description match my tone or style?",
    answer:
      "Yes. You can adjust tone, length, and style—professional, friendly, luxury, concise, or custom. The description will sound natural and tailored to your voice.",
  },
  {
    question: "Is the copy safe to use on MLS and real estate platforms?",
    answer:
      "Yes. ListologyAI avoids restricted, biased, or non-compliant language, making it safe for MLS, Zillow, Realtor.com, social media, and other listing platforms.",
  },
  {
    question: "How do I use the description after it’s generated?",
    answer:
      "Simply copy and paste it wherever you need: MLS, property portals, your website, brochures, emails—even Instagram captions. Exporting takes just one click.",
  },
];

const testimonials = {
  quote:
    "Before ListologyAi, I spent 20–30 minutes writing each description. Now I just drop the address and get a polished, MLS-ready listing in seconds.",
  name: "Laura Mitrea",
  role: "Real Estate Agent",
};

function HeroShowcase() {
  return (
    <div className="relative mx-auto mt-20 max-w-6xl px-4 sm:px-0">
      <div className="rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-[0_35px_90px_rgba(15,23,42,0.08)] ring-1 ring-neutral-100/70">
        <div className="rounded-xl bg-neutral-50 p-1">
          <Image
            src="/screenshot.png"
            alt="Example of the ListologyAi workspace"
            width={1600}
            height={860}
            className="h-auto w-full rounded-lg object-cover"
            priority
          />
        </div>
        {/* <div className="absolute left-1/2 top-full w-full max-w-sm -translate-x-1/2 -translate-y-12 rounded-xl border border-neutral-100 bg-white px-6 py-5 shadow-2xl sm:left-auto sm:right-12 sm:top-auto sm:-bottom-10 sm:translate-x-0 sm:translate-y-0">
          <p className="text-sm font-semibold  ">Set up your Workspace</p>
          <p className="mt-1 text-sm text-neutral-500">Start with what you need, customize as you go.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {workspaceTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium  "
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-6 space-y-2 text-left">
            <Link
              href="/real-estate-generator"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800"
            >
              Get started
            </Link>
            <p className="text-xs text-neutral-400">Free forever. No credit card.</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default function LandingPage({ currentPriceId }: LandingPageProps) {
  const router = useRouter();
  const [heroAddress, setHeroAddress] = useState("");
  const [heroError, setHeroError] = useState<string | null>(null);

  const handleHeroSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = heroAddress.trim();
    if (!trimmed) {
      setHeroError("Add an address so we can generate your description.");
      return;
    }
    setHeroError(null);
    router.push(`/real-estate-generator?address=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="mt-16  ">
      <main className="isolate">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-14 pb-40 sm:px-6 sm:pt-36 lg:px-8 lg:pb-52">
          {/* <div aria-hidden="true" className="absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white via-white/90 to-transparent" />
            <div className="absolute left-[-12rem] top-16 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl sm:left-[-6rem]" />
            <div className="absolute right-[-8rem] top-32 h-72 w-72 rounded-full bg-purple-100/50 blur-3xl" />
            <div className="absolute inset-x-10 bottom-[-10rem] h-[28rem] rounded-full bg-neutral-100/40 blur-[120px]" /> 
          </div> */}

          <div className="mx-auto max-w-5xl text-center">
         <div
  className="relative inline-flex items-center gap-2 rounded-full px-4 py-1 
             text-[11px] font-semibold uppercase tracking-[0.35em]
             bg-white shadow-sm
             
             before:absolute before:inset-0 before:rounded-full before:p-[2px]
             before:bg-[conic-gradient(at_top_left,_#d00000,_#ffba08,_#d00000)]
             before:content-[''] before:-z-10

             after:absolute after:inset-0 after:rounded-full after:blur-md
             after:bg-[conic-gradient(at_top_left,_#d00000,_#ffba08,_#d00000)]
             after:opacity-40 after:-z-20"
>
  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
  Address → Instant Listing Copy
</div>


            <h1 className="mt-6 text-4xl font-bold tracking-tight   sm:text-6xl">
              Enter the address.
              <br /> Get a ready-to-use listing description in seconds.
            </h1>
            <p className="mt-6 text-sm sm:text-lg leading-8 text-neutral-600">
              Just drop the property address. We automatically analyze Street View, extract key details, and generate a
              clean, persuasive MLS-ready description—without you writing a single word. Perfect for busy agents who
              want fast, professional copy.
            </p>
            <div className="mt-10">
              <div className="mx-auto w-full max-w-none rounded-2xl bg-white/85 p-4 shadow-[0_30px_80px_-70px_rgba(15,23,42,0.55)] sm:max-w-4xl sm:p-5">
                <form
                  onSubmit={handleHeroSubmit}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center"
                  noValidate
                >
                  <div className="w-full">
                    <label htmlFor="hero-address" className="sr-only">
                      Property address
                    </label>
                    <input
                      id="hero-address"
                      type="text"
                      value={heroAddress}
                      onChange={(event) => {
                        setHeroAddress(event.target.value);
                        if (heroError) setHeroError(null);
                      }}
                      placeholder="e.g., 123 Main St, Miami, FL"
                      className="w-full rounded-xl border border-neutral-200 bg-white/95 px-4 py-3 text-base   shadow-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200"
                    />
                  </div>
                  <button
                    className="relative inline-flex w-full items-center justify-center rounded-xl bg-black px-6 py-3 text-white font-semibold sm:w-auto"
                  >
                    <span className="relative z-10">Generate</span>
                  </button>
                </form>
                <p className={`mt-2 text-sm ${heroError ? "text-neutral-600" : "text-neutral-500"}`}>
                  {heroError ?? "Your first description is free. No credit card required."}
                </p>
              </div>
            </div>
          </div>
          <HeroShowcase />
        </section>

        <section className="bg-transparent py-12 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.5em] text-neutral-400">
              Trusted by the best
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-80">
              {heroLogos.map((logo) => (
                <Image
                  key={logo.name}
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className="h-6 w-auto object-contain sm:h-7"
                />
              ))}
            </div>
          </div>
        </section>

        {/* <section className="bg-gradient-to-b from-white via-neutral-50 to-white px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Converged AI platform</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight   sm:text-4xl">
              Everything you need in one workspace
            </h2>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              100+ features to maximize human and AI productivity. Plan projects, launch campaigns, and craft real estate
              listings with one tool instead of twelve.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {gridFeatures.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col items-center gap-3 rounded-xl border border-neutral-100 bg-white px-4 py-6 text-center shadow-[0_28px_80px_-60px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_32px_90px_-65px_rgba(15,23,42,0.3)]"
              >
                <feature.icon aria-hidden="true" className="h-6 w-6  " />
                <p className="text-sm font-semibold  ">{feature.name}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-14 max-w-4xl rounded-xl border border-neutral-100 bg-gradient-to-r from-white via-white to-neutral-50 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_26px_90px_-70px_rgba(15,23,42,0.4)]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold  ">Status overview</p>
                <p className="mt-1 text-sm text-neutral-500">
                  See upcoming listings, drafts, and team approvals without hopping between tools.
                </p>
              </div>
              <Link href="/blog" className="text-sm font-semibold text-indigo-600">
                See how it works <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section> */}
        <section id="features" className="bg-transparent py-10 sm:py-24 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
    <p className="text-sm font-semibold uppercase tracking-wide 
   bg-gradient-to-r from-[#ff0000] via-[#1900ff] to-[#ff0000] 
   bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(240,46,170,0.55)]">
  Built for real estate agents
</p>



              <h2 className="mt-3 text-3xl font-bold tracking-tight   sm:text-4xl">
                A smarter way to generate high-quality listing descriptions.
              </h2>
              <p className="mt-4 text-base leading-7 text-neutral-600">
                Start with the property address — ListologyAI scans Street View for context and generates a polished,
                MLS-ready description in seconds. Want to fine-tune it? Add your own details anytime for even better
                accuracy.
              </p>
              <dl className="mt-4 space-y-3">
                {features.map((feature) => (
                  <div
                    key={feature.name}
                    className="flex items-start gap-4 rounded-xl border border-neutral-100 bg-white p-3 shadow-[0_30px_90px_-70px_rgba(15,23,42,0.4)] ring-1 ring-neutral-100/70"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-200 ">
                      <feature.icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <div>
                      <dt className="text-base font-semibold  ">{feature.name}</dt>
                      <dd className=" text-sm leading-6 text-neutral-600">{feature.description}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-xl border border-neutral-100 bg-white/85 p-4 shadow-[0_32px_90px_-70px_rgba(15,23,42,0.45)] ring-1 ring-neutral-100/80">
              <div className="grid grid-cols-3 gap-4">
                {productStats.map((stat) => (
                  <div key={stat.value} className="rounded-xl bg-neutral-50 p-1 text-center ring-1 ring-neutral-100">
                    <div className="text-2xl font-semibold  ">{stat.value}</div>
                    <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 space-y-6">
                {workflowHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-neutral-100 bg-white/85 p-5 shadow-[0_20px_60px_-60px_rgba(15,23,42,0.45)]"
                  >
                    <p className="text-sm font-semibold  ">{item.title}</p>
                    <p className="mt-2 text-sm text-neutral-600">{item.description}</p>
                  </div>
                ))}
              </div>
<Link
  href="/real-estate-generator"
  className="relative mt-8 inline-flex w-full items-center justify-center
             px-4 py-3 text-sm font-semibold text-white rounded-xl
             overflow-hidden bg-transparent"
>


  <span
    aria-hidden="true"
    className="absolute inset-[3px] rounded-lg bg-neutral-900"
  />

  <span className="relative z-10">Generate your first description</span>
</Link>



            </div>
          </div>
        </section>
        <section id="resources" className="relative overflow-hidden bg-transparent sm:p-3 sm:py-24 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl rounded-2xl sm:border sm:border-neutral-100 sm:bg-gradient-to-br from-white via-neutral-50 to-indigo-50/40 px-3 py-7 sm:shadow-[0_45px_120px_-70px_rgba(15,23,42,0.55)] sm:px-10 sm:py-16 lg:px-12">
            <div className="grid gap-5 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-neutral-100 bg-white/95 p-3 shadow-[0_30px_90px_-70px_rgba(15,23,42,0.35)] sm:p-8">
                <div className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-neutral-600 sm:justify-start">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Customer story
                </div>
                <blockquote className="mt-6 text-2xl font-semibold leading-tight sm:mt-8 sm:text-3xl">
                  “{testimonials.quote}”
                </blockquote>
                <figcaption className="mt-5 text-sm font-semibold text-neutral-500 sm:mt-6 sm:text-base">
                  {testimonials.name} · {testimonials.role}
                </figcaption>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-white/90 p-3 shadow-lg ring-1 ring-neutral-100 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">Why they switched</p>
                <ul className="mt-5 space-y-4 sm:mt-6">
                  {testimonialChecklist.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm sm:text-base">
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold leading-5 text-white">
                        ✓
                      </span>
                      <span className="leading-6 text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-2xl bg-neutral-50 p-5 ring-1 ring-neutral-100 sm:mt-10">
                  <p className="text-sm font-semibold  ">Focus area</p>
                  <p className="mt-1 text-sm text-neutral-600">
                    Busy solo agents and small teams who handle multiple listings per month and need instant, MLS-safe
                    copy that still feels personal.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent via-white/70 to-white"
          />
        </section>
        <section id="pricing" className="bg-transparent px-4 py-10 sm:px-6 lg:px-10">
          {/* <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-neutral-500">Pricing</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight   sm:text-5xl">
              Start free, scale when the team is ready.
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-600">
              Every plan includes unlimited collaborators, MLS-safe templates, and access to billing inside Stripe.
            </p>
          </div> */}
          <div className="mx-auto mt-16 max-w-6xl">
            <Pricing currentPriceId={currentPriceId} />
          </div>
        </section>
        <FeaturedPosts
          posts={homeFeaturedPosts}
          eyebrow="Latest updates"
          title="Fresh insights for modern real estate agents"
          description="Tips, product updates, and real examples to help you create stronger listing descriptions and stand out in any market."
        />

        <section className="bg-transparent px-4 py-24 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-neutral-500">FAQ</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight   sm:text-4xl">Everything you need to know</h2>
            </div>
            <dl className="mt-12 divide-y divide-neutral-100 rounded-xl border border-neutral-100 bg-white/90 shadow-[0_28px_90px_-70px_rgba(15,23,42,0.35)]">
              {faqs.map((faq) => (
                <Disclosure key={faq.question} as="div" className="px-6 py-6 sm:px-8">
                  <dt>
                    <DisclosureButton className="group flex w-full items-start justify-between text-left  ">
                      <span className="text-base font-semibold leading-7">{faq.question}</span>
                      <span className="ml-6 flex h-7 items-center">
                        <PlusSmallIcon aria-hidden="true" className="h-6 w-6 group-data-[open]:hidden" />
                        <MinusSmallIcon aria-hidden="true" className="h-6 w-6 [.group:not([data-open])_&]:hidden" />
                      </span>
                    </DisclosureButton>
                  </dt>
                  <DisclosurePanel as="dd" className="mt-4 pr-6 text-base leading-7 text-neutral-600 sm:pr-8">
                    {faq.answer}
                  </DisclosurePanel>
                </Disclosure>
              ))}
            </dl>
          </div>
        </section>
        <section className="bg-transparent px-4 pb-32 pt-16 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-5xl rounded-2xl border border-neutral-100 bg-gradient-to-r from-white via-neutral-50 to-indigo-50/60 px-10 py-14 text-center shadow-[0_40px_120px_-80px_rgba(15,23,42,0.5)]">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-neutral-500">Get started</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight   sm:text-4xl">
              Ready to generate your first listing?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral-600">
              Start free with one description on us. Just enter the property address, let the AI pull Street View
              context, and get a clean, MLS-ready listing you can use immediately. Upgrade only if you need more
              descriptions.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm  ">
              {ctaHighlights.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-1.5 ring-1 ring-neutral-100"
                >
                  <span className="h-2 w-2 rounded-full bg-neutral-900" />
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/real-estate-generator"
                className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-neutral-800"
              >
                Try the listing writer
              </Link>
              <Link href="/pricing" className="text-sm font-semibold leading-6  ">
                View pricing <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
