"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "../expenses/components/SearchBar";
import SortDropdown from "../expenses/components/SortDropdown";
import Pagination from "../expenses/components/Pagination";
import TransactionItem from "./components/TransactionItem";
import { Download } from "lucide-react";

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date-desc");
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch transactions with pagination, searching, sorting, and filtering
  useEffect(() => {
    if (!user?.id) return;

    const fetchTransactions = async () => {
      setLoading(true);
      setApiAvailable(true);

      try {
        // Check if API endpoint exists via HEAD request
        try {
          await axios.head(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/get`, {
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
          sort: sort || "date-desc",
        };

        if (filterType) {
          params.type = filterType;
        }

        // Fetch transactions with pagination
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/get`,
          { params, withCredentials: true }
        );

        const { data, pagination } = response.data;
        setTransactions(data || []);
        setTotalPages(pagination?.totalPages || 0);
        setTotalRecords(pagination?.totalRecords || 0);
      } catch (error) {
        console.error("Error fetching transactions:", error.response?.data || error.message);
        setApiAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user?.id, page, search, sort, filterType, limit, refreshTrigger]);

  // Reset page to 1 when search, sort, or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, sort, filterType]);

  // Export to CSV
  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export");
      return;
    }

    const headers = ["ID", "Title", "Amount", "Category", "Date", "Type"];
    const rows = transactions.map((t) => [
      t.id || "",
      t.name || "",
      t.amount || "",
      t.category || "",
      new Date(t.createdAt).toLocaleDateString("en-IN"),
      t.type || "expense",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to Excel
  const exportToExcel = async () => {
    if (transactions.length === 0) {
      alert("No transactions to export");
      return;
    }

    try {
      // Dynamic import - xlsx exports directly, not as .default
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();
      const wsData = [
        ["ID", "Title", "Amount", "Category", "Date", "Type"],
        ...transactions.map((t) => [
          t.id || "",
          t.name || "",
          t.amount || "",
          t.category || "",
          new Date(t.createdAt).toLocaleDateString("en-IN"),
          t.type || "expense",
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "Transactions");
      XLSX.writeFile(wb, `transactions_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export to Excel. Please try CSV instead.");
    }
  };

  return (
    <div className="p-8 ">
      {/* Heading with Export Buttons */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Transactions</h1>
          <p className="text-gray-600">
            All your financial transactions in one place
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            title="Download transactions as CSV"
          >
            <Download size={16} />
            CSV
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            title="Download transactions as Excel"
          >
            <Download size={16} />
            Excel
          </button>
        </div>
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
          {/* Loading State */}
          {loading && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
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

          {/* Search, Sort, and Filter Controls */}
          {!loading && (
            <div className="flex flex-wrap gap-4 mb-6">
              <SearchBar search={search} setSearch={setSearch} />
              <SortDropdown sort={sort} setSort={setSort} />
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(1); // Reset to page 1 on filter change
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-[150px] bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Types</option>
                <option value="budget">Budgets Only</option>
                <option value="expense">Expenses Only</option>
              </select>
            </div>
          )}

          {/* Main card container */}
          {!loading && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-1">Transaction History</h2>
              <p className="text-gray-500 text-sm mb-4">
                Complete list of income and expenses
              </p>

              {/* List */}
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No transactions found</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {transactions.map((item, i) => (
                      <TransactionItem key={i} item={item} />
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
    </div>
  );
}
