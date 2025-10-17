import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FeaturedPosts } from "@/components/blog/FeaturedPosts";
import { blogPosts } from "@/data/blogPosts";

const stats = [
  { label: "Listings generated this year", value: "68k" },
  { label: "Words written for clients", value: "420M" },
  { label: "Average time saved per brief", value: "18 min" },
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
      "We avoid biased or restricted phrasing and surface fair-housing reminders so you can publish with confidence.",
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
      "ListologyAi debuts as a lightweight tool for instantly generating real estate descriptions based on property details.",
  },
  {
    year: "2024",
    title: "Personalization and tone controls",
    description:
      "We introduced tone presets and smarter phrasing to let agents match each description to their market and audience.",
  },
  {
    year: "2025",
    title: "Smarter AI, better conversions",
    description:
      "Our generation model learned from thousands of listings to suggest more engaging, compliant, and conversion-ready copy.",
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
    palette: "from-indigo-500 to-violet-500",
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
    palette: "from-slate-500 to-slate-700",
  },
];

const partnerLogos = [
  { alt: "Transistor", src: "/transistor-horizontal-logo.svg" },
  { alt: "Primer", src: "/primer.svg" },
  { alt: "Stripe", src: "/stripe-3.svg" },
  { alt: "Statamic", src: "/statamic.svg" },
  { alt: "Uber", src: "/uber.svg" },
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
      className={`group relative overflow-hidden rounded-3xl border border-indigo-100/80 bg-white/50 shadow-xl shadow-indigo-100/40 backdrop-blur ${
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
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-indigo-950/30 via-transparent to-transparent" />
      {badge ? (
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 shadow-sm">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

export const metadata: Metadata = {
  title: "About ListologyAi",
  description:
    "Learn how ListologyAi helps real estate teams and marketers pair human storytelling with responsible AI, from our product values to the crew building it.",
  openGraph: {
    title: "About ListologyAi",
    description:
      "Discover the mission, team, and milestones behind ListologyAi—the platform powering high-converting real estate content.",
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
    title: "About ListologyAi",
    description:
      "Explore our product principles, customer impact, and the people shaping smarter real estate marketing.",
    images: ["/Logo.png"],
  },
};

export default async function AboutPage() {
  return (
    <div className="bg-white text-gray-900">
      <main className="isolate">
        {/* Hero section */}
        <section className="relative isolate -z-10">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-20 h-[64rem] w-full bg-gradient-to-b from-indigo-50 via-white to-white"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          >
            <div
              style={{
                clipPath:
                  "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
              }}
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 opacity-60"
            />
          </div>

          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 sm:pt-36 lg:px-8 lg:pt-28">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">About ListologyAi</p>
                  <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    We help agents tell richer stories with responsible AI.
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                    Create powerful real estate descriptions with AI. Simple, fast, and designed to help you close deals
                    quicker.
                  </p>
                  <div className="mt-10 flex flex-wrap items-center gap-3">
                    <Link
                      href="/real-estate-generator"
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Try now
                    </Link>
                    <Link href="/pricing" className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-indigo-500">
                      Explore plans <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>

                <div className="mt-14 flex flex-wrap justify-end gap-6 sm:-mt-32 sm:justify-start sm:pl-10 lg:mt-0 lg:flex-nowrap lg:pl-0">
                  <div className="ml-auto flex w-40 flex-none flex-col space-y-6 pt-12 sm:ml-0 sm:w-48 sm:pt-24 lg:pt-16">
                    <HeroPhoto
                      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
                      alt="ListologyAi team planning a new release"
                      badge="Product strategy"
                      className="aspect-[3/4]"
                      priority
                    />
                    <div className="relative rounded-2xl border border-indigo-100 bg-white/85 p-5 shadow-lg shadow-indigo-100/40">
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Customer love</p>
                      <p className="mt-2 text-sm font-semibold text-gray-900">98% CSAT</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Teams highlight the balance between automation and hands-on control.
                      </p>
                    </div>
                  </div>
                  <div className="flex w-40 flex-none flex-col space-y-6 sm:w-48 sm:pt-16 lg:pt-10">
                    <HeroPhoto
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                      alt="Customer success workshop with real estate agents"
                      badge="Customer success"
                      className="aspect-[4/5]"
                    />
                    <div className="relative rounded-2xl border border-indigo-100 bg-white/85 p-5 shadow-lg shadow-indigo-100/40">
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Markets served</p>
                      <p className="mt-2 text-sm font-semibold text-gray-900">18 regions</p>
                      <p className="mt-1 text-sm text-gray-600">Localized frameworks and tone presets tuned to each market.</p>
                    </div>
                  </div>
                  <div className="flex w-full flex-none flex-col space-y-6 sm:w-48 sm:pt-10 lg:w-52 lg:pt-6">
                    <HeroPhoto
                      src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
                      alt="Engineers refining AI listings on laptops"
                      badge="AI lab"
                      className="aspect-[5/7] sm:aspect-[3/4]"
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
            className="pointer-events-none absolute -top-40 right-0 hidden h-80 w-80 rounded-full bg-indigo-200/50 blur-3xl sm:block"
          />
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our mission</h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
              <div className="space-y-6 text-gray-600">
                <p className="text-xl leading-8 text-gray-700">
                  ListologyAi was created to help real estate agents write property descriptions that sell — faster and
                  easier. Our AI model transforms simple details like size, location, and features into natural,
                  persuasive copy that attracts more buyers.
                </p>

                <div className="rounded-3xl border border-indigo-100 bg-white/80 p-6 shadow-lg shadow-indigo-100/50 backdrop-blur">
                  <h3 className="text-lg font-semibold text-indigo-700">
                    From blank page to polished listing in seconds
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    No more staring at a blank screen or rewriting old templates. With ListologyAi, agents generate
                    complete, well-structured descriptions in one click — saving hours every week while keeping quality
                    consistent across every listing.
                  </p>
                </div>

                <p>
                  Trained specifically on real estate copy that converts, our AI doesn’t just write — it understands
                  what makes a property stand out. Each description comes with tone, flow, and calls-to-action that make
                  listings more engaging and ready to publish anywhere.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 p-[1px] shadow-2xl shadow-indigo-200/40">
                  <div className="flex h-full flex-col gap-6 rounded-[calc(theme(borderRadius.3xl)-1px)] bg-slate-950/90 px-8 py-10 text-white">
                    <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                      Agent Feedback
                    </span>
                    <p className="text-lg leading-7 text-white/90">
                      “With ListologyAi, I write better listings in minutes. The descriptions sound professional, save
                      me time, and help my properties get more attention.”
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

                <dl className="grid gap-4 rounded-3xl border border-indigo-100 bg-white/80 p-6 shadow-xl shadow-indigo-100/60 backdrop-blur">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col gap-1 rounded-2xl border border-indigo-50 bg-white px-4 py-3 shadow-sm"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{stat.label}</dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stat.value}</dd>
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
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How we got here</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              What started as a simple AI tool for writing property descriptions quickly became the go-to assistant for
              real estate agents who want to sell faster and write smarter.
            </p>
          </div>

          <div className="relative mx-auto mt-16 grid max-w-4xl gap-12 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="relative rounded-3xl border border-indigo-100 bg-white/70 p-8 shadow-xl shadow-indigo-100/40 backdrop-blur">
              <h3 className="text-lg font-semibold text-indigo-700">Milestones that shaped ListologyAi</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                We’ve focused on one goal since day one: helping real estate professionals save time while creating
                listings that convert. Each update brought us closer to making property marketing effortless.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    1
                  </span>
                  <p>Launched instant AI description generation for agents worldwide.</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    2
                  </span>
                  <p>Introduced tone presets — from luxury to friendly — to match every brand voice.</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    3
                  </span>
                  <p>Added smart optimization tips to highlight property features and calls-to-action that sell.</p>
                </div>
              </div>
            </div>

            <dl className="relative flex flex-col gap-12">
              <div className="absolute left-5 top-0 bottom-0 hidden w-px bg-gradient-to-b from-indigo-200 via-indigo-100 to-transparent lg:block" />
              {milestones.map((item, index) => (
                <div key={item.year} className="relative pl-12">
                  <span className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-lg">
                    {index + 1}
                  </span>
                  <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-500">{item.year}</dt>
                  <dd className="mt-1 text-xl font-semibold text-gray-900">{item.title}</dd>
                  <dd className="mt-3 text-sm leading-6 text-gray-600">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Values */}
        <section className="relative mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8 sm:mb-32">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              These principles steer every roadmap decision, client call, and line of copy we ship.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value, idx) => (
              <div
                key={value.name}
                className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 p-6 shadow-lg shadow-indigo-100/40 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-sm font-semibold text-white shadow-md">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <dt className="text-lg font-semibold text-gray-900">{value.name}</dt>
                <dd className="text-sm leading-6 text-gray-600">{value.description}</dd>
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-fuchsia-500/5" />
                </div>
              </div>
            ))}
          </dl>
        </section>

        {/* Logo cloud */}
        {/* <section className="relative isolate -z-10 mt-32 sm:mt-48">
          <div className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden [mask-image:radial-gradient(50%_45%_at_50%_55%,white,transparent)]">
            <div className="h-[30rem] w-[60rem] bg-gradient-to-r from-indigo-100 via-white to-purple-100" />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
              Trusted by content teams shipping thousands of assets every month
            </h2>
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-5">
              {partnerLogos.map((logo) => (
                <div key={logo.alt} className="flex items-center justify-center">
                  <Image alt={logo.alt} src={logo.src} width={158} height={48} className="max-h-12" />
                </div>
              ))}
            </div>
          </div>
        </section> */}

        <FeaturedPosts
          posts={blogPosts.slice(3, 6)}
          eyebrow="Latest from the blog"
          title="How teams are scaling content with ListologyAi"
          description="Dive into customer stories, roadmap updates, and practical playbooks from our crew."
        />

        {/* Team */}
        <section className="relative mx-auto mt-32 max-w-7xl px-6 sm:mt-32 lg:px-8 sm:mb-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden [mask-image:radial-gradient(55%_55%_at_50%_50%,white,transparent)]"
          ></div>
          <div className="mx-auto max-w-2xl text-center lg:max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet the team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We are builders, writers, and analysts obsessed with helping teams publish faster. Our custom generation
              stack blends market data and brand tone so listing descriptions not only read beautifully—they
              consistently drive tours and sales.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-12 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-6"
          >
            {team.map((person) => (
              <li key={person.name} className="flex flex-col items-center gap-y-3">
                <span
                  className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${person.palette} text-lg font-semibold text-white shadow-lg shadow-indigo-200/40`}
                >
                  {person.initials}
                </span>
                <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{person.name}</h3>
                <p className="text-sm leading-6 text-indigo-600">{person.role}</p>
                <p className="text-sm text-gray-600">{person.bio}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* <footer className="mx-auto mt-40 max-w-7xl overflow-hidden px-6 pb-16 sm:mt-56 sm:pb-24 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-gray-100 pt-10 sm:flex-row">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} ListologyAi. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-semibold text-gray-600">
            <Link href="/pricing">Pricing</Link>
            <Link href="/real-estate-generator">Real Estate AI</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
