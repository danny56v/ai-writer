import { cx } from "@/lib/utils";
function Checkbox({ name, value, label }: { name: string; value: string; label: string }) {
  return (
    <label className="cursor-pointer">
      <input type="checkbox" name={name} value={value} className="peer sr-only" />
      <div
        className={cx(
          "flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)] transition",
          "border-[#e8defd] bg-white/90 text-slate-700",
          "hover:border-[#c2afff] hover:bg-[#f3ecff]",
          "peer-checked:bg-gradient-to-r peer-checked:from-[#6b4dff] peer-checked:via-[#ff47c5] peer-checked:to-[#ffb347] peer-checked:border-transparent peer-checked:text-white peer-checked:shadow-[0_20px_36px_-20px_rgba(112,64,255,0.85)]",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-[#cabaff]/60"
        )}
      >
        {label}
      </div>
    </label>
  );
}

export default Checkbox;
