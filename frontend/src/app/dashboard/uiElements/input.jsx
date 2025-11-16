import React from "react";

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${className}`}
      {...props}
    />
  );
}
