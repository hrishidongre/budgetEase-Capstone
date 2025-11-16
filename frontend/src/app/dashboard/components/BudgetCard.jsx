import React from 'react';

export default function BudgetCard({ category, budget, spent, icon }) {
  const remaining = budget - spent;
  const isOver = remaining < 0;

  return (          //to take reference from the parent component
    <div className="relative bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-md group transition-all duration-300 hover:shadow-xl hover:scale-[1.01] w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">{icon}</span>
          <h3 className="text-base sm:text-lg font-semibold">{category}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 mt-4 text-sm sm:text-base">
        {/* Spent row */}
        <div className="flex justify-between">
          <span className="text-gray-600">Spent</span>
          <span className="font-medium">₹{spent.toFixed(2)}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${isOver ? 'bg-red-500' : 'bg-gray-800'}`}
            style={{ width: `${Math.min((spent / budget) * 100, 100)}%` }}
          />
        </div>

        {/* Budget + Remaining */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
          <span className="text-gray-600">Budget: ₹{budget.toFixed(2)}</span>
          <span className={isOver ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
            {isOver
              ? `Over: ₹${Math.abs(remaining).toFixed(2)}`
              : `Remaining: ₹${remaining.toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  );
}
