import { cx } from "@/lib/utils";
function Checkbox({ name, value, label }: { name: string; value: string; label: string }) {
  return (
    <label className="cursor-pointer">
      <input type="checkbox" name={name} value={value} className="peer sr-only" />
      <div
        className={cx(
          "flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-inner shadow-white/60 transition",
          "border-slate-200/80 bg-white/90 text-slate-700",
          "hover:border-purple-200 hover:bg-purple-50/50",
          "peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:via-fuchsia-500 peer-checked:to-amber-400 peer-checked:border-transparent peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-fuchsia-400/40",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-purple-400"
        )}
      >
        {label}
      </div>
    </label>
  );
}

export default Checkbox;
