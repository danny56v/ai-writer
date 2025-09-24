"use client";

import { useActionState, useEffect, useState } from "react";
import Checkbox from "../CheckBox";
import Input from "../Input";
import Select from "../Select";
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
    <form className="space-y-8" action={formAction}>
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Property type"
            name="propertyType"
            value={propertyType}
            onChange={setPropertyType}
            options={PROPERTY_TYPES}
            placeholder="Select property type…"
            required
          />
          <Input
            label="Location"
            name="location"
            type="text"
            placeholder="ex. 24 Victoria St, London"
            required
            hint={userPlan.planType === "free" ? "Available in Pro plan." : undefined}
            disabled={userPlan.planType === "free"}
          />
          <Input
            label="Price (USD)"
            name="price"
            type="number"
            placeholder="0"
            required
            hint="In USD"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <input type="hidden" name="listingType" value={listingType} />
          {[{ key: "sale", label: "Sale" }, { key: "rent", label: "Rent" }].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setListingType(opt.key as "sale" | "rent")}
              className={cx(
                "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                listingType === opt.key
                  ? "border-transparent bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] text-white shadow-[0_22px_40px_-20px_rgba(110,71,255,0.8)]"
                  : "border-[#e8defd] bg-white/90 text-slate-700 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)] hover:border-[#c2afff]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="area" className="text-sm font-semibold text-slate-900">
              Living area (m²)
            </label>
            <input
              id="area"
              name="area"
              type="number"
              min={0}
              placeholder="e.g., 75"
              className="mt-2 h-11 w-full rounded-2xl border border-[#e8defd] bg-white/90 px-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-[#c2afff] focus:outline-none focus:ring-4 focus:ring-[#cabaff]/40"
            />
          </div>
          <div>
            <label htmlFor="lot" className="text-sm font-semibold text-slate-900">
              Lot size (m²)
            </label>
            <input
              id="lot"
              name="lot"
              type="number"
              min={0}
              placeholder="e.g., 300"
              className="mt-2 h-11 w-full rounded-2xl border border-[#e8defd] bg-white/90 px-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-[#c2afff] focus:outline-none focus:ring-4 focus:ring-[#cabaff]/40"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-900">Features</label>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {AMENITIES.map((a) => (
              <Checkbox key={a} name="amenities" value={a.toLowerCase()} label={a} />
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm font-semibold text-slate-900">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Add relevant details about the property…"
            className="rounded-2xl border border-[#e8defd] bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-[#c2afff] focus:outline-none focus:ring-4 focus:ring-[#cabaff]/40"
          />
        </div>

        <fieldset className="grid gap-4 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[inset_0_1px_12px_rgba(255,255,255,0.75)]">
          <legend className="text-sm font-semibold text-slate-900">Contact details</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Name" name="name" type="text" placeholder="Full name" required />
            <Input label="Email" name="email" type="email" placeholder="name@email.com" required />
            <Input label="Phone" name="phone" type="tel" placeholder="+373 60 000 000" />
          </div>
        </fieldset>
      </div>

      {state.error ? (
        <p className="rounded-3xl border border-red-200/60 bg-red-50/70 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="reset"
          className="rounded-full border border-[#d9cfff] bg-white/90 px-5 py-2 text-sm font-semibold text-slate-600 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)] transition hover:border-[#c2afff] hover:text-[#6b4dff]"
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
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] px-6 py-2 text-sm font-semibold text-white shadow-[0_24px_44px_-22px_rgba(110,71,255,0.85)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Generating..." : "Preview / Publish"}
        </button>
      </div>
    </form>
  );
};

export default RealEstateForm;
