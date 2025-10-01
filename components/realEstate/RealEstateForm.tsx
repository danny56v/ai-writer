import React, { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Input from "../Input";
import Select from "../Select";
import Checkbox from "../CheckBox";
import { genererateRealEstateDescription } from "@/lib/actions/realEstate";
import { languages } from "@/utils/languages";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";


type Plan = { planType: string; currentPeriodEnd: Date | null; status: string };
interface RealEstateFormProps {
  userPlan: Plan;
  isAuthenticated: boolean;
  onOpen: () => void;
  onResult: (t: string) => void;
  onLoadingChange?: (value: boolean) => void;
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
const AMENITIES = ["Pool", "Garage", "Garden", "Fireplace", "Basement"] as const;

function abbreviateLanguage(name: string) {
  const cleaned = name.replace(/[()]/g, " ");
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name.slice(0, 3).toUpperCase();
  const letters = parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  if (letters.length >= 2 && letters.length <= 4) {
    return letters;
  }
  const firstPart = parts[0];
  if (firstPart.length >= 2) {
    return firstPart.slice(0, 2).toUpperCase();
  }
  return firstPart.toUpperCase();
}

const languageOptions = languages.map((lang) => ({
  value: lang,
  label: abbreviateLanguage(lang),
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

const RealEstateForm = ({ userPlan, isAuthenticated, onOpen, onResult, onLoadingChange }: RealEstateFormProps) => {
  const router = useRouter();
  const { status } = useSession();
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [bathrooms, setBathrooms] = useState<string | null>(null);
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");
  const [language, setLanguage] = useState<string>(languages[0]);

  const [formValues, setFormValues] = useState(createEmptyFormValues);

  const [state, formAction, pending] = useActionState(genererateRealEstateDescription, { text: "" });

  useEffect(() => {
    onLoadingChange?.(pending);
  }, [pending, onLoadingChange]);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!isAuthenticated && status !== "authenticated") {
      event.preventDefault();
      router.push("/sign-in?callbackUrl=/real-estate-generator");
      return;
    }

    onOpen();
    onLoadingChange?.(true);
  };



    useEffect(() => {
    if (state.text) {
      onResult?.(state.text);
    }
  }, [state.text, onResult]);


  return (
    <>
      <div className="">
        <div className="mx-auto max-w-screen-xl ">
          {/* <div className="rounded-3xl border border-gray-200 bg-white/80 shadow-lg backdrop-blur-md"> */}
          {/* Header */}
          <div className="">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
              🏠 Real Estate
            </div>
            <h2 className="mt-3 text-lg sm:text-xl font-semibold tracking-tight">Listing Description Generator</h2>
            <p className="mt-1 text-sm text-gray-500">Beautiful, consistent UI in Safari / Chrome / Firefox.</p>
          </div>

          {/* Form */}
          <form className="px-4 sm:px-6 py-4" action={formAction} onSubmit={handleSubmit}>
            {/* Layout: single column on mobile, expands to three columns on medium screens */}
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5 lg:grid-cols-3">
              {/* Section containing three inputs; stacks on mobile, spreads across columns at md+ */}
              <div className="col-span-1 md:col-span-3 grid grid-cols-1 gap-2.5 md:grid-cols-3 min-w-0">
                <Select
                  label="Property Type"
                  name="propertyType"
                  value={propertyType}
                  onChange={setPropertyType}
                  options={PROPERTY_TYPES}
                  placeholder="Select property type…"
                  required
                  hint=""
                  // className="w-full"
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
                  hint="In USD"
                  className="w-full"
                  value={formValues.price}
                  onChange={handleFieldChange}
                />
              </div>

              {/* Listing type – segmented buttons with wrapping on small screens */}
              <div className="md:col-span-2 min-w-0">
                <span className="mb-1 block text-sm font-medium text-gray-800">Listing type</span>
                <input type="hidden" name="listingType" value={listingType} />
                <div className="flex flex-row flex-wrap gap-2.5">
                  {[
                    { key: "sale", label: "Sale" },
                    { key: "rent", label: "Rent" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setListingType(opt.key as "sale" | "rent")}
                      className={cx(
                        "rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition",
                        listingType === opt.key
                          ? "border-indigo-500 bg-indigo-600 text-white hover:bg-indigo-500"
                          : "border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms / Bathrooms: 1 col pe mobil, 2 la sm+ */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 gap-2 sm:grid-cols-2 min-w-0">
                <Select
                  label="Bedrooms"
                  name="bedrooms"
                  value={bedrooms}
                  onChange={setBedrooms}
                  options={BEDROOMS}
                  placeholder="Select bedrooms…"
                  // className="w-full"
                />
                <Select
                  label="Bathrooms"
                  name="bathrooms"
                  value={bathrooms}
                  onChange={setBathrooms}
                  options={BATHROOMS}
                  placeholder="Select bathrooms…"
                  // className="w-full"
                />
              </div>

              {/* Living area */}
              <div className="min-w-0">
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
                      "block w-full h-11 rounded-2xl border border-gray-200 bg-white/90 px-3 text-gray-900 shadow-sm transition",
                      "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                      "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    )}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                    m²
                  </span>
                </div>
              </div>

              {/* Lot size */}
              <div className="min-w-0">
                <label htmlFor="lot" className="mb-1 block text-sm font-medium text-gray-800">
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
                      "block w-full h-11 rounded-2xl border border-gray-200 bg-white/90 px-3 text-gray-900 shadow-sm transition",
                      "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                      "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    )}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                    m²
                  </span>
                </div>
              </div>

              {/* Year built */}
              <div className="min-w-0">
                <label htmlFor="year" className="mb-1 block text-sm font-medium text-gray-800">
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
                      "block w-full h-11 rounded-2xl border border-gray-200 bg-white/90 px-3 text-gray-900 shadow-sm transition",
                      "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                      "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    )}
                  />
              </div>
            </div>

            {/* Features */}
            <div className="mt-6">
              <span className="mb-2 block text-sm font-medium text-gray-800">Features</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
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

            {/* Description */}
            <div className="mt-6">
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-800">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Add relevant details about the property…"
                value={formValues.description}
                onChange={handleFieldChange}
                className={cx(
                  "block w-full rounded-2xl border border-gray-200 bg-white/90 px-3 py-2 text-gray-900 shadow-sm transition",
                  "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                  "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                )}
              />
            </div>

            {/* Contact */}
            {/* <fieldset className="mt-8 rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur">
              <legend className="px-2 text-sm font-medium text-gray-800">Contact details</legend>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-800">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Full name"
                    value={formValues.name}
                    onChange={handleFieldChange}
                    className={cx(
                      "block w-full h-11 rounded-2xl border border-white/40 bg-white/70 px-3 text-gray-900 shadow-sm transition",
                      "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                      "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    )}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-800">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g., name@email.com"
                    value={formValues.email}
                    onChange={handleFieldChange}
                    className={cx(
                      "block w-full h-11 rounded-2xl border border-white/40 bg-white/70 px-3 text-gray-900 shadow-sm transition",
                      "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                      "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    )}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-800">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+373 60 000 000"
                    value={formValues.phone}
                    onChange={handleFieldChange}
                    className={cx(
                      "block w-full h-11 rounded-2xl border border-white/40 bg-white/70 px-3 text-gray-900 shadow-sm transition",
                      "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                      "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    )}
                  />
                </div>
              </div>
            </fieldset> */}

            {/* Actions */}
            {state.error ? (
              <p className="mt-6 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <div className="flex items-center gap-2">
                <input type="hidden" name="language" value={language} />
                <Listbox value={language} onChange={setLanguage}>
                  <div className="relative">
                    <ListboxButton className="relative h-10 w-24 cursor-default rounded-xl border border-gray-200 bg-white/90 pl-3 pr-8 text-left text-gray-900 shadow-sm transition hover:border-indigo-300 hover:bg-white focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-100">
                      <span className="block truncate text-sm font-medium">
                        {languageOptions.find((opt) => opt.value === language)?.label ?? ""}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                        <ChevronUpDownIcon aria-hidden="true" className="h-4 w-4 text-gray-400" />
                      </span>
                    </ListboxButton>

                    <ListboxOptions
                      transition
                      className="absolute bottom-full z-20 mb-2 max-h-56 w-28 origin-bottom overflow-auto rounded-xl border border-gray-100 bg-white/95 py-1 text-sm shadow-xl ring-1 ring-black/5 backdrop-blur-sm focus:outline-none data-[closed]:data-[leave]:scale-95 data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
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
                          <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
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
                className="w-full sm:w-auto rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
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
              <button type="submit" disabled={pending}

                className="rounded-2xl bg-indigo-600 px-5 py-2.5 text-white disabled:opacity-60">
          {pending ? "Generating..." : "Preview / Publish"}
        </button>
            </div>
          </form>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default RealEstateForm;
