"use client";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="flex-1 min-w-[250px]">
      <input
        type="text"
        placeholder="Search by name or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
      />
    </div>
  );
}
