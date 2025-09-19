import { cx } from "@/lib/utils";
function Checkbox({ name, value, label }: { name: string; value: string; label: string }) {
  return (
    <label className="cursor-pointer">
      <input type="checkbox" name={name} value={value} className="peer sr-only" />
      <div
        className={cx(
          "flex items-center justify-center rounded-xl border px-3 py-2 text-sm shadow-sm transition",
          "border-gray-200 bg-white text-gray-700",
          "hover:border-indigo-300 hover:bg-indigo-50/50",
          "peer-checked:bg-indigo-600 peer-checked:border-indigo-500 peer-checked:text-white",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500"
        )}
      >
        {label}
      </div>
    </label>
  );
}

export default Checkbox;
