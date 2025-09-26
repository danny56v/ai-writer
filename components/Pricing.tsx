"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Radio, RadioGroup, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
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
    answer: "Free plan has a 1,500 word limit, Pro plan allows up to 50,000 words, and Unlimited has no restrictions.",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Pricing({ currentPriceId }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const [frequency, setFrequency] = useState<Frequency>(pricing.frequencies[0]);
  const [activePriceId] = useState<string | null>(currentPriceId);
  const [loading, setLoading] = useState(false);

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
    <div className="bg-white">
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pricing plans for teams of&nbsp;all&nbsp;sizes
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan that&apos;s packed with the best features for engaging your audience, creating
          customer loyalty, and driving sales.
        </p>

        <div className="mt-16 flex justify-center">
          <fieldset aria-label="Payment frequency">
            <RadioGroup
              value={frequency}
              onChange={setFrequency}
              className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
            >
              {pricing.frequencies.map((option) => (
                <Radio
                  key={option.value}
                  value={option}
                  className="cursor-pointer rounded-full px-2.5 py-1 text-gray-500 data-[checked]:bg-indigo-600 data-[checked]:text-white"
                >
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          </fieldset>
        </div>

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {pricing.tiers.map((tier) => {
    const tierPriceId = tier.priceId?.[frequency.value] ?? null;

            // Free = current dacă NU există priceId activ
            const isCurrentPlan =
              tier.name === "Free"
                ? !activePriceId
                : Boolean(
                    activePriceId &&
                      (tier.priceId?.monthly === activePriceId || tier.priceId?.annually === activePriceId)
                  );

            return (
              <div
                key={tier.id}
                className={classNames(
                  tier.mostPopular || isCurrentPlan ? "ring-2 ring-indigo-600" : "ring-1 ring-gray-200",
                  "rounded-3xl p-8"
                )}
              >
                <h2
                  id={tier.id}
                  className={classNames(
                    tier.mostPopular ? "text-indigo-600" : "text-gray-900",
                    "text-lg font-semibold leading-8"
                  )}
                >
                  {tier.name}
                </h2>

                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>

                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price[frequency.value]}</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">{frequency.priceSuffix}</span>
                </p>

                <button
                  disabled={isCurrentPlan || loading}
                  onClick={async () => {
                    if (isCurrentPlan) return;

                    if (tier.name === "Free") {
                      router.push("/sign-up");
                      return;
                    }
                    if (!tierPriceId) return;

                    // dacă are deja alt abonament (oricare din cele 2 priceId ale tierului curent ≠ active)
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
                    tier.mostPopular
                      ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                      : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
                    "mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors cursor-pointer",
                    isCurrentPlan || loading ? "opacity-50 cursor-not-allowed" : ""
                  )}
                >
                  {isCurrentPlan
                    ? "Current plan"
                    : tier.name === "Free"
                    ? "Get Started"
                    : loading
                    ? "Processing..."
                    : "Buy plan"}
                </button>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Logo cloud */}
        <div className="mx-auto mt-24 max-w-7xl px-6 sm:mt-32 lg:px-8">
          <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            <Image
              alt="Transistor"
              src="/transistor-horizontal-logo.svg"
              width={158}
              height={48}
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            />
            <Image
              alt="Microsoft"
              src="/microsoft.svg"
              width={158}
              height={48}
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            />
            <Image
              alt="Uber"
              src="/uber.svg"
              width={158}
              height={48}
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            />
            <Image
              alt="Stripe"
              src="/stripe-3.svg"
              width={158}
              height={48}
              className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
            />
            <Image
              alt="Statamic"
              src="/statamic.svg"
              width={158}
              height={48}
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
            />
          </div>
          <div className="mt-16 flex justify-center">
            <p className="relative rounded-full bg-gray-50 px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-inset ring-gray-900/5">
              <span className="hidden md:inline">Trusted by thousands of content creators worldwide.</span>
            </p>
          </div>
        </div>

        <Testimonials />

        {/* FAQ */}
        <div className="mx-auto my-24 max-w-7xl px-6 sm:my-56 lg:px-8">
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
      </div>
    </div>
  );
}
