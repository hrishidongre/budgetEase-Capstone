// src/app/dashboard/uiElements/SpendingByCategory.jsx
import React from "react";
import CategoryBar from "../components/CategoryBar";

export default function SpendingByCategory({ spending = [] }) {
  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num || 0);
  };

  const cats = spending && spending.length > 0 
    ? spending 
    : [
        { category: "No data", amount: 0 },
      ];

  // compute max for relative bar widths
  const max = Math.max(...cats.map((c) => Number(c.amount) || 0), 1);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900">Spending by Category</h2>
      <p className="text-gray-500 text-sm mb-5">This month's breakdown</p>

      {cats.map((cat, i) => (
        <CategoryBar
          key={i}
          label={cat.category || cat.name || "Other"}
          amount={formatCurrency(parseFloat(cat.amount || 0))}
          value={Math.round((cat.amount / max) * 100)}
        />
      ))}
    </div>
  );
}
