"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import ExpenseItem from "./components/expenseItem";
import SearchBar from "./components/SearchBar";
import FilterDropdown from "./components/FilterDropdown";
import SortDropdown from "./components/SortDropdown";
import Pagination from "./components/Pagination";
import AddExpenseModal from "@/app/uiElements/modals/AddExpenseModal";
import { Plus } from "lucide-react";

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("date-desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch expenses with pagination, searching, sorting, and filtering
  useEffect(() => {
    if (!user?.id) return;

    const fetchExpenses = async () => {
      setLoading(true);
      setApiAvailable(true);

      try {
        // Check if API endpoint is available via HEAD request
        try {
          await axios.head(`${process.env.NEXT_PUBLIC_API_URL}/api/expense`, {
            withCredentials: true,
            timeout: 3000,
          });
        } catch (err) {
          if (err.response?.status === 404) {
            setApiAvailable(false);
            setLoading(false);
            return;
          }
        }

        // Build query parameters
        const params = {
          page,
          limit,
          search: search.trim(),
          category: filter === "All" ? "" : filter,
          sort: sort || "date-desc",
        };

        // Fetch expenses with pagination
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/expense`,
          { params, withCredentials: true }
        );

        const { data, pagination } = response.data;
        setExpenses(data || []);
        setTotalPages(pagination?.totalPages || 0);
        setTotalRecords(pagination?.totalRecords || 0);
      } catch (error) {
        console.error("Error fetching expenses:", error.response?.data || error.message);
        setApiAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user?.id, page, search, filter, sort, limit, refreshTrigger]);

  // Reset page to 1 when search, filter, or sort changes
  useEffect(() => {
    setPage(1);
  }, [search, filter, sort]);

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 mt-1">
            Track and manage your spending
          </p>
        </div>

        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-teal-700 font-medium"
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* API Unavailable Message */}
      {!apiAvailable && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-center max-w-md">
            Backend API not available. Please start the server.
          </div>
        </div>
      )}

      {apiAvailable && (
        <>
          {/* Search, Filter, Sort Controls */}
          <div className="flex flex-wrap gap-4 mt-8 mb-6">
            <SearchBar search={search} setSearch={setSearch} />
            <FilterDropdown filter={filter} setFilter={setFilter} />
            <SortDropdown sort={sort} setSort={setSort} />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Expense List */}
          {!loading && (
            <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900">Recent Expenses</h2>
              <p className="text-sm text-gray-500 mb-5">Your latest spending activities</p>

              {expenses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No expenses found</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {expenses.map((expense, i) => (
                      <ExpenseItem
                        key={i}
                        title={expense.name}
                        category={expense.category}
                        amount={expense.amount}
                        date={expense.createdAt}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                    loading={loading}
                  />
                </>
              )}
            </div>
          )}
        </>
      )}

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={() => {
          setIsExpenseModalOpen(false);
          setPage(1); // Reset to first page
          setRefreshTrigger((prev) => prev + 1);
        }}
      />
    </div>
  );
}
