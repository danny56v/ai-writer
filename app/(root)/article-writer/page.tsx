"use client";
import LanguageSelect from "@/components/LanguageSelect";
import RadioButtons from "@/components/RadioButtons";
import Select from "@/components/SelectOld";
import { GeneratePrompt } from "@/lib/actions/actions";
import { languages } from "@/utils/languages";
import React, { useActionState, useState } from "react";

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

// Component for displaying the article
interface ArticleDisplayProps {
  response: string;
  pending: boolean;
}

const ArticleDisplay: React.FC<ArticleDisplayProps> = ({ response, pending }) => {
  if (pending) {
    return (
      <div className="mt-16 mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
          </div>
          <div className="flex items-center justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Generating your article...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!response || response === "success") {
    return null;
  }

  return (
    <div className="mt-16 mx-auto max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header cu acțiuni */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Generated Article</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => navigator.clipboard.writeText(response)}
                className="flex items-center px-3 py-1.5 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
              <button
                onClick={() => {
                  const element = document.createElement("a");
                  const file = new Blob([response], { type: 'text/plain' });
                  element.href = URL.createObjectURL(file);
                  element.download = "article.txt";
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="flex items-center px-3 py-1.5 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Conținutul articolului */}
        <div className="p-8">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed whitespace-pre-wrap"
              style={{
                lineHeight: '1.8',
                fontSize: '16px',
                fontFamily: 'Georgia, serif'
              }}
            >
              {response}
            </div>
          </div>
        </div>

        {/* Footer cu statistici */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex space-x-6">
              <span>Words: {response.split(' ').length}</span>
              <span>Characters: {response.length}</span>
              <span>Reading time: ~{Math.ceil(response.split(' ').length / 200)} min</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-600 font-medium">Generated successfully</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticleWriter = () => {
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [selectedAudience, setSelectedAudience] = useState("General Audience"); // Fixed typo
  const [selectedLength, setSelectedLength] = useState("Medium");
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const [state, formAction, pending] = useActionState(GeneratePrompt, { 
    success: true, 
    message: "", 
    response: "" 
  });

  return (
    <>
      <div className="isolate bg-[#f3f4f6] px-6 py-24 sm:py-32 lg:px-8 min-h-screen">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-semibold tracking-tight text-balance text-gray-900 sm:text-2xl">
            AI Article Writer
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Generate professional articles tailored to your audience and tone
          </p>
        </div>
        
        <form action={formAction} className="mx-auto max-w-xl mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col gap-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                  Article Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="ex. Best 2025 AI Agents"
                  className="block w-full rounded-md bg-white px-3.5 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select label="Tone" data={tone} value={selectedTone} onChange={setSelectedTone} />
                  <input type="hidden" name="tone" value={selectedTone} />
                </div>
                <div>
                  <Select
                    label="Target Audience"
                    data={audiences}
                    value={selectedAudience}
                    onChange={setSelectedAudience}
                  />
                  <input type="hidden" name="audience" value={selectedAudience} />
                </div>
              </div>

              <div>
                <label htmlFor="topic" className="block text-sm font-semibold text-gray-900 mb-2">
                  Topic
                </label>
                <input
                  id="topic"
                  name="topic"
                  type="text"
                  placeholder="ex. AI in Education"
                  className="block w-full rounded-md bg-white px-3.5 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                  required
                />
              </div>

              <div>
                <RadioButtons
                  data={lengths}
                  label="Article Length"
                  value={selectedLength}
                  onChange={setSelectedLength}
                />
                <input type="hidden" name="length" value={selectedLength} />
              </div>

              <div>
                <label htmlFor="keywords" className="block text-sm font-semibold text-gray-900 mb-2">
                  Keywords (optional)
                </label>
                <input
                  id="keywords"
                  name="keywords"
                  type="text"
                  placeholder="ex. Tech, Business, Health..."
                  className="block w-full rounded-md bg-white px-3.5 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                  Additional Context (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Provide any additional context or specific requirements for your article..."
                  className="block w-full rounded-md bg-white px-3.5 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-row justify-between items-center">
              <div>
                <LanguageSelect value={selectedLanguage} onChange={setSelectedLanguage} data={languages} />
                <input type="hidden" name="language" value={selectedLanguage} />
              </div>
              <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-indigo-600 px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {pending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  "Generate Article"
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Afișarea erorii dacă există */}
        {!state.success && state.message && (
          <div className="mt-6 mx-auto max-w-xl">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{state.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Componenta pentru afișarea articolului */}
        <ArticleDisplay response={state.response} pending={pending} />
      </div>
    </>
  );
};

export default ArticleWriter;