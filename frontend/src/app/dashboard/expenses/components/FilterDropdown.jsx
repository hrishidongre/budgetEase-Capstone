"use client";

const categories = [
  "All",
  "Food",
  "Travel",
  "Entertainment",
  "Utilities",
  "Health",
  "Shopping",
  "Other",
];

export default function FilterDropdown({ filter, setFilter }) {
  return (
    <div className="min-w-[150px]">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white cursor-pointer"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
