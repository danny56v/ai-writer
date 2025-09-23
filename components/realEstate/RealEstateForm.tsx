import React, { useActionState, useEffect, useState } from "react";
import Input from "../Input";
import Select from "../Select";
import Checkbox from "../CheckBox";
import { genererateRealEstateDescription } from "@/lib/actions/realEstate";


type Plan = { planType: string; currentPeriodEnd: Date | null; status: string };
interface RealEstateFormProps {
  userPlan: Plan;
  onOpen: () => void;
  onResult: (t: string) => void;
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

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

const RealEstateForm = ({ userPlan, onOpen, onResult }: RealEstateFormProps) => {
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [bathrooms, setBathrooms] = useState<string | null>(null);
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");

    const [state, formAction, pending] = useActionState(genererateRealEstateDescription, { text: "" });



    useEffect(() => {
    if (state.text) {
      onResult?.(state.text);
      onOpen();
    }
  }, [state.text, onOpen, onResult]);


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
          <form className="px-4 sm:px-6 py-6" action={formAction}>
            {/* Grid principal: 1 col pe mobil, 3 coloane cu minim la md+ */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
              {/* Secțiune 3 câmpuri: 1 col pe mobil, 3 la md+ */}
              <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
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
                  hint={userPlan.planType === "free" ? "Available in Pro plan." : undefined}
                  disabled={userPlan.planType === "free"}
                  className="w-full"
                />

                <Input
                  label="Price (USD)"
                  name="price"
                  type="number"
                  placeholder="0"
                  required
                  hint="In USD"
                  className="w-full"
                />
              </div>

              {/* Listing type – segmented, cu wrap pe mobil */}
              <div className="md:col-span-2 min-w-0">
                <span className="mb-1 block text-sm font-medium text-gray-800">Listing type</span>
                <input type="hidden" name="listingType" value={listingType} />
                <div className="flex flex-row flex-wrap gap-3">
                  {[
                    { key: "sale", label: "Sale" },
                    { key: "rent", label: "Rent" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setListingType(opt.key as "sale" | "rent")}
                      className={cx(
                        "rounded-2xl border px-4 py-2 text-sm font-medium shadow-sm transition",
                        listingType === opt.key
                          ? "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-500"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms / Bathrooms: 1 col pe mobil, 2 la sm+ */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
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
                  className={cx(
                    "block w-full h-11 rounded-2xl border border-gray-200 bg-white/90 px-3 text-gray-900 shadow-sm transition",
                    "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                    "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  )}
                />
              </div>
            </div>

            {/* Features */}
            <div className="mt-8">
              <span className="mb-2 block text-sm font-medium text-gray-800">Features</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {AMENITIES.map((a) => (
                  <Checkbox key={a} name="amenities" value={a.toLowerCase()} label={a} />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-800">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Add relevant details about the property…"
                className={cx(
                  "block w-full rounded-2xl border border-gray-200 bg-white/90 px-3 py-2 text-gray-900 shadow-sm transition",
                  "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                  "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                )}
              />
            </div>

            {/* Contact */}
            <fieldset className="mt-10 rounded-2xl border border-gray-100 p-4">
              <legend className="px-2 text-sm font-medium text-gray-800">Contact details</legend>
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-800">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Full name"
                    className={cx(
                      "block w-full h-11 rounded-2xl border border-gray-200 bg-white/90 px-3 text-gray-900 shadow-sm transition",
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
                    className={cx(
                      "block w-full h-11 rounded-2xl border border-gray-200 bg-white/90 px-3 text-gray-900 shadow-sm transition",
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
                    className={cx(
                      "block w-full h-11 rounded-2xl border border-gray-200 bg-white/90 px-3 text-gray-900 shadow-sm transition",
                      "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                      "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    )}
                  />
                </div>
              </div>
            </fieldset>

            {/* Actions */}
            {state.error ? (
              <p className="mt-6 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
              <button
                type="reset"
                className="w-full sm:w-auto rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                onClick={() => {
                  setPropertyType(null);
                  setBedrooms(null);
                  setBathrooms(null);
                  setListingType("sale");
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
