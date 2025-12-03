// src/app/dashboard/components/StatCard.jsx
import React from "react";

export default function StatCard({ title, value, icon, change, positive }) {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700 text-lg">{title}</h3>
        <div className="p-2 rounded-full bg-teal-50 text-teal-600">{icon}</div>
      </div>

      <p className="text-3xl font-bold text-gray-900">{value}</p>

      <p className={`mt-1 text-sm font-medium ${positive ? "text-teal-600" : "text-rose-500"}`}>
        {change}
      </p>
    </div>
  );
}
