import {  Radio, RadioGroup } from "@headlessui/react";

interface RadioButtonsProps {
  label: string;
  data: string[];
  value: string;
  onChange: (value: string) => void;
}
export default function RadioButtons(props: RadioButtonsProps) {
  return (
    <fieldset aria-label="Choose length">
      <label htmlFor="radio" className=" text-sm/6 font-semibold text-gray-900">Length</label>
      <RadioGroup id="radio" value={props.value} onChange={props.onChange} className="flex flex-col sm:flex-row gap-3">
        {props.data.map((option) => (
          <Radio
            key={option}
            value={option}
            className=" cursor-pointer focus:outline-none flex items-center justify-center rounded-md bg-white px-2 py-2 text-sm font-medium  text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50 data-[checked]:bg-indigo-600 data-[checked]:text-white data-[checked]:ring-0 data-[focus]:data-[checked]:ring-2 data-[focus]:ring-2 data-[focus]:ring-indigo-600 data-[focus]:ring-offset-2 data-[checked]:hover:bg-indigo-500 sm:flex-1 w-full text-center"
          >
            {option}
          </Radio>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
