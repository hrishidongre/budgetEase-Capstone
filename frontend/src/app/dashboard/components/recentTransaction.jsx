import React from 'react';
import { ArrowDownLeft } from 'lucide-react';

export default function RecentTransaction({
  transactions,
  title = "Recent Transactions",
  subtitle = "Your latest spending activity"
}) {
  return (
    <div className="w-full max-w-md sm:max-w-full bg-white rounded-xl p-4 sm:p-6 shadow-md">
      <h2 className="text-base sm:text-lg font-semibold text-[#111] mb-1">{title}</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-4">{subtitle}</p>

      <div className="flex flex-col gap-3">
        {transactions.slice(0, 3).map((tx, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#f9fbfe] p-3 rounded-md gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-100 text-red-600 rounded-full p-1.5">
                <ArrowDownLeft size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#111] leading-tight">{tx.title}</p>
                <p className="text-xs text-gray-500">{tx.category}</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm font-semibold text-red-500 leading-tight">-₹{tx.amount.toFixed(2)}</p>
              <p className="text-xs text-gray-400">{tx.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
