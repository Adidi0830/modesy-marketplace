"use client";

import React from "react";

interface RadioCardProps<T extends string> {
  label: string;
  description: string;
  value: T;
  selected: T;
  onChange: (value: T) => void;
}

export default function RadioCard<T extends string>({
  label,
  description,
  value,
  selected,
  onChange,
}: RadioCardProps<T>) {
  const isActive = selected === value;

  return (
    <label
      className={`flex cursor-pointer flex-col rounded-lg border p-4 transition ${
        isActive
          ? "border-[#00C9A7] bg-teal-50/50 ring-1 ring-[#00C9A7]"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <input
        type="radio"
        name={value}
        value={value}
        checked={isActive}
        onChange={() => onChange(value)}
        className="hidden"
      />
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-semibold ${
            isActive ? "text-[#00C9A7]" : "text-slate-800"
          }`}
        >
          {label}
        </span>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
            isActive
              ? "border-[#00C9A7]"
              : "border-slate-300"
          }`}
        >
          {isActive && (
            <span className="h-2.5 w-2.5 rounded-full bg-[#00C9A7]" />
          )}
        </span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </label>
  );
}
