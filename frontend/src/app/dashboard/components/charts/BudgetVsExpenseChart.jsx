"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BudgetVsExpenseChart({ data }) {
  if (!data || (data.totalBudget === 0 && data.totalExpensesThisMonth === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-80 flex items-center justify-center">
        <p className="text-gray-500 text-center">No data available for this month.</p>
      </div>
    );
  }

  // Format data for BarChart
  const chartData = [
    {
      name: "Comparison",
      "Total Budget": data.totalBudget,
      "This Month's Expenses": data.totalExpensesThisMonth,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget vs Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(value) => `₹${value.toFixed(2)}`}
          />
          <Legend />
          <Bar dataKey="Total Budget" fill="#06b6d4" radius={[8, 8, 0, 0]} />
          <Bar dataKey="This Month's Expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
