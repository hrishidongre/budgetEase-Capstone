"use client";

const sortOptions = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "amount-desc", label: "Highest Amount" },
  { value: "amount-asc", label: "Lowest Amount" },
  { value: "alpha-asc", label: "A - Z" },
  { value: "alpha-desc", label: "Z - A" },
];

export default function SortDropdown({ sort, setSort }) {
  return (
    <div className="min-w-[150px]">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white cursor-pointer"
      >
        <option value="">Sort By</option>
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
