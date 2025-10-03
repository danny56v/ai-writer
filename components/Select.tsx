import { cx } from "@/lib/utils";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

function Select({
  label, name, value, onChange, options, placeholder = "Select…", required, hint,
}: {
  label: string; name: string; value: string | null; onChange: (v: string) => void;
  options: readonly string[]; placeholder?: string; required?: boolean; hint?: string;
}) {
  const display = value ?? placeholder;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-800">
          {label}{required && <span className="text-red-500"> *</span>}
        </label>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </div>

      {/* keep the selected value when submitting the form */}
      <input type="hidden" name={name} value={value ?? ""} />

      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className={cx(
              "group relative w-full h-10 cursor-default rounded-2xl",
              "border border-gray-200 bg-white/90 pl-3 pr-10 text-left text-gray-900",
              "shadow-sm transition hover:border-indigo-300 hover:bg-white",
              "focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
            )}
          >
            <span className={cx("block truncate", !value && "text-gray-400")}>{display}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400 transition group-data-[headlessui-state=open]:rotate-180" />
            </span>
          </Listbox.Button>

          <Transition as={Fragment} enter="transition ease-out duration-150" enterFrom="opacity-0 -translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options
              className={cx(
                "absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-2xl",
                "border border-gray-100 bg-white/95 shadow-xl ring-1 ring-black/5 backdrop-blur-sm",
                "focus:outline-none"
              )}
            >
              {options.map((opt) => (
                <Listbox.Option
                  key={opt}
                  value={opt}
                  className={({ active, selected }) =>
                    cx(
                      "relative flex cursor-default select-none items-center gap-2 px-3 py-2.5",
                      active ? "bg-indigo-50" : "",
                      selected ? "text-indigo-700" : "text-gray-800"
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      {selected ? <CheckIcon className="h-5 w-5 shrink-0 text-indigo-600" /> : <span className="h-5 w-5 shrink-0" />}
                      <span className={cx("block truncate", selected ? "font-semibold" : "font-normal")}>{opt}</span>
                      {selected && (
                        <span className="ml-auto inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                          Selected
                        </span>
                      )}
                    </>
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
