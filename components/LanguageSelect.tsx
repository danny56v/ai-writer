interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  data: string[];
}

const LanguageSelect = ({ value, onChange, data }: LanguageSelectProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center">
     <label htmlFor="language" className=" text-sm/6 font-semibold text-gray-900 mr-4 " >
                  Language
                </label>

      <select
        id="language"
        name="language"
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
