"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, setPage, loading }) {
  return (
    <div className="flex items-center justify-center gap-4 mt-8 pb-6">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1 || loading}
        className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          Page <span className="text-teal-600 font-bold">{page}</span> of{" "}
          <span className="text-gray-900 font-bold">{totalPages}</span>
        </span>
      </div>

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages || totalPages === 0 || loading}
        className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
