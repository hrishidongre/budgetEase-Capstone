"use client";

export default function ExpenseFilters({ sortType, setSortType }) {
  return (
    <select
      value={sortType}
      onChange={(e) => setSortType(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
    >
      <option value="date-desc">Sort By</option>

      <option value="date-desc">Date — Newest</option>
      <option value="date-asc">Date — Oldest</option>

      <option value="alpha-asc">Alphabet — A → Z</option>
      <option value="alpha-desc">Alphabet — Z → A</option>

      <option value="amount-asc">Amount — Low → High</option>
      <option value="amount-desc">Amount — High → Low</option>
    </select>
  );
}
