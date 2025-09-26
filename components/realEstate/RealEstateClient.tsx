"use client";

import React, { useState } from "react";



import RealEstateForm from "./RealEstateForm";
import RealEstateResponse from "./RealEstateResponse";

type Plan = { planType: string; currentPeriodEnd: Date | null; status: string };

interface Props {
  userPlan: Plan;
  isAuthenticated: boolean;
}



const RealEstateClient = ({ userPlan, isAuthenticated }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);


  return (
    <>
      <div className="mx-auto max-w-full px-4 py-8  bg-gradient-to-br from-sky-50 via-white to-indigo-50">
        <div className="flex flex-col lg:flex-row gap-4">
          <div
            className={[
              "min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
              "transition-all duration-500 ease-out",
              "w-full p-4",
              isOpen ? "lg:w-7/12" : "lg:w-6xl lg:mx-auto",
            ].join(" ")}
          >
            <RealEstateForm
              userPlan={userPlan}
              isAuthenticated={isAuthenticated}
              onOpen={() => {
                setIsOpen(true);
                setResult("");
                setLoading(true);
              }}
              onLoadingChange={setLoading}
              onResult={(value) => {
                setResult(value);
                setLoading(false);
              }}
            />
          </div>
          <div
            className={[
              "min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
              "transition-all duration-500 ease-out",
              "w-full",
              isOpen ? "lg:w-5/12 md:opacity-100 lg:translate-x-0" : "lg:w-0 md:opacity-0 lg:translate-x-4",
              isOpen ? "max-h-[75vh] opacity-100 translate-y-0 p-4" : "max-h-0 opacity-0 -translate-y-1 p-0",
              isOpen ? "pointer-events-auto" : "pointer-events-none",
            ].join(" ")}
            aria-hidden={!isOpen}
          >
            <RealEstateResponse
              onClose={() => setIsOpen(false)}
              text={result}
              loading={loading}
             
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RealEstateClient;
