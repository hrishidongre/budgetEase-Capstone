import React from "react";

export default function Label({ htmlFor, children, className = "" }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-1.5 ${className}`}
    >
      {children}
    </label>
  );
}
