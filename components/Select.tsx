import { cx } from "@/lib/utils";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

function Select({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select…",
  required,
  hint,
  variant = "default",
}: {
  label: string;
  name: string;
  value: string | null;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
  hint?: string;
  variant?: "default" | "pill";
}) {
  const display = value ?? placeholder;
  const isPill = variant === "pill";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-sm font-medium  ">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
        {hint && <span className="text-xs text-neutral-500">{hint}</span>}
      </div>

      {/* keep the selected value when submitting the form */}
      <input type="hidden" name={name} value={value ?? ""} />

      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className={cx(
              "group relative w-full cursor-default rounded-lg",
              isPill
                ? "flex h-10 items-center justify-between border border-neutral-200/80 bg-white/90 px-3 text-left text-sm font-semibold shadow-[0_10px_30px_-20px_rgba(15,23,42,0.5)] transition hover:border-neutral-300 hover:bg-neutral-50 focus:border-neutral-900 focus:outline-none focus:ring-3 focus:ring-neutral-200"
                : "h-10 border border-neutral-200/80 bg-white/90 pl-4 pr-12 text-left shadow-[0_12px_40px_-28px_rgba(15,23,42,0.6)] transition hover:border-neutral-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-neutral-200 focus:border-neutral-900"
            )}
          >
            <span className={cx("block truncate", !value && "text-neutral-400")}>{display}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-neutral-400 transition group-data-[headlessui-state=open]:rotate-180" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={cx(
                "absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-lg",
                "border border-neutral-100 bg-white/95 shadow-xl ring-1 ring-black/5 backdrop-blur-sm focus:outline-none",
                isPill ? "py-1 text-sm" : ""
              )}
            >
              {options.map((opt) => (
                <Listbox.Option
                  key={opt}
                  value={opt}
                  className={({ active, selected }) =>
                    cx(
                      "relative flex cursor-default select-none px-3",
                      isPill ? "items-center py-1.5 text-sm transition" : "items-center gap-2 py-2.5",
                      isPill ? (active ? "bg-neutral-900 text-white" : "text-neutral-900") : active ? "bg-neutral-50" : "",
                      isPill ? (selected ? "font-semibold" : "font-medium") : ""
                    )
                  }
                >
                  {({ selected, active }) => (
                    isPill ? (
                      <>
                        <span className="block truncate">{opt}</span>
                        {selected ? (
                          <span
                            className={cx(
                              "absolute inset-y-0 right-0 flex items-center pr-2",
                              active ? "text-white" : "text-neutral-500"
                            )}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <>
                        {selected ? (
                          <CheckIcon className="h-5 w-5 shrink-0  " />
                        ) : (
                          <span className="h-5 w-5 shrink-0" />
                        )}
                        <span className={cx("block truncate", selected ? "font-semibold" : "font-normal")}>{opt}</span>
                        {selected && (
                          <span className="ml-auto inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium  ">
                            Selected
                          </span>
                        )}
                      </>
                    )
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
export default Select;
