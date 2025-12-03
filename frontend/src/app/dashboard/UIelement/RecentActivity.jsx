// src/app/dashboard/uiElements/RecentActivity.jsx
import React from "react";
import ActivityItem from "../components/ActivityItem";

export default function RecentActivity({ activities = [] }) {
  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num || 0);
  };

  const items = activities && activities.length > 0 
    ? activities 
    : [
        { title: "No recent activity", amount: "0.00" },
      ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
      <p className="text-gray-500 text-sm mb-5">Your latest financial transactions</p>

      <div className="divide-y divide-gray-200">
        {items.map((tx, i) => (
          <ActivityItem 
            key={i} 
            title={tx.title} 
            amount={formatCurrency(parseFloat(tx.amount || 0))}
            category={tx.category}
          />
        ))}
      </div>
    </div>
  );
}
