"use client";

import { Radio, RadioGroup } from "@headlessui/react";

interface RadioButtonsProps {
  label: string;
  data: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function RadioButtons(props: RadioButtonsProps) {
  return (
    <fieldset aria-label={props.label} className="space-y-2">
      <label htmlFor="radio" className="text-sm font-semibold text-slate-900">
        {props.label}
      </label>
      <RadioGroup
        id="radio"
        value={props.value}
        onChange={props.onChange}
        className="flex flex-wrap gap-3"
      >
        {props.data.map((option) => (
          <Radio
            key={option}
            value={option}
            className="flex-1 cursor-pointer rounded-2xl border border-[#e8defd] bg-white/90 px-4 py-2 text-center text-sm font-medium text-slate-700 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)] transition data-[checked]:border-transparent data-[checked]:bg-gradient-to-r data-[checked]:from-[#6b4dff] data-[checked]:via-[#ff47c5] data-[checked]:to-[#ffb347] data-[checked]:text-white data-[checked]:shadow-[0_22px_40px_-20px_rgba(110,71,255,0.8)] sm:flex-none"
          >
            {option}
          </Radio>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
