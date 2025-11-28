"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import Testimonials from "@/components/Testimonials";

type Frequency = { value: "monthly" | "annually"; label: string; priceSuffix: string };

type Props = {
  currentPriceId: string | null; // stripe priceId curent al userului, calculat pe server
};

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
      description: "Try ListologyAi with one free listing description — no credit card required.",
      features: [
        "1 free listing generation (one-time)",
        "Address → Street View → AI description",
        "No credit card required to get started",
      ],
      mostPopular: false,
      priceId: null as null | Record<"monthly" | "annually", string>,
    },
    {
      name: "Pro",
      id: "tier-pro",
      href: "#",
      price: { monthly: "$9.99", annually: "$89.99" },
      description:
        "Ideal for active agents who list a few properties every month and want fast, polished descriptions.",
      features: [
        "Up to 50 listing generations / month",
        "Full access to Street View–powered descriptions",
        "Tone and length controls for MLS, portals, and social media",
      ],
      mostPopular: true,
      priceId: {
        monthly: "price_1SYX2kRzvydSZxMcuXspBfHN",
        annually: "price_1SYX1rRzvydSZxMcbquPvxew",
      },
    },
    {
      name: "Unlimited",
      id: "tier-unlimited",
      href: "#",
      price: { monthly: "$19.99", annually: "$179.99" },
      description: "Best for high-volume agents and small teams handling many listings every month.",
      features: [
        "Unlimited listing generations for your account",
        "Street View–enhanced descriptions for every property",
        "24-hour email support response time",
      ],
      mostPopular: false,
      priceId: {
        monthly: "price_1SYX0JRzvydSZxMcC2PmPzRa",
        annually: "price_1SYX0JRzvydSZxMcgIhJhhFo",
      },
    },
  ],
};

const pricingHighlights = [
  "First description free — no card needed",
  "Secure Stripe-powered billing",
  "Switch or cancel your plan anytime",
];

// const faqs = [
//   {
//     question: "What's included in the Free plan?",
//     answer:
//       "The Free plan includes 3 articles per month, up to 1,500 words per article, and basic customization options.",
//   },
//   {
//     question: "Can I upgrade or downgrade my plan anytime?",
//     answer: "Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.",
//   },
//   {
//     question: "Do you offer refunds?",
//     answer: "We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.",
//   },
//   {
//     question: "Is there a limit on article length?",
//     answer: "Free plan has a 1,500 word limit, Pro plan allows up to 50,000 words, and Unlimited has no restrictions.",
//   },
// ];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Pricing({ currentPriceId }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const [frequency, setFrequency] = useState<Frequency>(pricing.frequencies[1]);
  const [activePriceId] = useState<string | null>(currentPriceId);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = Boolean(session?.user);

  const freeCallbackUrl = "/pricing";

  const handleCheckout = async (priceId: string) => {
    try {
      if (!priceId) throw new Error("Price ID is required for checkout");
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
      if (!res.ok) throw new Error(typeof data?.error === "string" ? data.error : "Failed to create checkout session");
      if (!data?.url) throw new Error("Checkout URL missing from server response");

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate px-6 py-16 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] ">
            Pricing
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight   sm:text-5xl">
            Make AI listing copy part of every property you sell.
          </h1>
          <p className="mt-4 text-lg leading-8 ">
            Start with one free description on us. When you’re ready to list more properties, choose a simple plan based
            on your volume — no long contracts, just address → Street View → AI listing copy in seconds.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm ">
          {pricingHighlights.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-1.5"
            >
              <span className="h-2 w-2 rounded-full bg-black" />
              {item}
            </span>
          ))}
        </div>
        {/* 
        <div className="mt-12 flex flex-col items-center gap-6 lg:flex-row lg:justify-center">
          <fieldset aria-label="Payment frequency" className="rounded-xl border border-neutral-200 bg-white/80 p-2 shadow-sm">
            <RadioGroup value={frequency} onChange={setFrequency} className="grid grid-cols-2 gap-1">
              {pricing.frequencies.map((option) => (
                <Radio
                  key={option.value}
                  value={option}
                  className="cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-neutral-600 transition data-[checked]:bg-neutral-900 data-[checked]:text-white"
                >
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          </fieldset>
          <p className="text-sm text-neutral-500">Secure checkout via Stripe. Taxes calculated at payment.</p>
        </div> */}
        <div className="mt-12 flex flex-col items-center gap-6 lg:flex-row lg:justify-center">
          <fieldset
            aria-label="Payment frequency"
            className="relative rounded-2xl border border-neutral-200 bg-white/60 backdrop-blur p-2 shadow-lg"
          >
            <RadioGroup value={frequency} onChange={setFrequency} className="relative grid grid-cols-2">
              {/* Background highlight that slides */}
              <span
                className={`
          absolute inset-0 z-0 grid grid-cols-2 transition-transform duration-300 ease-out
          ${frequency.value === "monthly" ? "translate-x-0" : "translate-x-1/2"}
        `}
              >
                <span className="rounded-xl bg-neutral-900"></span>
              </span>

              {pricing.frequencies.map((option) => (
                <Radio
                  key={option.value}
                  value={option}
                  className={({ checked }) =>
                    classNames(
                      "relative z-10 cursor-pointer px-6 py-2 text-sm font-semibold transition-colors duration-300",
                      checked ? "text-white" : "text-black"
                    )
                  }
                >
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          </fieldset>

          <p className="text-sm ">Secure checkout via Stripe. Taxes calculated at payment.</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricing.tiers.map((tier) => {
            const tierPriceId = tier.priceId?.[frequency.value] ?? null;

            const isCurrentPlan = isAuthenticated
              ? tier.name === "Free"
                ? !activePriceId
                : Boolean(
                    activePriceId &&
                      (tier.priceId?.monthly === activePriceId || tier.priceId?.annually === activePriceId)
                  )
              : false;
            const isHighlighted = tier.mostPopular;
            const mutedText = isHighlighted ? "text-neutral-300" : "";

            return (
              <div
                key={tier.id}
                className={classNames(
                  "flex flex-col rounded-xl border p-8 shadow-lg transition",
                  isHighlighted
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-[0_45px_120px_rgba(15,23,42,0.45)]"
                    : "border-neutral-200 bg-white/90  shadow-[0_35px_90px_rgba(15,23,42,0.08)]"
                )}
              >
                <div className="flex items-center justify-between">
                  <h2 id={tier.id} className="text-2xl font-semibold leading-7">
                    {tier.name}
                  </h2>
                  {tier.mostPopular ? (
                    <span className="rounded-xl bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      Most popular
                    </span>
                  ) : (
                    <span className={classNames("text-xs font-semibold uppercase tracking-[0.3em]", mutedText)}>
                      Plan
                    </span>
                  )}
                </div>
                <p className={classNames("mt-4 text-sm leading-6", mutedText)}>{tier.description}</p>

                <p className="mt-8 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{tier.price[frequency.value]}</span>
                  <span className={classNames("text-sm font-semibold", mutedText)}>{frequency.priceSuffix}</span>
                </p>

                <button
                  disabled={isCurrentPlan || loading}
                  onClick={async () => {
                    if (isCurrentPlan) return;

                    if (tier.name === "Free") {
                      if (!isAuthenticated) {
                        router.push(`/sign-up?callbackUrl=${encodeURIComponent(freeCallbackUrl)}`);
                        return;
                      }

                      try {
                        setLoading(true);
                        const resp = await fetch("/api/billing/portal", { method: "POST" });
                        const data = await resp.json().catch(() => ({}));
                        if (data?.url) {
                          window.location.href = data.url;
                        } else {
                          alert("Could not open billing portal");
                        }
                      } finally {
                        setLoading(false);
                      }
                      return;
                    }
                    if (!tierPriceId) return;

                    const switchingToDifferentPrice =
                      activePriceId &&
                      activePriceId !== tierPriceId &&
                      !(tier.priceId?.monthly === activePriceId || tier.priceId?.annually === activePriceId);

                    if (switchingToDifferentPrice) {
                      const resp = await fetch("/api/billing/portal", { method: "POST" });
                      const data = await resp.json().catch(() => ({}));
                      if (data?.url) window.location.href = data.url;
                      else alert("Could not open billing portal");
                    } else {
                      await handleCheckout(tierPriceId);
                    }
                  }}
                  className={classNames(
                    "mt-8 block w-full rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2",
                    isHighlighted
                      ? "bg-white text-black  hover:bg-neutral-100 focus-visible:outline-white"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:outline-neutral-900",
                    isCurrentPlan || loading ? "cursor-not-allowed opacity-90" : ""
                  )}
                >
                  {isCurrentPlan
                    ? "Current plan"
                    : tier.name === "Free"
                    ? isAuthenticated
                      ? "Switch to Free"
                      : "Start Free"
                    : loading
                    ? "Processing..."
                    : "Buy plan"}
                </button>

                <ul role="list" className={classNames("mt-8 space-y-3 text-sm leading-6", mutedText)}>
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <CheckIcon
                        aria-hidden="true"
                        className={classNames("h-5 w-5 flex-none", isHighlighted ? "text-white" : " ")}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-20">
          <Testimonials />
        </div>
      </div>
    </section>
  );
}
