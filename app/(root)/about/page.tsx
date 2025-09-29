import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

const stats = [
  { label: "Listings generated this year", value: "68k" },
  { label: "Words written for clients", value: "420M" },
  { label: "Average time saved per brief", value: "18 min" },
];

const values = [
  {
    name: "Ship with empathy",
    description:
      "Every feature starts with real customer stories. We prototype alongside agents, marketers, and founders so the workflows feel native from day one.",
  },
  {
    name: "Stay human-in-the-loop",
    description:
      "AI serves as a creative copilot, not a replacement. Our guardrails and review tooling keep teams confident in every deliverable.",
  },
  {
    name: "Make data trustworthy",
    description:
      "From property specs to brand voice, data is encrypted, versioned, and auditable. Transparency is the backbone of our platform.",
  },
  {
    name: "Learn relentlessly",
    description:
      "We run weekly teardown sessions on the best and the broken. Insight from support tickets goes straight into the roadmap.",
  },
  {
    name: "Build responsibly",
    description:
      "Usage caps, billing clarity, and fine-grained controls help teams scale output without surprises for finance or compliance.",
  },
  {
    name: "Celebrate wins together",
    description:
      "We highlight customer launches in every all-hands. When your campaign lands, the whole ScriptNest Crew is cheering with you.",
  },
];

const milestones = [
  {
    year: "2023",
    title: "ScriptNest is born",
    description:
      "We started as a weekend project for a brokerage drowning in listing descriptions. Within a month, their agents cut copywriting time in half.",
  },
  {
    year: "2024",
    title: "Beyond real estate",
    description:
      "Marketing teams asked for long-form articles, newsletters, and onboarding flows. We expanded templates and added collaboration spaces.",
  },
  {
    year: "2025",
    title: "Usage intelligence",
    description:
      "Usage analytics, plan limits, and Stripe billing landed. Teams now understand ROI at a glance and scale AI access responsibly.",
  },
];

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

const updates = [
  {
    id: 1,
    title: "Boosting long-form output with structured briefs",
    description:
      "We launched collaborative briefs so marketers can capture brand voice, key messages, and SEO angles before AI drafting begins.",
    date: "Aug 12, 2025",
    href: "/blog/structured-briefs",
  },
  {
    id: 2,
    title: "Usage insights for revenue teams",
    description:
      "Plan owners now see live usage, upcoming renewals, and exportable invoices—no more guesswork around AI spend.",
    date: "Jul 02, 2025",
    href: "/blog/usage-insights",
  },
  {
    id: 3,
    title: "Portal upgrades powered by Stripe",
    description:
      "Self-serve upgrades, downgrades, and payment method management are now built into the customer portal.",
    date: "Jun 15, 2025",
    href: "/blog/portal-upgrades",
  },
];

const partnerLogos = [
  { alt: "Transistor", src: "/transistor-horizontal-logo.svg" },
  { alt: "Primer", src: "/primer.svg" },
  { alt: "Stripe", src: "/stripe-3.svg" },
  { alt: "Statamic", src: "/statamic.svg" },
  { alt: "Uber", src: "/uber.svg" },
];

function GradientCard({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/80 via-purple-500/70 to-fuchsia-500/80 shadow-lg ring-1 ring-white/20 ${className ?? ""}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
      <div className="relative h-full" />
    </div>
  );
}

export default async function AboutPage() {
  return (
    <div className="bg-white text-gray-900">
      <Navbar />

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
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-32 sm:pt-48 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">About ScriptNest</p>
                  <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    We help teams tell richer stories with responsible AI.
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                    ScriptNest brings real estate agents, marketers, and founders into a shared workspace where briefs,
                    AI suggestions, and final copy live side by side. From property listings to long-form thought
                    leadership, we turn scattered workflows into a single source of truth.
                  </p>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link
                      href="/pricing"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Explore plans
                    </Link>
                    <Link href="/real-estate-generator" className="text-sm font-semibold leading-6 text-gray-900">
                      Try the real estate writer <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>

                <div className="mt-14 flex justify-end gap-8 sm:-mt-32 sm:justify-start sm:pl-10 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-6 pt-16 sm:ml-0 sm:pt-32 lg:order-last lg:pt-16 xl:order-none xl:pt-32">
                    <GradientCard className="aspect-[2/3]" />
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-6 sm:mr-0 sm:pt-20 lg:pt-12">
                    <GradientCard className="aspect-[2/3]" />
                    <div className="relative rounded-xl border border-indigo-100 bg-white/80 p-4 shadow-sm">
                      <p className="text-sm font-semibold text-indigo-600">98% CSAT</p>
                      <p className="mt-2 text-sm text-gray-600">
                        Teams love the balance between automation and hands-on control.
                      </p>
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-6 pt-12 sm:pt-0">
                    <GradientCard className="aspect-[2/3]" />
                    <div className="relative rounded-xl border border-indigo-100 bg-white/80 p-4 shadow-sm">
                      <p className="text-sm font-semibold text-indigo-600">Global coverage</p>
                      <p className="mt-2 text-sm text-gray-600">
                        Copy frameworks tuned for 18 markets and counting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission section */}
        <section className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our mission</h2>
            <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
              <div className="lg:w-full lg:max-w-2xl lg:flex-auto space-y-6 text-gray-600">
                <p className="text-xl leading-8 text-gray-700">
                  ScriptNest exists to remove the blank-page anxiety so teams can focus on client relationships and
                  creative strategy. We blend structured data, reusable prompts, and team-wide guardrails to keep every
                  piece of copy consistent with your brand.
                </p>
                <p>
                  Whether you are launching a development, nurturing leads, or publishing weekly blogs, we bring
                  research, compliance, and feedback into a single surface. What started with real estate now serves
                  agencies, proptech startups, and internal marketing squads.
                </p>
                <p>
                  We believe AI should feel like a trusted colleague: quick, responsible, and deeply aligned with your
                  voice. That is why every workflow gives you final cut and visibility into how drafts are created.
                </p>
              </div>
              <div className="lg:flex lg:flex-auto lg:justify-center">
                <dl className="w-64 space-y-8 xl:w-80">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col-reverse gap-y-2">
                      <dt className="text-base leading-7 text-gray-600">{stat.label}</dt>
                      <dd className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How we got here</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              From a single listing generator to a full AI content workspace, here are the moments that shaped ScriptNest.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {milestones.map((item) => (
              <div key={item.year} className="flex flex-col gap-y-2">
                <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-500">{item.year}</dt>
                <dd className="text-xl font-semibold text-gray-900">{item.title}</dd>
                <dd className="text-gray-600">{item.description}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Values */}
        <section className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              These principles steer every roadmap decision, client call, and line of copy we ship.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.name}>
                <dt className="font-semibold text-gray-900">{value.name}</dt>
                <dd className="mt-1 text-gray-600">{value.description}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Logo cloud */}
        <section className="relative isolate -z-10 mt-32 sm:mt-48">
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
        </section>

        {/* Team */}
        <section className="mx-auto mt-32 max-w-7xl px-6 sm:mt-48 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet the team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We are builders, writers, and analysts obsessed with crafting friendly tooling for human storytellers.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-12 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-6"
          >
            {team.map((person) => (
              <li key={person.name} className="flex flex-col items-center gap-y-3">
                <span
                  className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${person.palette} text-lg font-semibold text-white shadow-lg`}
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

        {/* Latest updates */}
        <section className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Latest updates</h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                  Product changelog, customer stories, and behind-the-scenes learnings from the ScriptNest Crew.
                </p>
              </div>
              <Link href="/blog" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                View all updates <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {updates.map((post) => (
                <article
                  key={post.id}
                  className="relative isolate flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm ring-1 ring-indigo-50"
                >
                  <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                  <div className="flex flex-col gap-4 px-8 pb-10 pt-12">
                    <time className="text-xs font-semibold uppercase tracking-wide text-indigo-500" dateTime={post.date}>
                      {post.date}
                    </time>
                    <h3 className="text-xl font-semibold leading-7 text-gray-900">
                      <Link href={post.href}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">{post.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-40 max-w-7xl overflow-hidden px-6 pb-16 sm:mt-56 sm:pb-24 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-gray-100 pt-10 sm:flex-row">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} ScriptNest. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-semibold text-gray-600">
            <Link href="/pricing">Pricing</Link>
            <Link href="/real-estate-generator">Real Estate AI</Link>
            <Link href="/article-writer">Article Writer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

