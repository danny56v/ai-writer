"use client";

import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  data: string[];
}

const SelectOld = ({ value, onChange, label, data }: SelectProps) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <Label className="text-sm font-semibold text-slate-900">{label}</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-2xl border border-[#e8defd] bg-white/90 py-2.5 pl-4 pr-10 text-left text-sm font-medium text-slate-700 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)] focus:outline-none focus:ring-4 focus:ring-[#cabaff]/40">
          <span className="truncate">{value}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-slate-400" />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-[#e8defd] bg-white/95 py-2 text-sm shadow-[0_24px_48px_-28px_rgba(32,5,94,0.2)] backdrop-blur-sm focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
        >
          {data.map((item) => (
            <ListboxOption
              key={item}
              value={item}
              className="group relative cursor-default select-none px-4 py-2 text-slate-700 data-[focus]:rounded-xl data-[focus]:bg-[#f3ecff] data-[focus]:text-[#6b4dff]"
            >
              <span className="truncate font-medium group-data-[selected]:text-[#6b4dff]">{item}</span>

              <span className="absolute inset-y-0 right-4 flex items-center text-[#6b4dff] group-data-[focus]:text-[#6b4dff] [.group:not([data-selected])_&]:hidden">
                <CheckIcon aria-hidden="true" className="h-5 w-5 text-[#6b4dff]" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

export default SelectOld;
