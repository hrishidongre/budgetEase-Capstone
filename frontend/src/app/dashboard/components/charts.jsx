import { useState } from 'react';
import {PieChart, Pie, Cell,BarChart, Bar, XAxis, YAxis,Tooltip, ResponsiveContainer,Legend} from 'recharts';

export default function Charts({ data }) {
  const [activeTab, setActiveTab] = useState('bar');

  const COLORS = [
    "#0088FE", "#00C49F", "#FFA500", "#FF8042", "#FF69B4",
    "#A28BFF", "#FFBB28", "#82ca9d", "#8884d8", "#d0ed57"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#f9fbfe] p-4 sm:p-6 rounded-xl shadow-md">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#111] text-center sm:text-left">
        Spending Overview
      </h2>

      {/* Tab Buttons */}
      <div className="flex justify-center sm:justify-start mb-6">
        <div className="flex rounded-md overflow-hidden bg-gray-100 w-full sm:w-fit">
          <button
            className={`w-1/2 sm:w-auto px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'pie' ? 'bg-white text-black' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('pie')}
          >
            Pie Chart
          </button>
          <button
            className={`w-1/2 sm:w-auto px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'bar' ? 'bg-white text-black' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('bar')}
          >
            Bar Chart
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[250px] sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'pie' ? (
            <PieChart>
              <Pie
                data={data.map((entry) => ({ name: entry.name, value: entry.spent }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <BarChart data={data} barCategoryGap="30%" margin={{ top: 10, bottom: 30 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#111' }} />
              <YAxis tick={{ fontSize: 12, fill: '#111' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Budget" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" name="Spent" fill="#f84b4b" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
