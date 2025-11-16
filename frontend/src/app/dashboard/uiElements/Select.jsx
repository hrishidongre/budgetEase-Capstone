import React from "react";

export default function Select({ value, onChange, options = [], className = "", ...props }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      <option value="" disabled>
        Select a category
      </option>
      {options.map((opt) => (
        <option key={opt.value || opt.name} value={opt.value || opt.name}>
          {opt.icon ? `${opt.icon} ${opt.name}` : opt.name}
        </option>
      ))}
    </select>
  );
}
