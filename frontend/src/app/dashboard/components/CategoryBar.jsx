// src/app/dashboard/components/CategoryBar.jsx
import React from "react";

export default function CategoryBar({ label, value, amount }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">{amount}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-teal-400 to-sky-500 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
