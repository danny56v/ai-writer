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

export default function RealEstateForm({ userPlan }: RealEstateFormProps) {
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [bathrooms, setBathrooms] = useState<string | null>(null);
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-3xl border border-gray-200 bg-white/80 shadow-lg backdrop-blur-md">
          <div className="border-b border-gray-100 px-6 py-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
              🏠 Real Estate
            </div>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">Listing Description Generator</h2>
            <p className="mt-1 text-sm text-gray-500">Beautiful, consistent UI in Safari / Chrome / Firefox.</p>
          </div>

          <form className="px-6 py-6">
            <div className="grid grid-cols-1  md:grid-cols-3 gap-6">
              <div className="">
                
  <Select
                label="Property Type"
                name="propertyType"
                value={propertyType}
                onChange={setPropertyType}
                options={PROPERTY_TYPES}
                placeholder="Select property type…"
                required
                hint="Cross-browser"
              />
             
            

              {/* Location */}
              <Input
                label="Location"
                name="location"
                type="text"
                placeholder="ex. Victoria St, London, UK"
                className=""
                required
                hint={userPlan.planType === "free" ? "Available in Pro plan." : undefined}
                disabled={userPlan.planType === "free"}
              />
               <Input
                  label="Price (USD)"
                  name="price"
                  type="number"
                  placeholder="0"
                  className=""
                  required
                  hint="In USD"
                />
               </div>

                <div className="md:col-span-2">
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
                        "rounded-2xl border px-15 py-2 text-sm font-medium shadow-sm transition",
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

              <div className="col-span-2 grid grid-cols-3 gap-4">
                {/* Price */}
               
                <Select
                  label="Bedrooms"
                  name="bedrooms"
                  value={bedrooms}
                  onChange={setBedrooms}
                  options={BEDROOMS}
                  placeholder="Select bedrooms…"
                />
                <Select
                  label="Bathrooms"
                  name="bathrooms"
                  value={bathrooms}
                  onChange={setBathrooms}
                  options={BATHROOMS}
                  placeholder="Select bathrooms…"
                />
              </div>

              

              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-800">
                    Price (USD)
                  </label>
                  <div className="relative">
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min={0}
                      step="1000"
                      placeholder="0"
                      className={cx(
                        "block w-full h-11 rounded-2xl border border-gray-200 bg-white/90 px-3 text-gray-900 shadow-sm transition",
                        "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
                        "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                      )}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-sm text-gray-500">
                      $
                    </span>
                  </div>
                </div>
              </div> */}

              {/* Bedrooms / Bathrooms */}

              {/* Living area */}
              <div>
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
              <div>
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
              <div>
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

              {/* Listing type – segmented */}
            
            </div>

            {/* Amenities */}
            <div className="mt-8">
              <span className="mb-2 block text-sm font-medium text-gray-800">Amenities</span>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
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
            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                type="reset"
                className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
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
                className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                Publish listing
              </button>
            </div>
          </form>
        </div>

        {/* micro footer */}
        <p className="mx-auto mt-4 text-center text-xs text-gray-500">
          UI optimizat pentru Safari / Chrome / Firefox (fără stiluri native <code>&lt;select&gt;</code>).
        </p>
      </div>
    </div>
  );
}
