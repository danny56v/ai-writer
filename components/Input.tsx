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
          <label htmlFor={props.id} className="mb-1 block text-sm font-medium  ">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {iconLeft && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center ">
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            {...props}
            className={cx(
              "block h-10 w-full rounded-lg border border-neutral-200/80 bg-white/90 px-4   shadow-[0_12px_40px_-28px_rgba(15,23,42,0.6)] transition",
              "placeholder:text-neutral-400 hover:border-neutral-300 hover:bg-white",
              "focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-200",
              iconLeft ? "pl-11" : "pl-4",
              iconRight ? "pr-11" : "pr-4",
              error && "border-red-500 focus:border-red-500 focus:ring-red-100",
              className
            )}
          />

          {iconRight && (
            <span className="absolute inset-y-0 right-3 flex items-center ">{iconRight}</span>
          )}
        </div>

        {hint && !error && <p className="mt-1 text-xs text-neutral-800">{hint}</p>}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
