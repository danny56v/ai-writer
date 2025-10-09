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

interface RealEstateFormProps {
  userPlan: Plan;
  usageSummary?: RealEstateUsageSummary;
  isAuthenticated: boolean;
  onOpen?: () => void;
  onResult: (t: string) => void;
  onLoadingChange?: (value: boolean) => void;
  regenerateSignal?: number;
  onSubmitStart?: (signature: string) => void;
  onError?: (message: string) => void;
}

const PROPERTY_TYPES = [
  "House",
  "Apartment",
  "Condominium",
  "Land",
  "Commercial",
  "Townhouse",
  "Vacant Land",
  "Multi-Family",
  "HDB",
  "Other",
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
}: RealEstateFormProps) => {
  const isFreePlan = userPlan.planType === "free";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [bathrooms, setBathrooms] = useState<string | null>(null);
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");
  const [language, setLanguage] = useState<string>(languages[0]);

  const [formValues, setFormValues] = useState(createEmptyFormValues);
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);

  const [state, formAction, pending] = useActionState(genererateRealEstateDescription, { text: "" });
  const autoDismissTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const removalTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const prevPendingRef = useRef(pending);

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

    if (!propertyType || !locationFilled || !formValues.price) {
      event.preventDefault();
      pushNotification("Please fill in property type, location, and price.");
      return;
    }

    const priceValue = Number(formValues.price);
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      event.preventDefault();
      pushNotification("Price must be a positive number.");
      return;
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

    onSubmitStart?.(buildSignature());

    onOpen?.();
    onLoadingChange?.(true);
  };

  useEffect(() => {
    if (state.text) {
      onResult?.(state.text);
    }
  }, [state.text, onResult]);

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

      <div className="relative overflow-hidden rounded-3xl border border-indigo-100/70 bg-gradient-to-br from-white via-indigo-50/60 to-white shadow-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-12 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 left-0 h-64 w-64 rounded-full bg-indigo-200/50 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 p-4 sm:p-6">
        <header className="flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-xl text-white shadow-lg">
                🏠
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Property brief</p>
                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">Listing Description Generator</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Fill in the property details, choose the right tone, and let ListologyAi build the ideal description.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-400">Generations left</span>
              <span className="mt-1 text-lg font-semibold text-indigo-600">
                {usageSummary?.limit === null
                  ? "Unlimited"
                  : Math.max(usageSummary?.remaining ?? 0, 0)}
              </span>
              {/* {usageSummary?.limit !== null ? (
                <span className="mt-1 inline-flex items-center rounded-full bg-indigo-100/70 px-3 py-1 text-[11px] font-semibold text-indigo-600">
                  {`${Math.max(usageSummary?.used ?? 0, 0)} used / ${usageSummary.limit ?? 0}`}
                </span>
              ) : (
                <span className="mt-1 inline-flex items-center rounded-full bg-indigo-100/70 px-3 py-1 text-[11px] font-semibold text-indigo-600">
                  {isFreePlan ? "Free plan" : "Premium plan"}
                </span>
              )}
              <span className="mt-1 text-[11px] font-medium uppercase tracking-wider text-indigo-300">
                Status: {pending ? "Processing" : "Ready"}
              </span> */}
            </div>
          </div>
        </header>

        <div className="rounded-2xl border border-indigo-50 bg-white/80 shadow-sm backdrop-blur-sm">
          <form
            id="real-estate-form"
            className="space-y-8 p-4 sm:p-6"
            action={formAction}
            onSubmit={handleSubmit}
            noValidate
          >
            <section className="space-y-6">
              <div className="rounded-2xl border border-indigo-50 bg-white/70 p-4 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Key details</h3>
                <p className="mt-1 text-xs text-gray-500">Start with the essentials that ground the description.</p>

                <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-3">
                  <Select
                    label="Property Type"
                    name="propertyType"
                    value={propertyType}
                    onChange={setPropertyType}
                    options={PROPERTY_TYPES}
                    placeholder="Select property type…"
                    required
                    hint=""
                  />

                  <Input
                    label="Location"
                    name="location"
                    type="text"
                    placeholder="ex. Victoria St, London, UK"
                    required
                    className="w-full"
                    value={formValues.location}
                    onChange={handleFieldChange}
                  />

                  <Input
                    label="Price (USD)"
                    name="price"
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    required
                    className="w-full"
                    value={formValues.price}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-50 bg-white/70 p-4 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Layout & dimensions</h3>
                <p className="mt-1 text-xs text-gray-500">Provide the room configuration and property size.</p>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Select
                      label="Bedrooms"
                      name="bedrooms"
                      value={bedrooms}
                      onChange={setBedrooms}
                      options={BEDROOMS}
                      placeholder="Select bedrooms…"
                    />
                  </div>

                  <div className="space-y-2">
                    <Select
                      label="Bathrooms"
                      name="bathrooms"
                      value={bathrooms}
                      onChange={setBathrooms}
                      options={BATHROOMS}
                      placeholder="Select bathrooms…"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="block text-sm font-medium text-gray-800">Listing type</span>
                    <input type="hidden" name="listingType" value={listingType} />
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: "sale", label: "Sale" },
                        { key: "rent", label: "Rent" },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setListingType(opt.key as "sale" | "rent")}
                          className={cx(
                            "rounded-xl border px-4 py-2 text-sm font-semibold transition",
                            listingType === opt.key
                              ? "border-indigo-500 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md"
                              : "border-gray-200 bg-white/70 text-gray-700 shadow-sm hover:border-indigo-300 hover:bg-indigo-50/70"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="area" className="block text-sm font-medium text-gray-800">
                      Living area (m²)
                    </label>
                    <div className="relative">
                      <input
                        id="area"
                        name="area"
                        type="number"
                        min={0}
                        placeholder="e.g., 75"
                        value={formValues.area}
                        onChange={handleFieldChange}
                        className={cx(
                          "block h-11 w-full rounded-2xl border border-gray-200 bg-white/90 px-4 text-gray-900 shadow-sm transition",
                          "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                          "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        )}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">
                        m²
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lot" className="block text-sm font-medium text-gray-800">
                      Lot size (m²)
                    </label>
                    <div className="relative">
                      <input
                        id="lot"
                        name="lot"
                        type="number"
                        min={0}
                        placeholder="e.g., 300"
                        value={formValues.lot}
                        onChange={handleFieldChange}
                        className={cx(
                          "block h-11 w-full rounded-2xl border border-gray-200 bg-white/90 px-4 text-gray-900 shadow-sm transition",
                          "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                          "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        )}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">
                        m²
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-800">
                      Year built
                    </label>
                    <input
                      id="year"
                      name="year"
                      type="number"
                      min={1800}
                      max={2025}
                      placeholder="e.g., 2015"
                      value={formValues.year}
                      onChange={handleFieldChange}
                      className={cx(
                        "block h-11 w-full rounded-2xl border border-gray-200 bg-white/90 px-4 text-gray-900 shadow-sm transition",
                        "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                        "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-50 bg-white/70 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
                      Features & amenities
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Select the highlights you want to emphasize in the description.
                    </p>
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-indigo-400">
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

              <div className="rounded-2xl border border-indigo-50 bg-white/70 p-4 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Description & context</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Add special notes, your preferred tone, or narrative details to personalize the result.
                </p>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Add relevant details about the property…"
                  value={formValues.description}
                  onChange={handleFieldChange}
                  className={cx(
                    "mt-4 block w-full rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-gray-900 shadow-sm transition",
                    "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                    "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  )}
                />
              </div>
            </section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <input type="hidden" name="language" value={language} />
                <div className="flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm">
                  <span>Language:</span>
                  <Listbox value={language} onChange={setLanguage}>
                    <div className="relative">
                      <ListboxButton className="relative flex h-9 w-40 cursor-default items-center justify-between rounded-xl border border-indigo-200 bg-white/80 px-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-100">
                        <span className="block truncate">
                          {languageOptions.find((opt) => opt.value === language)?.label ?? ""}
                        </span>
                        <span className="pointer-events-none">
                          <ChevronUpDownIcon aria-hidden="true" className="h-4 w-4" />
                        </span>
                      </ListboxButton>

                      <ListboxOptions
                        transition
                        className="absolute bottom-full z-20 mb-2 max-h-64 w-48 origin-bottom overflow-auto rounded-xl border border-indigo-100 bg-white/95 py-1 text-sm shadow-xl ring-1 ring-black/5 backdrop-blur-sm focus:outline-none data-[closed]:data-[leave]:scale-95 data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
                      >
                        {languageOptions.map((option) => (
                          <ListboxOption
                            key={option.value}
                            value={option.value}
                            className="group relative cursor-default select-none px-3 py-1.5 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                            title={option.value}
                          >
                            <span className="block truncate font-medium group-data-[selected]:font-semibold">
                              {option.label}
                            </span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-1.5 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
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
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    setPropertyType(null);
                    setBedrooms(null);
                    setBathrooms(null);
                    setListingType("sale");
                    setFormValues(createEmptyFormValues());
                    setLanguage(languages[0]);
                  }}
                >
                  Reset
                </button>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:via-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Generating..." : "Preview / Publish"}
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
