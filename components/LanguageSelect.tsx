interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  data: string[];
}

const LanguageSelect = ({ value, onChange, data }: LanguageSelectProps) => {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <label htmlFor="language" className="text-sm font-semibold text-slate-900">
        Language
      </label>
      <select
        id="language"
        name="language"
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-2xl border border-[#e8defd] bg-white/90 px-4 text-sm font-medium text-slate-700 shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)] focus:border-[#c2afff] focus:outline-none focus:ring-4 focus:ring-[#cabaff]/40"
      >
        {data.map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelect;
