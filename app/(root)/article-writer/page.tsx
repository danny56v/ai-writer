"use client";
import RadioButtons from "@/components/RadioButtons";
import Select from "@/components/Select";
import React, { useState } from "react";

const tone = ["Professional", "Neutral", "Friendly", "Technical", "Optimistic", "Casual", "Humorous"];
const audiences = [
  "General Audience",
  "Students",
  "Developers",
  "Journalists",
  "Investors",
  "Entrepreneurs",
  "Researchers",
  "Parents",
  "Consumers",
  "Healthcare Professionals",
];
const lengths = ["Short", "Medium", "Long"];

const ArticleWriter = () => {
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [selectedAudience, setSelectedAudience] = useState("General audience");
  const [selectedLength, setSelectedLength] = useState("Medium");

  return (
    <>
      <div className="isolate bg-[#f3f4f6] px-6 py-24 sm:py-32 lg:px-8">
        {/* <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-288.75"
          />
        </div> */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
            Article Writer
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">Aute magna irure deserunt veniam aliqua magna enim voluptate.</p>
        </div>
        <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-row">
              <div className="basis-full">
                <label htmlFor="title" className="block text-sm/6 font-semibold text-gray-900">
                  Title
                </label>
                <div className="mt-2.5">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="ex. Best 2025 AI Agents"
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row">
              <div className="basis-2/6">
                <Select label="Select Tone" data={tone} value={selectedTone} onChange={setSelectedTone} />
                <input type="hidden" name="tone" value={selectedTone} />
              </div>
            </div>
            <div className="flex flex-row">
              <div className="basis-4/6">
                <label htmlFor="topic" className="block text-sm/6 font-semibold text-gray-900">
                  Topic
                </label>
                <div className="mt-2.5">
                  <input
                    id="topic"
                    name="topic"
                    type="text"
                    placeholder="ex. AI in Education"
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="basis-2/6">
                <Select
                  label="Select Audience"
                  data={audiences}
                  value={selectedAudience}
                  onChange={setSelectedAudience}
                />
                <input type="hidden" name="audience" value={selectedAudience} />
              </div>
            </div>

            <div className="flex flex-row">
              <div className="">
                <RadioButtons
                  data={lengths}
                  label="Select Length"
                  value={selectedLength}
                  onChange={setSelectedLength}
                />
                <input type="hidden" name="length" value={selectedLength} />
              </div>
            </div>
            <div className="flex flex-row">
              <div className="basis-8/12">
                <label htmlFor="keywords" className="block text-sm/6 font-semibold text-gray-900">
                  Keywords
                </label>
                <input
                  id="keywords"
                  name="keywords"
                  type="text"
                  placeholder="ex. Tech, Business, Health..."
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                />
              </div>
            </div>
           
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                  defaultValue={""}
                />
              </div>
            </div>
            <div className="flex gap-x-4 sm:col-span-2">
              <div className="flex h-6 items-center">
                <div className="group relative inline-flex w-8 shrink-0 rounded-full bg-gray-200 p-px inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2">
                  <span className="size-4 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-3.5" />
                  <input
                    id="agree-to-policies"
                    name="agree-to-policies"
                    type="checkbox"
                    aria-label="Agree to policies"
                    className="absolute inset-0 appearance-none focus:outline-hidden"
                  />
                </div>
              </div>
              <label htmlFor="agree-to-policies" className="text-sm/6 text-gray-600">
                By selecting this, you agree to our{" "}
                <a href="#" className="font-semibold whitespace-nowrap text-indigo-600">
                  privacy policy
                </a>
                .
              </label>
            </div>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Let talk
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ArticleWriter;
