"use client";

export default function StatusFilter({ filterStatus, setFilterStatus }) {
  return (
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
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
      <option value="All">All</option>
      <option value="Completed">Completed</option>
      <option value="Pending">Pending</option>
    </select>
  );
}
