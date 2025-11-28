import { cx } from "@/lib/utils";
type Props = {
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

function Checkbox({ name, value, label, checked, onChange }: Props) {
  return (
    <label className="cursor-pointer">
      <input
        type="checkbox"
        name={name}
        value={value}
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <div
        className={cx(
          "flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium   transition",
          "border-neutral-200/80 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.5)] hover:border-neutral-300 hover:bg-neutral-50",
          "peer-checked:border-neutral-900 peer-checked:bg-neutral-900 peer-checked:text-white peer-checked:shadow-[0_18px_45px_-25px_rgba(15,23,42,0.65)]",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-neutral-300"
        )}
      >
        {label}
      </div>
    </label>
  );
}

export default Checkbox;
