"use client";

import React, { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { cx } from "@/lib/utils"; // un mic helper: (...classes) => classes.filter(Boolean).join(" ")

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  wrapperClass?: string; // pentru grid control
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, iconLeft, iconRight, className, wrapperClass, ...props }, ref) => {
    return (
      <div className={cx("w-full", wrapperClass)}>
        {label && (
          <label htmlFor={props.id} className="mb-1 block text-sm font-medium text-gray-800">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {iconLeft && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            {...props}
            className={cx(
              "block w-full h-10 rounded-2xl border border-gray-200 bg-white/90 px-3 text-gray-900 shadow-sm transition",
              "placeholder:text-gray-400 hover:border-indigo-300 hover:bg-white",
              "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100",
              iconLeft ? "pl-10" : "pl-3",
              iconRight ? "pr-10" : "pr-3",
              error && "border-red-500 focus:border-red-500 focus:ring-red-100",
              className
            )}
          />

          {iconRight && <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">{iconRight}</span>}
        </div>

        {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
