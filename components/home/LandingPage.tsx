"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  MinusSmallIcon,
  PlusSmallIcon,
} from "@heroicons/react/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import Pricing from "@/components/Pricing";
import { FeaturedPosts } from "@/components/blog/FeaturedPosts";
import { blogPosts } from "@/data/blogPosts";

const homeFeaturedPosts = blogPosts.slice(0, 3);

const features = [
  {
    name: "Guided briefs that spark better drafts",
    description:
      "Collect property specs, brand voice, and compliance notes in one structured form. HomeListerAi transforms context into polished copy instantly.",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    name: "Usage guardrails & credits",
    description:
      "Plan-level limits, monthly resets, and real-time dashboards keep finance and ops confident about AI adoption across teams.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Collaboration that feels human",
    description:
      "Invite writers, marketers, and agents. Leave comments, stage revisions, and approve final copy without jumping between tools.",
    icon: SparklesIcon,
  },
  {
    name: "Insights that show ROI",
    description:
      "Track which templates convert, how much time you save, and where to double down with content automation.",
    icon: ChartBarIcon,
  },
];

const faqs = [
  {
    question: "What information do I need to generate my first property listing?",
    answer:
      "Start with the basics: property type, address or neighbourhood, bed and bath count, standout features, and any compliance must-haves like HOA fees or license numbers. The more context you give, the sharper the AI draft becomes.",
  },
  {
    question: "Can HomeListerAi pull data from our MLS or CRM?",
    answer:
      "Yes. Connect your MLS feed or CRM via our integrations and we will auto-populate briefs with photos, specs, and pricing. You can still edit every field before generating the description.",
  },
  {
    question: "How many listings can my team generate on the free plan?",
    answer:
      "The free tier includes three full listings each month so you can trial the workflow. Upgrading unlocks unlimited drafts, collaboration tools, and brand libraries for your whole brokerage.",
  },
  {
    question: "Is the copy compliant with fair housing guidelines?",
    answer:
      "Our templates include built-in reminders for fair housing language, local disclosure requirements, and automated checks against risky phrasing. You can add custom compliance rules for your market.",
  },
  {
    question: "Can I collaborate with agents who work under different brands?",
    answer:
      "Absolutely. Workspaces support multiple brands with separate tone presets, logo assets, and approval flows so teams and partner agencies stay on-brand without extra juggling.",
  },
  {
    question: "What happens after we publish a listing draft?",
    answer:
      "You can export directly to your MLS template, share a review link with sellers, or send the copy to your marketing automation tools. Analytics track which drafts get the most engagement so you can refine future briefs.",
  },
];

const partnerLogos = [
  { alt: "Stripe", src: "/stripe-3.svg" },
  { alt: "Primer", src: "/primer.svg" },
  { alt: "Transistor", src: "/transistor-horizontal-logo.svg" },
  { alt: "Uber", src: "/uber.svg" },
  { alt: "Statamic", src: "/statamic.svg" },
];

// const uspHighlights = [
//   {
//     title: "Speed up every listing",
//     description:
//       "Agents ship MLS-ready descriptions in minutes, not hours, with localised tone and compliance prompts.",
//   },
//   {
//     title: "Scale long-form content",
//     description:
//       "Marketing teams craft newsletters, blog posts, and nurture flows with reusable briefs and AI-assisted rewrites.",
//   },
//   {
//     title: "Keep billing transparent",
//     description:
//       "Stripe-powered portal lets admins manage seats, update payment methods, and view usage before each renewal.",
//   },
// ];

const testimonials = {
  quote:
    "HomeListerAi cut our listing turnaround time by 60%. Agents now focus on storytelling while AI keeps compliance in check.",
  name: "Laura Mitrea",
  role: "Marketing Director, Skyline Homes",
};

function HeroMockup() {
  return (
    <div className="rounded-3xl border border-indigo-100 bg-white shadow-2xl shadow-indigo-200/40">
      <div className="flex items-center gap-2 border-b border-indigo-100 px-6 py-4">
        <span className="h-3 w-3 rounded-full bg-rose-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <p className="ml-auto text-xs font-semibold text-indigo-500">HomeListerAi Workspace</p>
      </div>
      <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Brief summary</p>
          <div className="rounded-2xl bg-indigo-50/60 p-4 text-sm text-gray-700">
            <p className="font-semibold text-indigo-700">Downtown loft • 2BR • Skyline views</p>
            <p className="mt-2">
              Highlight open-concept living, floor-to-ceiling windows, and proximity to transit. Focus on young
              professionals moving into the city.
            </p>
          </div>
          <div className="rounded-2xl border border-dashed border-indigo-200 p-4 text-xs text-gray-500">
            tone: modern, confident · call-to-action: schedule tour · compliance reminder: mention HOA fees
          </div>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/70 to-white p-6 text-sm text-gray-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">AI generated draft</p>
          <p className="mt-3 leading-6">
            Welcome home to skyline living in the heart of the city. This sun-soaked loft pairs soaring 12-foot ceilings
            with industrial touches and a chef-ready kitchen. Step onto your private balcony for sunset views, or head
            downstairs to cafés, boutique gyms, and the light-rail just one block away.
          </p>
          <p className="mt-3 leading-6">
            Two spacious bedrooms, custom closets, and an ensuite retreat give you room to recharge. HOA covers water,
            trash, and concierge—schedule your tour today and experience downtown without compromise.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-900">
      <main className="isolate">
        {/* Hero */}
        <section id="platform" className="relative pt-28 sm:pt-36">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-60 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%,100% 61.6%,97.5% 26.9%,85.5% 0.1%,80.7% 2%,72.5% 32.5%,60.2% 62.4%,52.4% 68.1%,47.5% 58.3%,45.2% 34.5%,27.5% 76.7%,0.1% 64.9%,17.9% 100%,27.6% 76.8%,76.1% 97.7%,74.1% 44.1%)",
              }}
              className="relative left-1/2 aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 opacity-60 sm:w-[72.1875rem]"
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Creative AI tooling for teams that craft premium listings.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                HomeListerAi connects your briefs, brand voice, and AI assistants in one workspace. Produce consistent
                real estate copy, long-form articles, and client campaigns without the chaos.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/real-estate-generator"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Try the listing writer
                </Link>
                <Link href="/pricing" className="text-sm font-semibold leading-6 text-gray-900">
                  View pricing <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="mt-16 sm:mt-24">
              <div className="-m-2 rounded-[2.5rem] bg-gradient-to-b from-white to-indigo-50/40 p-2 ring-1 ring-inset ring-indigo-100 lg:-m-4 lg:rounded-[3rem] lg:p-4">
                <HeroMockup />
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-20rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%,100% 61.6%,97.5% 26.9%,85.5% 0.1%,80.7% 2%,72.5% 32.5%,60.2% 62.4%,52.4% 68.1%,47.5% 58.3%,45.2% 34.5%,27.5% 76.7%,0.1% 64.9%,17.9% 100%,27.6% 76.8%,76.1% 97.7%,74.1% 44.1%)",
              }}
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-100 to-purple-100 opacity-60 sm:left-[calc(50%+25rem)] sm:w-[72.1875rem]"
            />
          </div>
        </section>
        {/* Logo cloud */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mt-12 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            {partnerLogos.map((logo) => (
              <div key={logo.alt} className="flex items-center justify-center">
                <Image src={logo.src} alt={logo.alt} width={158} height={48} className="max-h-12" />
              </div>
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <div className="relative rounded-full bg-indigo-50 px-4 py-1.5 text-sm leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-100">
              <span className="hidden md:inline">See how agents turn AI copy into showings.</span>
              <Link href="/blog" className="ml-1 font-semibold">
                Read customer stories <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
        {/* Feature section */}
        <section id="features" className="mx-auto mt-32 max-w-7xl px-6 sm:mt-48 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Workflows that flow</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Automate the busywork, keep the craft.
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              HomeListerAi gives marketers and agents a shared workspace for briefs, AI drafts, revisions, and
              approvals. No more bouncing between docs, email, and chat threads.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-3xl sm:mt-20 lg:mt-24 lg:max-w-5xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <span className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
                      <feature.icon aria-hidden="true" className="h-6 w-6 text-white" />
                    </span>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        {/* Unique selling section */}
        {/* <section className="mx-auto mt-32 max-w-6xl px-6 sm:mt-48 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {uspHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm ring-1 ring-indigo-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <ArrowTrendingUpIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section> */}
        {/* Testimonial */}
        <section id="resources" className="mx-auto mt-32 max-w-7xl px-6 sm:mt-16 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-20 shadow-xl sm:px-12 lg:px-16">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/60 via-purple-600/50 to-slate-900/70" />
            <div className="absolute -left-40 -top-40 h-72 w-72 rounded-full bg-indigo-400/40 blur-3xl" />
            <div className="relative mx-auto max-w-3xl text-center text-white">
              <div className="flex justify-center">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Customer spotlight
                </div>
              </div>
              <blockquote className="mt-8 text-xl font-semibold leading-8 sm:text-2xl sm:leading-9">
                <p>“{testimonials.quote}”</p>
              </blockquote>
              <figcaption className="mt-6 text-sm font-medium text-indigo-100">
                <div>{testimonials.name}</div>
                <div className="text-indigo-200/80">{testimonials.role}</div>
              </figcaption>
            </div>
          </div>
        </section>
        {/* Pricing */}
        <section id="pricing" className="py-24 sm:pt-48">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Pricing</h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Plans for solo creators and full marketing teams
              </p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
              Start free, then upgrade when you are ready to onboard your teammates. Usage credits, billing portal, and
              invoices are handled automatically via Stripe.
            </p> */}
            <div className="mt-16">
              <Pricing currentPriceId={null} />
            </div>
          </div>
        </section>
        <FeaturedPosts
          posts={homeFeaturedPosts}
          eyebrow="Latest updates"
          title="Fresh insights for modern real estate teams"
          description="Playbooks, product releases, and customer stories to help you launch standout listings and campaigns."
        />
        {/* FAQ */}
        <section className="px-6 pb-16 sm:pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
              <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
              <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
                {faqs.map((faq) => (
                  <Disclosure key={faq.question} as="div" className="pt-6">
                    <dt>
                      <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          <PlusSmallIcon aria-hidden="true" className="h-6 w-6 group-data-[open]:hidden" />
                          <MinusSmallIcon aria-hidden="true" className="h-6 w-6 [.group:not([data-open])_&]:hidden" />
                        </span>
                      </DisclosureButton>
                    </dt>
                    <DisclosurePanel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </dl>
            </div>
          </div>
        </section>
        z{/* CTA */}
        <section className="relative mt-32 px-6 pb-32 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden blur-3xl"
          >
            <div className="h-[20rem] w-[50rem] bg-gradient-to-r from-indigo-100 via-white to-purple-100" />
          </div>
          <div className="mx-auto max-w-3xl rounded-3xl border border-indigo-100 bg-white p-10 text-center shadow-lg shadow-indigo-100/60">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to see HomeListerAi inside your workflow?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-600">
              Create an account in minutes, invite your team, and generate three listings on us. Upgrade when you are
              ready to scale production.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/sign-up"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Start for free
              </Link>
              <Link href="/real-estate-generator" className="text-sm font-semibold leading-6 text-gray-900">
                Generate a listing <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
