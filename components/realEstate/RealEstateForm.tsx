import React, { Fragment, useActionState, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Input from "../Input";
import Select from "../Select";
import Checkbox from "../CheckBox";
import { genererateRealEstateDescription } from "@/lib/actions/realEstate";
import { languages } from "@/utils/languages";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid";

type Plan = { planType: string; currentPeriodEnd: Date | null; status: string };

type RealEstateUsageSummary = {
  limit: number | null;
  remaining: number | null;
  used: number | null;
};

type GeneratedResultPayload = {
  text: string;
  imageUrl?: string | null;
};

interface RealEstateFormProps {
  userPlan: Plan;
  usageSummary?: RealEstateUsageSummary;
  isAuthenticated: boolean;
  onOpen?: () => void;
  onResult: (payload: GeneratedResultPayload) => void;
  onLoadingChange?: (value: boolean) => void;
  regenerateSignal?: number;
  onSubmitStart?: (signature: string) => void;
  onError?: (message: string) => void;
  onUsageUpdate?: (summary: RealEstateUsageSummary) => void;
}

const PROPERTY_TYPES = [
  "House",
  "Townhome",
  "Multi-family",
  "Condos/Co-ops",
  "Lot/Land",
  "Apartament",
  "Manufactured",
] as const;
const BEDROOMS = ["Studio", "1", "2", "3", "4", "5", "6+"] as const;
const BATHROOMS = ["1", "2", "3", "4", "5", "6+"] as const;
const AMENITIES = [
  "Pool",
  "Garage",
  "Garden",
  "Fireplace",
  "Basement",
  "Home Office",
  "Smart Home",
  "Rooftop Terrace",
] as const;

const languageOptions = languages.map((lang) => ({
  value: lang,
  label: lang,
}));

const toneOptions = [
  { value: "Professional & confident", label: "Professional & confident" },
  { value: "Warm & inviting", label: "Warm & inviting" },
  { value: "Luxury & aspirational", label: "Luxury & aspirational" },
  { value: "Concise & direct", label: "Concise & direct" },
  { value: "Playful social media", label: "Playful social media" },
  { value: "Investor-focused", label: "Investor-focused" },
];

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

const amenitiesValues = AMENITIES.map((a) => a.toLowerCase());

function createEmptyFormValues() {
  return {
    location: "",
    price: "",
    area: "",
    lot: "",
    year: "",
    description: "",
    name: "",
    email: "",
    phone: "",
    amenities: [] as string[],
  };
}

type ErrorNotification = {
  id: number;
  message: string;
  visible: boolean;
  actionLabel?: string;
  actionHref?: string;
};

const RealEstateForm = ({
  userPlan,
  usageSummary,
  isAuthenticated,
  onOpen,
  onResult,
  onLoadingChange,
  regenerateSignal,
  onSubmitStart,
  onError,
  onUsageUpdate,
}: RealEstateFormProps) => {
  const isFreePlan = userPlan.planType === "free";
  const remainingGenerations = usageSummary?.remaining ?? null;
  const hasLimitedGenerations = usageSummary?.limit !== null;
  const noGenerationsLeft = hasLimitedGenerations && (remainingGenerations ?? 0) <= 0;
  const shouldShowUpgradeCta = isFreePlan && hasLimitedGenerations && noGenerationsLeft;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const addressFromQuery = searchParams?.get("address")?.trim() ?? "";
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [bathrooms, setBathrooms] = useState<string | null>(null);
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");
  const [language, setLanguage] = useState<string>(languages[0]);
  const [tone, setTone] = useState<string>(toneOptions[0]?.value ?? "Professional & confident");

  const [formValues, setFormValues] = useState(createEmptyFormValues);
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);

  const [state, formAction, pending] = useActionState(genererateRealEstateDescription, {
    text: "",
    streetViewImage: null,
  });
  const autoDismissTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const removalTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const prevPendingRef = useRef(pending);
  const prefillAppliedRef = useRef(false);
  const autoSubmitRequestedRef = useRef(false);
  const hideNotification = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id && notification.visible ? { ...notification, visible: false } : notification
      )
    );

    const autoTimer = autoDismissTimers.current.get(id);
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoDismissTimers.current.delete(id);
    }
  }, []);

  const pushNotification = useCallback(
    (message: string, action?: { actionLabel?: string; actionHref?: string }) => {
      const id = Date.now() + Math.random();
      const closedIds: number[] = [];

      setNotifications((prev) => {
        const withNew = [...prev, { id, message, visible: true, ...action }];
        let visibleCount = withNew.reduce((count, notification) => (notification.visible ? count + 1 : count), 0);

        if (visibleCount <= 3) return withNew;

        return withNew.map((notification) => {
          if (visibleCount > 3 && notification.visible && notification.id !== id) {
            closedIds.push(notification.id);
            visibleCount -= 1;
            return { ...notification, visible: false };
          }
          return notification;
        });
      });

      autoDismissTimers.current.set(
        id,
        setTimeout(() => {
          hideNotification(id);
        }, 5000)
      );

      closedIds.forEach((notificationId) => {
        const autoTimer = autoDismissTimers.current.get(notificationId);
        if (autoTimer) {
          clearTimeout(autoTimer);
          autoDismissTimers.current.delete(notificationId);
        }
      });
    },
    [hideNotification]
  );

  useEffect(() => {
    const autoTimers = autoDismissTimers.current;
    const teardownTimers = removalTimers.current;

    return () => {
      autoTimers.forEach((timer) => clearTimeout(timer));
      teardownTimers.forEach((timer) => clearTimeout(timer));
      autoTimers.clear();
      teardownTimers.clear();
    };
  }, []);

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!notification.visible && !removalTimers.current.has(notification.id)) {
        const timeout = setTimeout(() => {
          removalTimers.current.delete(notification.id);
          autoDismissTimers.current.delete(notification.id);
          setNotifications((prev) => prev.filter((item) => item.id !== notification.id));
        }, 250);

        removalTimers.current.set(notification.id, timeout);
      }
    });
  }, [notifications]);

  useEffect(() => {
    onLoadingChange?.(pending);
  }, [pending, onLoadingChange]);

  const regenerateRef = useRef(regenerateSignal);

  useEffect(() => {
    if (!addressFromQuery || prefillAppliedRef.current) return;
    setFormValues((prev) => {
      if (prev.location.trim() === addressFromQuery) return prev;
      return { ...prev, location: addressFromQuery };
    });
    prefillAppliedRef.current = true;
  }, [addressFromQuery]);

  useEffect(() => {
    if (!addressFromQuery || autoSubmitRequestedRef.current) return;
    if (status === "loading") return;
    if (!formValues.location.trim()) return;

    const form = document.getElementById("real-estate-form") as HTMLFormElement | null;
    if (!form) return;

    autoSubmitRequestedRef.current = true;
    form.requestSubmit();
  }, [addressFromQuery, formValues.location, status]);

  useEffect(() => {
    if (regenerateSignal === undefined) return;
    if (regenerateRef.current === regenerateSignal) return;

    regenerateRef.current = regenerateSignal;
    if (!regenerateSignal) return;

    const form = document.getElementById("real-estate-form") as HTMLFormElement | null;
    if (form) {
      form.requestSubmit();
    }
  }, [regenerateSignal]);

  useEffect(() => {
    const wasPending = prevPendingRef.current;

    if (wasPending && !pending) {
      if (state.error) {
        const action = state.error.includes("Update your plan")
          ? { actionLabel: "Upgrade plan", actionHref: "/pricing" }
          : undefined;
        pushNotification(state.error, action);
        onError?.(state.error);
      } else {
        onLoadingChange?.(false);
      }
    }

    if (!pending && !state.error) {
      onLoadingChange?.(false);
    }

    prevPendingRef.current = pending;
  }, [pending, state.error, pushNotification, onError, onLoadingChange]);

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (value: string) => {
    setFormValues((prev) => {
      const exists = prev.amenities.includes(value);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((item) => item !== value) : [...prev.amenities, value],
      };
    });
  };

  const buildSignature = () => {
    const payload = {
      propertyType,
      bedrooms,
      bathrooms,
      listingType,
      language,
      tone,
      location: formValues.location,
      price: formValues.price,
      area: formValues.area,
      lot: formValues.lot,
      year: formValues.year,
      description: formValues.description,
      amenities: [...formValues.amenities].sort(),
    };
    return JSON.stringify(payload);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!isAuthenticated && status !== "authenticated") {
      event.preventDefault();
      const search = searchParams?.toString();
      const callbackUrl = `${pathname}${search ? `?${search}` : ""}`;
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    const locationFilled = formValues.location.trim().length > 0;

    if (!locationFilled) {
      event.preventDefault();
      pushNotification("Add a property address so we can capture the Street View photo.");
      return;
    }

    const priceProvided = formValues.price.trim().length > 0;
    if (priceProvided) {
      const priceValue = Number(formValues.price);
      if (!Number.isFinite(priceValue) || priceValue <= 0) {
        event.preventDefault();
        pushNotification("Price must be a positive number when provided.");
        return;
      }
    }

    const areaProvided = formValues.area.trim().length > 0;
    if (areaProvided) {
      const areaValue = Number(formValues.area);
      if (!Number.isFinite(areaValue) || areaValue <= 0) {
        event.preventDefault();
        pushNotification("Living area must be a positive number when provided.");
        return;
      }
    }

    const lotProvided = formValues.lot.trim().length > 0;
    if (lotProvided) {
      const lotValue = Number(formValues.lot);
      if (!Number.isFinite(lotValue) || lotValue <= 0) {
        event.preventDefault();
        pushNotification("Lot size must be a positive number when provided.");
        return;
      }
    }

    const yearProvided = formValues.year.trim().length > 0;
    if (yearProvided) {
      const yearValue = Number(formValues.year);
      if (!Number.isFinite(yearValue) || yearValue <= 0) {
        event.preventDefault();
        pushNotification("Year built must be a valid number when provided.");
        return;
      }
    }

    onSubmitStart?.(buildSignature());

    onOpen?.();
    onLoadingChange?.(true);
  };

  useEffect(() => {
    if (state.text) {
      onResult?.({ text: state.text, imageUrl: state.streetViewImage ?? null });
    }
  }, [state.text, state.streetViewImage, onResult]);

  useEffect(() => {
    if (!state.usage) return;

    onUsageUpdate?.({
      limit: state.usage.limit ?? null,
      remaining: state.usage.remaining ?? null,
      used: state.usage.used ?? null,
    });
  }, [state.usage, onUsageUpdate]);

  return (
    <>
      {notifications.length > 0 ? (
        <div className="fixed inset-x-0 top-20 z-50 flex justify-center px-4 sm:px-6">
          <div className="flex w-full max-w-2xl flex-col space-y-3">
            {notifications.map((notification) => (
              <Transition
                as={Fragment}
                key={notification.id}
                show={notification.visible}
                enter="transform transition duration-200 ease-out"
                enterFrom="opacity-0 -translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transform transition duration-200 ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-3"
              >
                <div className="rounded-2xl border-l-4 border-red-500 bg-red-50 p-4 shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon aria-hidden="true" className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="text-sm text-red-700">
                        <p>{notification.message || "An unexpected error occurred. Please try again."}</p>
                        {notification.actionLabel && notification.actionHref ? (
                          <Link
                            href={notification.actionHref}
                            className="mt-2 inline-flex items-center font-semibold text-red-600 underline decoration-red-300 decoration-2 underline-offset-4 transition hover:text-red-700"
                          >
                            {notification.actionLabel}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => hideNotification(notification.id)}
                      className="rounded-full p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                      aria-label="Dismiss"
                    >
                      <span className="sr-only">Dismiss notification</span>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </div>
              </Transition>
            ))}
          </div>
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-xl border border-neutral-100 bg-gradient-to-b from-white via-neutral-50 to-white shadow-[0_45px_120px_-80px_rgba(15,23,42,0.4)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-12 hidden h-80 w-80 rounded-full bg-neutral-100/50 blur-3xl sm:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-6 hidden h-72 w-72 rounded-full bg-neutral-100/60 blur-3xl sm:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-64 rounded-[32px] bg-gradient-to-r from-neutral-100/0 via-neutral-100/60 to-neutral-100/0 blur-2xl sm:block"
        />

        <div className="relative flex flex-col gap-4 px-0 pb-5 pt-4 sm:px-4 sm:pb-6">
          <header className="rounded-xl border border-neutral-100 bg-white/85 p-4 shadow-[0_20px_55px_-55px_rgba(15,23,42,0.8)] backdrop-blur sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="mt-1.5 text-2xl font-semibold  sm:text-[26px]">Listing Description Generator</h2>
                <p className="mt-1 text-sm  leading-relaxed">
                  Enter an address, optionally add context, and ship a modern MLS-ready draft in seconds.
                </p>
              </div>
              <div className="flex flex-col items-start rounded-2xl border border-neutral-100 bg-white/90 px-4 py-3 text-left shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] sm:w-auto sm:min-w-[220px]">
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] ">Generations left</span>
                <span className="mt-2 text-3xl font-semibold ">
                  {usageSummary?.limit === null ? "∞" : Math.max(usageSummary?.remaining ?? 0, 0)}
                </span>
                {usageSummary?.limit !== null ? (
                  <span className="text-xs ">{`${usageSummary?.limit ?? 0} per cycle`}</span>
                ) : (
                  <span className="text-xs ">Unlimited runs</span>
                )}
                {shouldShowUpgradeCta ? (
                  <Link
                    href="/pricing"
                    className="mt-3 inline-flex items-center justify-center rounded-lg border border-neutral-900 bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-neutral-900/20 transition hover:bg-neutral-800"
                  >
                    Unlock Pro
                  </Link>
                ) : null}
              </div>
            </div>
          </header>

          <div className="">
            <form id="real-estate-form" className="space-y-4 " action={formAction} onSubmit={handleSubmit} noValidate>
              <section className="space-y-4">
                <div className="rounded-lg border border-neutral-100 bg-white/90 p-4 shadow-[0_25px_65px_-60px_rgba(15,23,42,0.45)] sm:p-5">
                  <div className="flex items-start justify-between">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] ">Street View capture</p>
                    <span className="text-xs font-medium ">Required</span>
                  </div>
                  {/* <p className="mt-2 text-sm ">Add the full address and we handle the Street View photo automatically.</p> */}

                  <div className=" grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-12">
                    <div className="space-y-2 lg:col-span-6">
                      <h3 className="text-lg font-semibold ">Property address</h3>
                      <Input
                        // label="Full address"
                        name="location"
                        type="text"
                        placeholder="123 Main St, Miami, FL"
                        required
                        className="h-10 rounded-lg border-neutral-200 focus:border-neutral-900 focus:ring-neutral-200"
                        value={formValues.location}
                        onChange={handleFieldChange}
                      />
                    </div>
                    <div className="space-y-2 lg:col-span-3">
                      <h3 className="text-lg font-semibold ">Listing type</h3>
                      <input type="hidden" name="listingType" value={listingType} />
                      <div className="flex w-full gap-3">
                        {[
                          { key: "sale", label: "Sale" },
                          { key: "rent", label: "Rent" },
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setListingType(opt.key as "sale" | "rent")}
                            className={cx(
                              "inline-flex flex-1 items-center justify-center rounded-lg px-3.5 py-1.5 text-sm font-bold transition",
                              listingType === opt.key
                                ? "border border-transparent bg-neutral-900 text-white shadow-[0_30px_70px_-40px_rgba(15,23,42,0.9)] hover:bg-neutral-800"
                                : "border border-neutral-200/80 bg-white/80 text-neutral-900 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] hover:border-neutral-300 hover:bg-neutral-50"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 lg:col-span-3">
                      <h3 className="text-lg font-semibold ">Price (USD)</h3>
                      <Input
                        name="price"
                        type="number"
                        inputMode="numeric"
                        placeholder="ex. 975000"
                        className="h-10 w-full rounded-lg border-neutral-200 focus:border-neutral-900 focus:ring-neutral-200"
                        value={formValues.price}
                        onChange={handleFieldChange}
                        // hint="Purely for context — never printed."
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-100 bg-white/90 p-4 shadow-[0_25px_65px_-60px_rgba(15,23,42,0.45)] sm:p-5">
                  <div className="">
                    {/* <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] ">Optional context</p> */}
                    <h3 className="text-lg font-semibold ">Basic details</h3>
                    {/* <p className="text-sm ">Use only what you have handy — everything else stays blank.</p> */}
                  </div>

                  <div className=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Select
                      label="Property type (optional)"
                      name="propertyType"
                      value={propertyType}
                      onChange={setPropertyType}
                      options={PROPERTY_TYPES}
                      placeholder="Let AI detect"
                      variant="pill"
                    />
                    <Select
                      label="Bedrooms"
                      name="bedrooms"
                      value={bedrooms}
                      onChange={setBedrooms}
                      options={BEDROOMS}
                      placeholder="Select bedrooms…"
                      variant="pill"
                    />
                    <Select
                      label="Bathrooms"
                      name="bathrooms"
                      value={bathrooms}
                      onChange={setBathrooms}
                      options={BATHROOMS}
                      placeholder="Select bathrooms…"
                      variant="pill"
                    />
                    <div className="space-y-2">
                      <label htmlFor="year" className="block text-sm font-medium ">
                        Year built
                      </label>
                      <input
                        id="year"
                        name="year"
                        type="number"
                        min={1800}
                        max={2030}
                        placeholder="e.g., 2015"
                        value={formValues.year}
                        onChange={handleFieldChange}
                        className={cx(
                          "block h-10 w-full rounded-lg border border-neutral-200/80 bg-white/90 px-4  shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] transition",
                          "placeholder: hover:border-neutral-300 hover:bg-white",
                          "focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-200",
                          "no-spinner"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="area" className="block text-sm font-medium ">
                        Living area (sq ft)
                      </label>
                      <div className="relative">
                        <input
                          id="area"
                          name="area"
                          type="number"
                          min={0}
                          placeholder="e.g., 1800"
                          value={formValues.area}
                          onChange={handleFieldChange}
                          className={cx(
                            "block h-10 w-full rounded-lg border border-neutral-200/80 bg-white/90 px-4  shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] transition",
                            "placeholder: hover:border-neutral-300 hover:bg-white",
                            "focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-200",
                            "no-spinner"
                          )}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm ">
                          sq ft
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lot" className="block text-sm font-medium ">
                        Lot size (sq ft)
                      </label>
                      <div className="relative">
                        <input
                          id="lot"
                          name="lot"
                          type="number"
                          min={0}
                          placeholder="e.g., 7200"
                          value={formValues.lot}
                          onChange={handleFieldChange}
                          className={cx(
                            "block h-10 w-full rounded-lg border border-neutral-200/80 bg-white/90 px-4  shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] transition",
                            "placeholder: hover:border-neutral-300 hover:bg-white",
                            "focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-200",
                            "no-spinner"
                          )}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm ">
                          sq ft
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-neutral-100 bg-white/90 p-5 shadow-[0_35px_80px_-60px_rgba(15,23,42,0.45)] sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] ">Features & amenities</p>
                      <h3 className="text-lg font-semibold ">What should be mentioned?</h3>
                    </div>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] ">
                      {formValues.amenities.length} selected
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {amenitiesValues.map((amenity, index) => (
                      <Checkbox
                        key={amenity}
                        name="amenities"
                        value={amenity}
                        label={AMENITIES[index]}
                        checked={formValues.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-neutral-100 bg-white/90 p-5 shadow-[0_35px_80px_-60px_rgba(15,23,42,0.45)] sm:p-6">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] ">Agent notes</p>
                    <h3 className="text-lg font-semibold ">Anything else?</h3>
                    <p className="text-sm ">Drop tone cues, extras, or reminders for the final blurb.</p>
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    placeholder="Parking off a private alley, zoned for A+ schools, freshly painted exterior…"
                    value={formValues.description}
                    onChange={handleFieldChange}
                    className={cx(
                      "mt-4 block w-full rounded-lg border border-neutral-200/80 bg-white/90 px-4 py-3  shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] transition",
                      "placeholder: hover:border-neutral-300 hover:bg-white",
                      "focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-200"
                    )}
                  />
                </div>
              </section>
              <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                  <input type="hidden" name="language" value={language} />
                  <input type="hidden" name="tone" value={tone} />
                  <div className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] sm:w-auto sm:justify-start">
                    <span>Language:</span>
                    <Listbox value={language} onChange={setLanguage}>
                      <div className="relative w-full sm:w-auto">
                        <ListboxButton className="relative flex h-9 w-full cursor-default items-center justify-between rounded-lg border border-neutral-200/80 bg-white/90 px-3 text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(15,23,42,0.5)] transition hover:border-neutral-300 hover:bg-neutral-50 focus:border-neutral-900 focus:outline-none focus:ring-3 focus:ring-neutral-200 sm:w-44">
                          <span className="block truncate">
                            {languageOptions.find((opt) => opt.value === language)?.label ?? ""}
                          </span>
                          <span className="pointer-events-none">
                            <ChevronUpDownIcon aria-hidden="true" className="h-4 w-4" />
                          </span>
                        </ListboxButton>

                        <ListboxOptions
                          transition
                          className="absolute bottom-full z-20 mb-2 max-h-64 w-full origin-bottom overflow-auto rounded-lg border border-neutral-100 bg-white/95 py-1 text-sm shadow-xl ring-1 ring-black/5 backdrop-blur-sm focus:outline-none data-[closed]:data-[leave]:scale-95 data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:w-48"
                        >
                          {languageOptions.map((option) => (
                            <ListboxOption
                              key={option.value}
                              value={option.value}
                              className="group relative cursor-default select-none px-3 py-1.5  data-[focus]:bg-neutral-900 data-[focus]:text-white"
                              title={option.value}
                            >
                              <span className="block truncate font-medium group-data-[selected]:font-semibold">
                                {option.label}
                              </span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-1.5  group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                <CheckIcon aria-hidden="true" className="h-4 w-4" />
                              </span>
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </div>
                    </Listbox>
                  </div>

                  <div className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] sm:w-auto sm:justify-start">
                    <span>Tone:</span>
                    <Listbox value={tone} onChange={setTone}>
                      <div className="relative w-full sm:w-auto">
                        <ListboxButton className="relative flex h-9 w-full cursor-default items-center justify-between rounded-lg border border-neutral-200/80 bg-white/90 px-3 text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(15,23,42,0.5)] transition hover:border-neutral-300 hover:bg-neutral-50 focus:border-neutral-900 focus:outline-none focus:ring-3 focus:ring-neutral-200 sm:w-52">
                          <span className="block truncate">
                            {toneOptions.find((opt) => opt.value === tone)?.label ?? ""}
                          </span>
                          <span className="pointer-events-none">
                            <ChevronUpDownIcon aria-hidden="true" className="h-4 w-4" />
                          </span>
                        </ListboxButton>

                        <ListboxOptions
                          transition
                          className="absolute bottom-full z-20 mb-2 max-h-64 w-full origin-bottom overflow-auto rounded-lg border border-neutral-100 bg-white/95 py-1 text-sm shadow-xl ring-1 ring-black/5 backdrop-blur-sm focus:outline-none data-[closed]:data-[leave]:scale-95 data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:w-56"
                        >
                          {toneOptions.map((option) => (
                            <ListboxOption
                              key={option.value}
                              value={option.value}
                              className="group relative cursor-default select-none px-3 py-1.5  data-[focus]:bg-neutral-900 data-[focus]:text-white"
                              title={option.value}
                            >
                              <span className="block truncate font-medium group-data-[selected]:font-semibold">
                                {option.label}
                              </span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-1.5  group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                <CheckIcon aria-hidden="true" className="h-4 w-4" />
                              </span>
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </div>
                    </Listbox>
                  </div>

                  <button
                    type="reset"
                    className="inline-flex w-full items-center justify-center rounded-lg border border-neutral-200/80 bg-white/80 px-5 py-2 text-sm font-semibold shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] transition hover:border-neutral-300 hover:bg-neutral-50 sm:w-auto"
                    onClick={() => {
                      setPropertyType(null);
                      setBedrooms(null);
                      setBathrooms(null);
                      setListingType("sale");
                      setFormValues(createEmptyFormValues());
                      setLanguage(languages[0]);
                      setTone(toneOptions[0]?.value ?? "Professional & confident");
                    }}
                  >
                    Reset
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-900 px-8 py-3 text-sm font-semibold text-white shadow-[0_30px_70px_-40px_rgba(15,23,42,0.9)] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {pending ? "Generating..." : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RealEstateForm;
