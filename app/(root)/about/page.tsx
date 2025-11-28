import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FeaturedPosts } from "@/components/blog/FeaturedPosts";
import { blogPosts } from "@/data/blogPosts";

const stats = [
  { label: "Listings generated so far", value: "68k" },
  { label: "Words written for agents", value: "420M" },
  { label: "Average time saved per listing", value: "18 min" },
];

const values = [
  {
    name: "Clarity over fluff",
    description:
      "Every word should help a buyer picture the property. We prioritize clear, concrete language over buzzwords.",
  },
  {
    name: "Speed that respects your time",
    description:
      "From brief to publish-ready copy in seconds. Agents shouldn’t lose hours writing when they could be closing.",
  },
  {
    name: "On-brand, every time",
    description:
      "Tone presets keep your voice consistent—whether you’re selling luxury, family homes, or new developments.",
  },
  {
    name: "Compliance by default",
    description:
      "We avoid risky or biased language and include gentle reminders so you can keep fair-housing rules in mind when editing.",
  },
  {
    name: "Human in the loop",
    description:
      "AI drafts fast; you make the final call. Edit freely, regenerate sections, and keep your professional judgment in charge.",
  },
  {
    name: "Privacy & trust",
    description:
      "Your inputs stay yours. We protect sensitive details and never share listing data with third parties.",
  },
];

const milestones = [
  {
    year: "2023",
    title: "The first version launches",
    description:
      "ListologyAi starts as a simple tool to help agents turn basic property details into clear descriptions without copy-paste templates.",
  },
  {
    year: "2024",
    title: "From details to addresses",
    description:
      "We shifted the workflow to start from the property address instead of long forms, making it faster to generate listings for busy agents.",
  },
  {
    year: "2025",
    title: "Street View–powered listings",
    description:
      "ListologyAi now uses Street View context and agent-provided notes to produce more realistic, buyer-focused descriptions in seconds.",
  },
];

// const milestones = [
//   {
//     year: "2023",
//     title: "ListologyAi is born",
//     description:
//       "We started as a weekend project for a brokerage drowning in listing descriptions. Within a month, their agents cut copywriting time in half.",
//   },
//   {
//     year: "2024",
//     title: "Beyond real estate",
//     description:
//       "Marketing teams asked for long-form articles, newsletters, and onboarding flows. We expanded templates and added collaboration spaces.",
//   },
//   {
//     year: "2025",
//     title: "Usage intelligence",
//     description:
//       "Usage analytics, plan limits, and Stripe billing landed. Teams now understand ROI at a glance and scale AI access responsibly.",
//   },
// ];

const team = [
  {
    name: "Adriana Ionescu",
    role: "Co-Founder & CEO",
    initials: "AI",
    bio: "Former broker, obsessive about storytelling that converts browsers into visits.",
    palette: "from-neutral-500 to-violet-500",
  },
  {
    name: "Matei Radu",
    role: "Co-Founder & CTO",
    initials: "MR",
    bio: "Built content infrastructure at SaaS scale; believes in expressive tooling for writers.",
    palette: "from-blue-500 to-cyan-500",
  },
  {
    name: "Larisa Pop",
    role: "Head of Product",
    initials: "LP",
    bio: "Maps customer interviews into delightful flows for agencies and solo creators alike.",
    palette: "from-fuchsia-500 to-pink-500",
  },
  {
    name: "Teo Marinescu",
    role: "Lead ML Engineer",
    initials: "TM",
    bio: "Keeps our model stack safe, tunable, and blazing fast across millions of requests.",
    palette: "from-emerald-500 to-lime-500",
  },
  {
    name: "Irina Mureșan",
    role: "Customer Success",
    initials: "IM",
    bio: "Champions white-glove onboarding and training playbooks that teams actually finish.",
    palette: "from-orange-500 to-amber-500",
  },
  {
    name: "Alex Florescu",
    role: "Design Systems",
    initials: "AF",
    bio: "Brings harmony to UI kits, brand voice, and copy guidelines across every channel.",
    palette: "from-neutral-500 to-neutral-700",
  },
];

function HeroPhoto({
  src,
  alt,
  badge,
  className,
  priority,
}: {
  src: string;
  alt: string;
  badge?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-neutral-100 bg-white/80 shadow-[0_35px_80px_-60px_rgba(15,23,42,0.45)] ${
        className ?? ""
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1280px) 220px, (min-width: 1024px) 20vw, (min-width: 640px) 40vw, 80vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 via-transparent to-transparent"
      />
      {badge ? (
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] shadow-sm">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

export const metadata: Metadata = {
  title: "ListologyAi Team for Real Estate Agents",
  description:
    "Learn how the ListologyAi team combines brokerage insight and responsible AI to help agents create standout property descriptions.",
  keywords: [
    "ListologyAi mission",
    "real estate AI team",
    "property description software",
    "AI listing generator story",
  ],
  openGraph: {
    title: "ListologyAi Team for Real Estate Agents",
    description:
      "Meet the people building ListologyAi, the AI description assistant dedicated to helping real estate agents write faster.",
    url: "https://listologyai.com/about",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi brand mark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ListologyAi Team for Real Estate Agents",
    description: "Discover the expertise powering ListologyAi's agent-focused AI property description generator.",
    images: ["/Logo.png"],
  },
};

export default async function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white via-neutral-50 to-white ">
      <main className="isolate">
        {/* Hero section */}
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[56rem] bg-gradient-to-b from-white via-neutral-50 to-white"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-sky-100/40 blur-3xl"
          />

          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
              <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
                <div className="w-full max-w-2xl space-y-6">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] ">
                    About ListologyAi
                  </span>
                  <h1 className="text-4xl font-semibold tracking-tight  sm:text-5xl">
                    We help agents turn any address into a stronger story.
                  </h1>
                  <p className="text-lg leading-8  sm:max-w-xl">
                    ListologyAi takes a simple property address, pulls Street View context, and turns it into a clear,
                    persuasive real estate description. Fast, simple, and designed to help you focus on closing deals
                    instead of staring at a blank page.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/real-estate-generator"
                      className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_35px_80px_-50px_rgba(15,23,42,0.9)] transition hover:bg-neutral-800"
                    >
                      Try now
                    </Link>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center text-sm font-semibold text-neutral-600 transition hover: "
                    >
                      Explore plans <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-10 sm:gap-8 md:mt-0 md:grid-cols-3 md:justify-items-center md:gap-9 lg:gap-12 xl:gap-14">
                  <div className="flex w-full max-w-[220px] flex-col space-y-6 pt-4 sm:max-w-[240px] sm:pt-12 md:pt-6 xl:max-w-none xl:pt-16">
                    <HeroPhoto
                      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
                      alt="ListologyAi team planning a new release"
                      badge="Product strategy"
                      className="aspect-[3/4] sm:aspect-[4/5] md:aspect-[5/6] xl:aspect-[4/5]"
                      priority
                    />
                    <div className="relative rounded-2xl border border-neutral-100 bg-white/85 p-5 shadow-lg shadow-neutral-100/40">
                      <p className="text-xs font-semibold uppercase tracking-wide ">Customer love</p>
                      <p className="mt-2 text-sm font-extrabold ">98% CSAT</p>
                      <p className="mt-1 text-sm ">
                        Agents highlight how easy it is to go from just an address to a ready-to-publish listing.
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full max-w-[220px] flex-col space-y-6 sm:max-w-[240px] sm:pt-10 md:pt-4 xl:max-w-none xl:pt-10">
                    <HeroPhoto
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                      alt="Customer success workshop with real estate agents"
                      badge="Customer success"
                      className="aspect-[4/5] sm:aspect-[3/4] md:aspect-[5/6] xl:aspect-[4/5]"
                    />
                    <div className="relative rounded-2xl border border-neutral-100 bg-white/85 p-5 shadow-lg shadow-neutral-100/40">
                      <p className="text-xs font-semibold uppercase tracking-wide ">Markets served</p>
                      <p className="mt-2 text-sm font-extrabold ">18 regions</p>
                      <p className="mt-1 text-sm ">
                        Agents use ListologyAi in different cities and markets, adapting tone and style to local buyers.
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full max-w-[220px] flex-col space-y-6 sm:max-w-[240px] sm:pt-8 md:pt-2 xl:max-w-none xl:pt-6">
                    <HeroPhoto
                      src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
                      alt="Engineers refining AI listings on laptops"
                      badge="AI lab"
                      className="aspect-[5/7] sm:aspect-[3/4] md:aspect-[7/10] xl:aspect-[4/5]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission section */}
        <section className="relative mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-0 hidden h-80 w-80 rounded-full bg-neutral-200/50 blur-3xl sm:block"
          />
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl">Our mission</h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
              <div className="space-y-6 ">
                <p className="text-xl leading-8 ">
                  ListologyAi was created to help real estate agents write property descriptions that sell — faster and
                  easier. Instead of filling long forms, you start with the property address. From there, we use Street
                  View and your notes to generate natural, buyer-friendly copy.
                </p>

                <div className="rounded-2xl border border-neutral-100 bg-white/80 p-6 shadow-lg shadow-neutral-100/50 backdrop-blur">
                  <h3 className="text-lg font-semibold ">From just an address to a polished listing in seconds</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    No more rewriting old listings or staring at a blank screen. With ListologyAi, agents paste the
                    address, add any key details they care about, and instantly get a complete, well-structured
                    description they can publish on MLS or anywhere else.
                  </p>
                </div>

                <p>
                  Tuned specifically for real estate, our AI focuses on what buyers actually care about: location,
                  surroundings, curb appeal, and unique features. Each description is built for clarity and flow, so
                  your listings feel real, relatable, and ready to share across every channel.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-neutral-500 via-purple-500 to-fuchsia-500 p-[1px] shadow-2xl shadow-neutral-200/40">
                  <div className="flex h-full flex-col gap-6 rounded-xl bg-neutral-950/90 px-8 py-10 text-white">
                    <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                      Agent Feedback
                    </span>
                    <p className="text-lg leading-7 text-white/90">
                      “With ListologyAi, I just drop the address and tweak a few details. The listing reads like I spent
                      half an hour on it, but it only takes a couple of minutes.”
                    </p>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
                        AR
                      </span>
                      <div>
                        <p className="font-semibold">Alex Rivera</p>
                        <p className="text-xs text-white/60">Real Estate Agent</p>
                      </div>
                    </div>
                  </div>
                </div>

                <dl className="grid gap-4 rounded-2xl border border-neutral-100 bg-white/80 p-6 shadow-xl shadow-neutral-100/60 backdrop-blur">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col gap-1 rounded-2xl border border-neutral-50 bg-white px-4 py-3 shadow-sm"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-wide ">{stat.label}</dt>
                      <dd className="text-3xl font-semibold ">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="relative mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl">How we got here</h2>
            <p className="mt-6 text-lg leading-8">
              What started as a simple AI tool for writing property descriptions quickly became the go-to assistant for
              real estate agents who want to sell faster and write smarter.
            </p>
          </div>

          <div className="relative mx-auto mt-16 grid max-w-4xl gap-12 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="relative rounded-2xl border border-neutral-100 bg-white/70 p-8 shadow-xl shadow-neutral-100/40 backdrop-blur">
              <h3 className="text-lg font-semibold ">Milestones that shaped ListologyAi</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                We’ve focused on one goal since day one: helping real estate professionals save time while creating
                listings that convert. Each update brought us closer to making property marketing effortless.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm ">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 ">
                    1
                  </span>
                  <p>Launched instant AI description generation for agents worldwide.</p>
                </div>
                <div className="flex items-center gap-3 text-sm ">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 ">
                    2
                  </span>
                  <p>Introduced tone presets — from luxury to friendly — to match every brand voice.</p>
                </div>
                <div className="flex items-center gap-3 text-sm ">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 ">
                    3
                  </span>
                  <p>Added smart optimization tips to highlight property features and calls-to-action that sell.</p>
                </div>
              </div>
            </div>

            <dl className="relative flex flex-col gap-12">
              <div className="absolute left-5 top-0 bottom-0 hidden w-px bg-gradient-to-b from-neutral-200 via-grayv-100 to-transparent lg:block" />
              {milestones.map((item, index) => (
                <div key={item.year} className="relative pl-12">
                  <span className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-600 text-sm font-semibold text-white shadow-lg">
                    {index + 1}
                  </span>
                  <dt className="text-sm font-semibold uppercase tracking-wide ">{item.year}</dt>
                  <dd className="mt-1 text-xl font-semibold ">{item.title}</dd>
                  <dd className="mt-3 text-sm leading-6 ">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Values */}
        <section className="relative mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8 sm:mb-32">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl">Our values</h2>
            <p className="mt-6 text-lg leading-8 ">
              These principles steer every roadmap decision, client call, and line of copy we ship.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value, idx) => (
              <div
                key={value.name}
                className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-neutral-100 bg-white/80 p-6 shadow-lg shadow-neutral-100/40 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-500 via-purple-500 to-fuchsia-500 text-sm font-semibold text-white shadow-md">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <dt className="text-lg font-semibold ">{value.name}</dt>
                <dd className="text-sm leading-6 ">{value.description}</dd>
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 via-purple-500/5 to-fuchsia-500/5" />
                </div>
              </div>
            ))}
          </dl>
        </section>
        <FeaturedPosts
          posts={blogPosts.slice(3, 6)}
          eyebrow="Latest from the blog"
          title="How agents are using ListologyAi in their daily work"
          description="See real workflows, product tips, and practical examples from agents who use AI to speed up listing preparation."
        />

        {/* Team */}
        <section className="relative mx-auto mt-32 max-w-7xl px-6 sm:mt-32 lg:px-8 sm:mb-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden [mask-image:radial-gradient(55%_55%_at_50%_50%,white,transparent)]"
          ></div>
          <div className="mx-auto max-w-2xl text-center lg:max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl">Meet the team</h2>
            <p className="mt-6 text-lg leading-8 ">
              We are builders, writers, and analysts obsessed with helping real estate agents and small agencies publish
              faster. Our generation stack blends local context, Street View insights, and your brand tone so listing
              descriptions not only read beautifully — they actually help drive more viewings and offers.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-12 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-6"
          >
            {team.map((person) => (
              <li key={person.name} className="flex flex-col items-center gap-y-3">
                <span
                  className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${person.palette} text-lg font-semibold text-white shadow-lg shadow-neutral-200/40`}
                >
                  {person.initials}
                </span>
                <h3 className="text-base font-semibold leading-7 tracking-tight ">{person.name}</h3>
                <p className="text-sm leading-6 ">{person.role}</p>
                <p className="text-sm ">{person.bio}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
