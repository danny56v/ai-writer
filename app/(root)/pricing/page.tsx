"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Radio, RadioGroup, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Testimonials from "@/components/Testimonials";
import { useRouter } from "next/navigation";

type Frequency = { value: "monthly" | "annually"; label: string; priceSuffix: string };

const pricing = {
  frequencies: [
    { value: "monthly", label: "Monthly", priceSuffix: "/month" },
    { value: "annually", label: "Annually", priceSuffix: "/year" },
  ] as Frequency[],
  tiers: [
    {
      name: "Free",
      id: "tier-free",
      href: "/sign-up",
      price: { monthly: "$0", annually: "$0" },
      description: "The essentials to provide your best work for clients.",
      features: ["3 articles/month", "Up to 1,500 words", "Basic options"],
      mostPopular: false,
      priceId: null as null | Record<"monthly" | "annually", string>,
    },
    {
      name: "Pro",
      id: "tier-pro",
      href: "#",
      price: { monthly: "$4.99", annually: "$29.99" },
      description: "The essentials to provide your best work for clients.",
      features: ["No limit articles", "Up to 50,000 words", "Advanced options"],
      mostPopular: true,
      priceId: {
        monthly: "price_1RtQX7RsRyFq7mSBngUAWcHC",
        annually: "price_1RtQX7RsRyFq7mSBLWuC9ddx",
      },
    },
    {
      name: "Unlimited",
      id: "tier-unlimited",
      href: "#",
      price: { monthly: "$14.99", annually: "$89.99" },
      description: "A plan that scales with your rapidly growing business.",
      features: ["No limit articles", "No limit words", "Advanced options", "24-hour support response time"],
      mostPopular: false,
      priceId: {
        monthly: "price_1RtRzkRsRyFq7mSBXQBHBd5G",
        annually: "price_1RtS0RRsRyFq7mSB1Orea73q",
      },
    },
  ],
};

const faqs = [
  {
    question: "What's included in the Free plan?",
    answer:
      "The Free plan includes 3 articles per month, up to 1,500 words per article, and basic customization options.",
  },
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer: "Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.",
  },
  {
    question: "Is there a limit on article length?",
    answer:
      "Free plan has a 1,500 word limit, Pro plan allows up to 50,000 words, and Unlimited has no restrictions.",
  },
];

const valueProps = [
  "Unlimited brand libraries",
  "Real-time collaboration",
  "Enterprise-ready security",
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Pricing() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [frequency, setFrequency] = useState<Frequency>(pricing.frequencies[0]);
  const [activePriceId, setActivePriceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/subscription")
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => setActivePriceId(data?.priceId ?? null))
        .catch(() => setActivePriceId(null));
    }
  }, [status]);

  const handleCheckout = async (priceId: string) => {
    try {
      if (!priceId || typeof priceId !== "string") {
        throw new Error("Price ID is required for checkout");
      }

      if (!session?.user?.email) {
        router.push("/sign-in?callbackUrl=/pricing");
        return;
      }

      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json().catch(() => ({ error: "Unexpected response" }));
      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Failed to create checkout session");
      }
      if (!data?.url) {
        throw new Error("Checkout URL missing from server response");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative py-12 sm:py-16">
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(circle_at_top,_rgba(203,186,255,0.35),transparent_65%)] blur-3xl" />

      <section className="relative overflow-hidden rounded-[3.25rem] border border-white/70 bg-gradient-to-br from-[#ffffff]/95 via-[#f6f0ff]/95 to-[#fff1fb]/95 px-6 py-16 shadow-soft-xl backdrop-blur sm:px-10 lg:px-16">
        <div className="absolute -left-24 top-20 h-56 w-56 rounded-full bg-gradient-to-br from-[#c4b0ff]/45 via-[#ff92d7]/35 to-transparent blur-3xl" aria-hidden="true" />
        <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-gradient-to-br from-[#ffc87f]/45 via-[#ff80cc]/35 to-transparent blur-3xl" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.75),transparent_55%)]" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="glow-pill">Pricing</span>
          <h1 className="mt-6 text-pretty text-4xl font-semibold text-[color:var(--foreground)] sm:text-5xl">
            Choose the plan that keeps your storytelling brilliant
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Transparent tiers crafted for teams of all sizes. Switch between monthly and annual billing at any time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {valueProps.map((prop) => (
              <span
                key={prop}
                className="rounded-full border border-[#d9cfff] bg-white/90 px-3 py-1 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]"
              >
                {prop}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <fieldset aria-label="Payment frequency">
            <RadioGroup
              value={frequency}
              onChange={setFrequency}
              className="grid grid-cols-2 gap-1 rounded-full bg-white/70 p-1 text-xs font-semibold text-slate-500 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]"
            >
              {pricing.frequencies.map((option) => (
                <Radio
                  key={option.value}
                  value={option}
                  className="cursor-pointer rounded-full px-4 py-2 transition data-[checked]:bg-[color:var(--foreground)] data-[checked]:text-white data-[checked]:shadow-[0_18px_32px_-20px_rgba(21,1,74,0.7)]"
                >
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          </fieldset>
        </div>

        <div className="relative mt-14 grid gap-8 lg:grid-cols-3">
          {pricing.tiers.map((tier) => {
            const tierPriceId = tier.priceId?.[frequency.value as "monthly" | "annually"] ?? null;
            const isCurrentPlan = !!tierPriceId && tierPriceId === activePriceId;

            return (
              <div
                key={tier.id}
                className={classNames(
                  "relative flex h-full flex-col overflow-hidden rounded-[2.75rem] border border-white/70 bg-white/90 p-8 shadow-[inset_0_1px_12px_rgba(255,255,255,0.75)] transition",
                  tier.mostPopular
                    ? "ring-2 ring-[#c2afff] shadow-[0_30px_70px_-40px_rgba(34,7,94,0.25)]"
                    : "hover:-translate-y-1 hover:border-[#c2afff] hover:shadow-[0_30px_70px_-45px_rgba(34,7,94,0.2)]"
                )}
              >
                {tier.mostPopular && (
                  <span className="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] px-4 py-1 text-xs font-semibold text-white shadow-[0_24px_44px_-22px_rgba(110,71,255,0.85)]">
                    Most loved
                  </span>
                )}
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-[#c2afff]/40 via-[#ff92d7]/30 to-[#ffb347]/40" aria-hidden="true" />
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 id={tier.id} className="text-lg font-semibold text-slate-900">
                      {tier.name}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{tier.description}</p>
                  </div>

                  <div className="mt-2 flex items-baseline gap-x-2">
                    <span className="text-4xl font-semibold text-slate-900">
                      {tier.price[frequency.value as "monthly" | "annually"]}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">{frequency.priceSuffix}</span>
                  </div>

                  <button
                    disabled={isCurrentPlan || loading}
                    onClick={async () => {
                      if (isCurrentPlan) return;

                      if (tier.name === "Free") {
                        router.push("/sign-up");
                        return;
                      }

                      if (!tierPriceId) return;

                      if (activePriceId && activePriceId !== tierPriceId) {
                        const resp = await fetch("/api/billing/portal", { method: "POST" });
                        const data = await resp.json().catch(() => ({}));
                        if (data?.url) {
                          window.location.href = data.url;
                        } else {
                          alert("Could not open billing portal");
                        }
                      } else {
                        await handleCheckout(tierPriceId);
                      }
                    }}
                    aria-describedby={tier.id}
                    className={classNames(
                      "mt-6 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                      tier.mostPopular
                        ? "bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] text-white shadow-[0_24px_44px_-22px_rgba(110,71,255,0.85)] hover:opacity-95"
                        : "border border-[#d9cfff] bg-white/90 text-[#6b4dff] hover:border-[#c2afff] hover:text-[#6b4dff]",
                      (isCurrentPlan || loading) ? "cursor-not-allowed opacity-60" : ""
                    )}
                  >
                    {isCurrentPlan
                      ? "Current plan"
                      : tier.name === "Free"
                      ? "Get started"
                      : loading
                      ? "Processing..."
                      : "Choose plan"}
                  </button>

                  <ul role="list" className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckIcon aria-hidden="true" className="h-5 w-5 text-[#6b4dff]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative mt-20 rounded-[3.25rem] border border-white/70 bg-white/90 px-6 py-12 shadow-soft-xl backdrop-blur sm:px-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-5">
          <Image alt="Transistor" src="/transistor-horizontal-logo.svg" width={158} height={48} className="mx-auto h-10 w-auto opacity-80" />
          <Image alt="Microsoft" src="/microsoft.svg" width={158} height={48} className="mx-auto h-10 w-auto opacity-80" />
          <Image alt="Uber" src="/uber.svg" width={158} height={48} className="mx-auto h-10 w-auto opacity-80" />
          <Image alt="Stripe" src="/stripe-3.svg" width={158} height={48} className="mx-auto h-10 w-auto opacity-80" />
          <Image alt="Statamic" src="/statamic.svg" width={158} height={48} className="mx-auto h-10 w-auto opacity-80" />
        </div>
        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Trusted by design-forward teams around the world
        </p>
      </section>

      <Testimonials />

      <section className="relative mt-24 overflow-hidden rounded-[3.25rem] border border-white/70 bg-white/90 px-6 py-16 shadow-soft-xl backdrop-blur sm:px-10 lg:px-16">
        <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-gradient-to-br from-[#c4b0ff]/45 via-[#ff92d7]/35 to-transparent blur-3xl" aria-hidden="true" />
        <div className="absolute -right-24 bottom-10 h-60 w-60 rounded-full bg-gradient-to-br from-[#ffc87f]/45 via-[#ff80cc]/35 to-transparent blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-3 text-base text-slate-600">Everything you need to know about billing, licensing and support.</p>
          <dl className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <Disclosure key={faq.question} as="div" className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]">
                {({ open }) => (
                  <>
                    <dt>
                      <DisclosureButton className="flex w-full items-center justify-between text-left">
                        <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                        <span className="ml-4 flex h-7 w-7 items-center justify-center rounded-full border border-[#d9cfff] bg-white text-slate-500">
                          <PlusSmallIcon aria-hidden="true" className={classNames("h-4 w-4 transition", open ? "rotate-45" : "")} />
                        </span>
                      </DisclosureButton>
                    </dt>
                    <DisclosurePanel as="dd" className="mt-4 text-sm leading-6 text-slate-600">
                      {faq.answer}
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
