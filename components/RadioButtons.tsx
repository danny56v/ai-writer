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
            className="flex-1 cursor-pointer rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2 text-center text-sm font-medium text-slate-700 shadow-inner shadow-white/60 transition data-[checked]:border-purple-400 data-[checked]:bg-gradient-to-r data-[checked]:from-purple-600 data-[checked]:via-fuchsia-500 data-[checked]:to-amber-400 data-[checked]:text-white data-[checked]:shadow-lg data-[checked]:shadow-fuchsia-400/40 sm:flex-none"
          >
            {option}
          </Radio>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
