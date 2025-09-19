import React from "react";

interface Props {
  onClose: () => void;
  text: string;
}

const RealEstateResponse = ({ onClose, text }: Props) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Generated listing</h2>
        {/* <button onClick={onClose} className="text-sm text-indigo-600 hover:underline">
          Închide
        </button> */}
      </div>

      <div className="mt-4 flex-1 overflow-auto rounded-2xl border border-dashed border-indigo-100 bg-indigo-50/40 p-4 text-sm text-gray-700">
        {text ? (
          <pre className="whitespace-pre-wrap rounded-xl border bg-gray-50 p-4 text-sm">{text}</pre>
        ) : (
          <p className="text-sm text-gray-500">No content yet.</p>
        )}
      </div>
    </div>
  );
};

export default RealEstateResponse;
