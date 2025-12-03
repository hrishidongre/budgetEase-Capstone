"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import OverviewCards from "./UIelement/OverviewCards";
import RecentActivity from "./UIelement/RecentActivity";
import SpendingByCategory from "./UIelement/SpendingByCategory";
import CategorySpendingChart from "./components/charts/CategorySpendingChart";
import BudgetVsExpenseChart from "./components/charts/BudgetVsExpenseChart";
import AddBudgetModal from "@/app/uiElements/modals/AddBudgetModal";
import { Plus, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Analytics state
  const [categorySpending, setCategorySpending] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    if (!user?.id) return;

    const fetchDashboardData = async () => {
      setDataLoading(true);
      setApiError(null);

      try {
        // Check if API endpoints exist via HEAD request
        try {
          await axios.head(`${process.env.NEXT_PUBLIC_API_URL}/api/budget`, {
            withCredentials: true,
            timeout: 3000,
          });
        } catch (err) {
          if (err.response?.status === 404) {
            setApiError("Budget API endpoint not available");
            setDataLoading(false);
            return;
          }
        }

        try {
          await axios.head(`${process.env.NEXT_PUBLIC_API_URL}/api/expense`, {
            withCredentials: true,
            timeout: 3000,
          });
        } catch (err) {
          if (err.response?.status === 404) {
            setApiError("Expense API endpoint not available");
            setDataLoading(false);
            return;
          }
        }

        // Fetch budgets and expenses in parallel
        const [budgetsRes, expensesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/budget`, {
            withCredentials: true,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/expense`, {
            withCredentials: true,
          }),
        ]);

        const budgets = budgetsRes.data?.data || [];
        const expenses = expensesRes.data?.data || [];

        // Calculate derived stats
        const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const totalBalance = totalBudget - totalExpenses;

        // Calculate monthly income and expenses (current month)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const monthlyExpenses = expenses
          .filter((e) => {
            const date = new Date(e.createdAt);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
          })
          .reduce((sum, e) => sum + (e.amount || 0), 0);

        const monthlyIncome = budgets
          .filter((b) => {
            const date = new Date(b.createdAt);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
          })
          .reduce((sum, b) => sum + (b.amount || 0), 0);

        // Calculate monthly savings
        const monthlySavings = monthlyIncome - monthlyExpenses;

        // Recent activity (last 5 expenses)
        const recentActivity = expenses.slice(0, 5).map((e) => ({
          id: e.id,
          title: e.name,
          category: e.category,
          amount: e.amount,
          date: e.createdAt,
          type: "expense",
        }));

        // Spending by category
        const spendingByCategory = expenses.reduce((acc, e) => {
          const existing = acc.find((item) => item.category === e.category);
          if (existing) {
            existing.amount += e.amount;
          } else {
            acc.push({ category: e.category, amount: e.amount });
          }
          return acc;
        }, []);

        setDashboardData({
          budgets,
          expenses,
          totalBalance,
          monthlyExpenses,
          monthlyIncome,
          income: totalBudget,
          savings: monthlySavings,
          recentActivity,
          spendingByCategory,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err.response?.status === 404) {
          setApiError("Backend API not available");
        } else {
          setApiError("Failed to load dashboard data. Please try again.");
        }
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id, refreshTrigger]);

  // Fetch analytics data
  useEffect(() => {
    if (!user?.id) return;

    const fetchAnalyticsData = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError(null);

      try {
        const [catRes, budgetRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/category-spending`, {
            withCredentials: true,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/budget-summary`, {
            withCredentials: true,
          }),
        ]);

        setCategorySpending(catRes.data?.data || []);
        setBudgetSummary(budgetRes.data?.data || null);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setAnalyticsError("Failed to load analytics data");
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user?.id, refreshTrigger]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            You are not logged in
          </h1>
          <p className="text-gray-600 mb-6">Please sign up to continue</p>
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  // Loading skeleton for dashboard data
  if (dataLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome, {user.fullName || "User"}
            </h1>
            <p className="text-gray-500 mt-1">Here's your financial overview.</p>
          </div>
        </div>

        {/* Skeleton loaders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // API error state
  if (apiError) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-center max-w-md">
          Backend API not available. Please start the server.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome, {user.fullName || "User"}
          </h1>
          <p className="text-gray-500 mt-1">
            Here's your financial overview.
          </p>
        </div>
        <button
          onClick={() => setIsBudgetModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add Budget
        </button>
      </div>

      <OverviewCards data={dashboardData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity activities={dashboardData?.recentActivity || []} />
        <SpendingByCategory spending={dashboardData?.spendingByCategory || []} />
      </div>

      {/* Analytics Charts Section */}
      <div className="space-y-8">
        <h2 className="text-xl font-semibold text-gray-900">Analytics - Current Month</h2>
        
        {analyticsError && (
          <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-700">
            {analyticsError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CategorySpendingChart data={categorySpending} />
          <BudgetVsExpenseChart data={budgetSummary || {}} />
        </div>
      </div>

      <AddBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSuccess={() => {
          setIsBudgetModalOpen(false);
          setRefreshTrigger((prev) => prev + 1);
        }}
      />
    </div>
  );
}
