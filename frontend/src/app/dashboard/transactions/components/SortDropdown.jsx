"use client";

export default function SortDropdown({ sortType, setSortType }) {
  return (
    <select
      value={sortType}
      onChange={(e) => setSortType(e.target.value)}
      className="
        px-4 py-2 
        border border-gray-300 
        rounded-xl 
        bg-white 
        shadow-sm 
        text-sm 
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-500/30 
        transition
      "
    >
      <option value="date-desc">Sort By</option>
      <option value="date-desc">Date (Newest)</option>
      <option value="date-asc">Date (Oldest)</option>
      <option value="amount-desc">Amount (High → Low)</option>
      <option value="amount-asc">Amount (Low → High)</option>
      <option value="alpha-asc">Name (A → Z)</option>
      <option value="alpha-desc">Name (Z → A)</option>
    </select>
  );
}
