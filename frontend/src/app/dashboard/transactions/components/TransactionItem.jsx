"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { formatDate } from "../../expenses/utils/formatDate";

export default function TransactionItem({ item }) {
  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(num || 0));
  };

  return (
    <div
      className="
        flex justify-between items-center 
        p-5 
        border border-gray-200 
        rounded-xl 
        bg-white 
        shadow-sm 
        hover:bg-gray-50 
        transition
      "
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {item.amount > 0 ? (
          <ArrowUp className="text-green-500 w-5 h-5" />
        ) : (
          <ArrowDown className="text-red-500 w-5 h-5" />
        )}

        <div>
          <p className="font-semibold text-gray-900">{item.name}</p>
          <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Status Badge */}
        <span
          className={`
            text-xs px-3 py-1 rounded-full 
            ${
              item.status === "Completed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }
          `}
        >
          {item.status}
        </span>

        {/* Amount */}
        <p
          className={`
            font-semibold 
            ${
              item.amount > 0
                ? "text-green-600"
                : "text-red-500"
            }
          `}
        >
          {item.amount > 0 ? "+" : "-"}{formatCurrency(item.amount)}
        </p>
      </div>
    </div>
  );
}
