// src/app/dashboard/components/ActivityItem.jsx
import React from "react";

export default function ActivityItem({ title, amount }) {
  return (
    <div className="py-3 border-b last:border-b-0 flex justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-gray-500 text-sm">Category</p>
      </div>

      <p className="font-semibold text-gray-700">-{amount}</p>
    </div>
  );
}
