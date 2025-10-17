"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
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

interface LandingPageProps {
  currentPriceId: string | null;
}

const features = [
  {
    name: "AI descriptions that convert",
    description:
      "Turn basic property details into compelling, human-like listings that capture attention and drive more inquiries.",
    icon: SparklesIcon,
  },
  {
    name: "Faster workflows, fewer revisions",
    description:
      "Generate multiple listing drafts in seconds, refine tone or length instantly, and publish without writer’s block.",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    name: "Consistency across every listing",
    description:
      "Keep your brand voice, tone, and structure aligned across all your listings — even with multiple agents involved.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Track what performs best",
    description:
      "See which types of descriptions attract more views, clicks, and offers so you can double down on what works.",
    icon: ChartBarIcon,
  },
];

const faqs = [
  {
    question: "What do I need to generate my first property description?",
    answer:
      "Just enter the basics — property type, location, number of rooms, and key selling points. The AI turns your details into a complete, engaging description ready to post in seconds.",
  },
  {
    question: "How many listings can I create with the free plan?",
    answer:
      "You can generate one listing per month for free to test the process. When you’re ready to scale, paid plans unlock unlimited listings and advanced customization.",
  },
  {
    question: "Will the AI write in my style or tone?",
    answer:
      "Yes. You can select or customize tone presets — friendly, professional, luxury, or casual — so every listing sounds like it came from you, not a robot.",
  },
  {
    question: "Is the copy compliant with real estate advertising laws?",
    answer:
      "Absolutely. ListologyAi includes built-in checks for fair housing compliance and avoids biased or restricted phrasing. You stay creative while staying compliant.",
  },
  {
    question: "What happens after I finish a listing?",
    answer:
      "You can copy and paste it directly into your MLS, upload it to property sites, or save it for future use. AI analytics will show which style brings more engagement.",
  },
];

const testimonials = {
  quote: "Since using ListologyAi, my listings get more attention and my properties sell faster than ever.",
  name: "Laura Mitrea",
  role: "Top Agent, Dream Homes Realty",
};

function HeroMockup() {
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const glowVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videos = [mainVideoRef.current, glowVideoRef.current].filter((video): video is HTMLVideoElement =>
      Boolean(video)
    );

    const ensureAutoplay = (video: HTMLVideoElement) => {
      const playSilently = () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Safari might still block autoplay; retry on next interaction.
          });
        }
      };

      video.defaultMuted = true;
      video.muted = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");

      if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        playSilently();
        return () => {};
      }

      const handleCanPlay = () => {
        playSilently();
        video.removeEventListener("canplay", handleCanPlay);
      };

      video.addEventListener("canplay", handleCanPlay);
      return () => video.removeEventListener("canplay", handleCanPlay);
    };

    const cleanups = videos.map(ensureAutoplay);

    const handleUserInteraction = () => {
      videos.forEach((video) => {
        if (video.paused) {
          video.play().catch(() => {});
        }
      });
    };

    window.addEventListener("touchstart", handleUserInteraction, { once: true });
    window.addEventListener("click", handleUserInteraction, { once: true });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-[3rem]">
      <div className="relative aspect-[1804/826] w-full">
        <video
          ref={mainVideoRef}
          src="/ListologyAix1.5.mp4"
          className="absolute inset-0 z-10 h-full w-full object-cover"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          style={{
            WebkitMaskImage: "radial-gradient(circle at center, rgba(255,255,255,1) 90%, rgba(255,255,255,0) 100%)",
            maskImage: "radial-gradient(circle at center, rgba(255,255,255,1) 90%, rgba(255,255,255,0) 100%)",
          }}
        />
        <video
          ref={glowVideoRef}
          src="/ListologyAix1.5.mp4"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-125 blur-[95px] object-cover"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{
            WebkitMaskImage:
              "radial-gradient(130% 130% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 72%, rgba(0,0,0,1) 100%)",
            maskImage:
              "radial-gradient(130% 130% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 72%, rgba(0,0,0,1) 100%)",
          }}
        />
      </div>
    </div>
  );
}

export default function LandingPage({ currentPriceId }: LandingPageProps) {
  return (
    <div className="bg-white text-gray-900 mt-16">
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
                Sell properties faster with AI-powered descriptions
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Create persuasive real estate listings in seconds. Attract more buyers, stand out from competitors, and
                close deals faster.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/real-estate-generator"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Try the listing writer
                </Link>
                <Link href="/pricing" className="text-sm font-semibold leading-6 text-gray-900">
                  View pricing <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="mt-16 sm:mt-24">
              <div className="-m-2 rounded-[2.5rem] bg-gradient-to-b from-white to-indigo-50/40 p-2  lg:-m-4 lg:rounded-[3rem] lg:p-4">
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
        {/* <section className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mt-20 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            {partnerLogos.map((logo) => (
              <div key={logo.alt} className="flex items-center justify-center">
                <Image src={logo.src} alt={logo.alt} width={158} height={48} className="max-h-12" />
              </div>
            ))}
          </div>
          <div className="mt-20 flex justify-center">
            <div className="relative rounded-full bg-indigo-50 px-4 py-1.5 text-sm leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-100">
              <span className="hidden md:inline">See how agents turn AI copy into showings.</span>
              <Link href="/blog" className="ml-1 font-semibold">
                Read customer stories <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section> */}
        {/* Feature section */}
        <section id="features" className="mx-auto mt-32 max-w-7xl px-6 sm:mt-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Built for real estate pros</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Write listings that sell faster and effortlessly.
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              ListologyAi helps real estate agents and marketers create persuasive, on-brand property descriptions in
              seconds. Save hours of writing and focus on what really matters — closing deals.
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
        <section id="pricing" className=" sm:pt-32">
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
              <Pricing currentPriceId={currentPriceId} />
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
        {/* CTA */}
        <section className="relative mt-32 px-6 pb-32 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden blur-3xl"
          >
            <div className="h-[20rem] w-[50rem] bg-gradient-to-r from-indigo-100 via-white to-purple-100" />
          </div>
          <div className="mx-auto max-w-3xl rounded-3xl border border-indigo-100 bg-white p-10 text-center shadow-lg shadow-indigo-100/60">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to see ListologyAi inside your workflow?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-600">
              Create an account in minutes, invite your team, and generate a listing on us. Upgrade when you are ready
              to scale production.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/real-estate-generator"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Try the listing writer
              </Link>
              <Link href="/pricing" className="text-sm font-semibold leading-6 text-gray-900">
                View pricing <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
