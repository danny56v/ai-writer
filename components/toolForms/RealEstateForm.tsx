"use client";

import React, { useState } from "react";
import Input from "../Input";
import Select from "../Select";
import Checkbox from "../CheckBox";

type Plan = { planType: string; currentPeriodEnd: Date | null; status: string };

interface RealEstateFormProps {
  userPlan: Plan;
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
const AMENITIES = ["Pool", "Garage", "Garden", "Fireplace", "Basement"] as const;

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function RealEstateForm({ userPlan }: RealEstateFormProps) {
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [bathrooms, setBathrooms] = useState<string | null>(null);
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-2xl border border-neutral-200 bg-white/80 shadow-lg backdrop-blur-md">
          {/* Header */}
          <div className="border-b border-neutral-100 px-4 sm:px-6 py-4 sm:py-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
              🏠 Real Estate
            </div>
            <h2 className="mt-3 text-lg sm:text-xl font-semibold tracking-tight">Listing Description Generator</h2>
            <p className="mt-1 text-sm text-neutral-500">Consistent experience across Safari, Chrome, and Firefox.</p>
          </div>

          {/* Form */}
          <form
            className="px-4 sm:px-6 py-6"
            onSubmit={(e) => {
              e.preventDefault();
              // handle submit
            }}
          >
            {/* Layout: single column on mobile, expands to three columns on medium screens */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-[repeat(3,_minmax(12rem,_1fr))]">
              {/* Section containing three inputs; stacks on mobile, spreads across columns at md+ */}
              <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
                <Select
                  label="Property Type"
                  name="propertyType"
                  value={propertyType}
                  onChange={setPropertyType}
                  options={PROPERTY_TYPES}
                  placeholder="Select property type…"
                  required
                  hint="Cross-browser"
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

              {/* Listing type – segmented buttons with wrapping on smaller screens */}
              <div className="md:col-span-2 min-w-0">
                <span className="mb-1 block text-sm font-medium  ">Listing type</span>
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
                          : "border-neutral-300 bg-white   hover:bg-neutral-50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms / Bathrooms: single column on mobile, two columns from small screens */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                <Select
                  label="Bedrooms"
                  name="bedrooms"
                  value={bedrooms}
                  onChange={setBedrooms}
                  options={BEDROOMS}
                  placeholder="Select bedrooms…"
                  variant="pill"
                  // className="w-full"
                />
                <Select
                  label="Bathrooms"
                  name="bathrooms"
                  value={bathrooms}
                  onChange={setBathrooms}
                  options={BATHROOMS}
                  placeholder="Select bathrooms…"
                  variant="pill"
                  // className="w-full"
                />
              </div>

              {/* Living area */}
              <div className="min-w-0">
                <label htmlFor="area" className="block text-sm font-medium  ">
                  Living area (sq ft)
                </label>
                <div className="relative">
                  <input
                    id="area"
                    name="area"
                    type="number"
                    min={0}
                    placeholder="e.g., 1800"
                    className={cx(
                      "block w-full h-11 rounded-2xl border border-neutral-200 bg-white/90 px-3   shadow-sm transition",
                      "placeholder:text-neutral-400 hover:border-indigo-300 hover:bg-white",
                      "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100",
                      "no-spinner"
                    )}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-neutral-500">
                    sq ft
                  </span>
                </div>
              </div>

              {/* Lot size */}
              <div className="min-w-0">
                <label htmlFor="lot" className="mb-1 block text-sm font-medium  ">
                  Lot size (sq ft)
                </label>
                <div className="relative">
                  <input
                    id="lot"
                    name="lot"
                    type="number"
                    min={0}
                    placeholder="e.g., 7500"
                    className={cx(
                      "block w-full h-11 rounded-2xl border border-neutral-200 bg-white/90 px-3   shadow-sm transition",
                      "placeholder:text-neutral-400 hover:border-indigo-300 hover:bg-white",
                      "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100",
                      "no-spinner"
                    )}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-neutral-500">
                    sq ft
                  </span>
                </div>
              </div>

              {/* Year built */}
              <div className="min-w-0">
                <label htmlFor="year" className="mb-1 block text-sm font-medium  ">
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
                    "block w-full h-11 rounded-2xl border border-neutral-200 bg-white/90 px-3   shadow-sm transition",
                    "placeholder:text-neutral-400 hover:border-indigo-300 hover:bg-white",
                    "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  )}
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-8">
              <span className="mb-2 block text-sm font-medium  ">Amenities</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {AMENITIES.map((a) => (
                  <Checkbox key={a} name="amenities" value={a.toLowerCase()} label={a} />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <label htmlFor="description" className="mb-1 block text-sm font-medium  ">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Add relevant details about the property…"
                className={cx(
                  "block w-full rounded-2xl border border-neutral-200 bg-white/90 px-3 py-2   shadow-sm transition",
                  "placeholder:text-neutral-400 hover:border-indigo-300 hover:bg-white",
                  "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                )}
              />
            </div>

            {/* Contact */}
            <fieldset className="mt-10 rounded-2xl border border-neutral-100 p-4">
              <legend className="px-2 text-sm font-medium  ">Contact details</legend>
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium  ">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Full name"
                    className={cx(
                      "block w-full h-11 rounded-2xl border border-neutral-200 bg-white/90 px-3   shadow-sm transition",
                      "placeholder:text-neutral-400 hover:border-indigo-300 hover:bg-white",
                      "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    )}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium  ">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g., name@email.com"
                    className={cx(
                      "block w-full h-11 rounded-2xl border border-neutral-200 bg-white/90 px-3   shadow-sm transition",
                      "placeholder:text-neutral-400 hover:border-indigo-300 hover:bg-white",
                      "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    )}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium  ">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+373 60 000 000"
                    className={cx(
                      "block w-full h-11 rounded-2xl border border-neutral-200 bg-white/90 px-3   shadow-sm transition",
                      "placeholder:text-neutral-400 hover:border-indigo-300 hover:bg-white",
                      "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    )}
                  />
                </div>
              </div>
            </fieldset>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
              <button
                type="reset"
                className="w-full sm:w-auto rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium   shadow-sm transition hover:bg-neutral-50"
                onClick={() => {
                  setPropertyType(null);
                  setBedrooms(null);
                  setBathrooms(null);
                  setListingType("sale");
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                Publish listing
              </button>
            </div>
          </form>
        </div>

        {/* micro footer */}
        <p className="mx-auto mt-4 px-4 text-center text-xs text-neutral-500">
          Interface refined for Safari / Chrome / Firefox (no native <code>&lt;select&gt;</code> styling).
        </p>
      </div>
    </div>
  );
}
