'use client'
import DHeader from './components/dashHeader'
import AddBudgetDialog from "./components/addBudgetDialog"
import AddExpenseDialog from './components/addExpenseDlalog'
import StatsCard from './uiElements/StateCard'
import BudgetCard from './components/BudgetCard'
import Charts from './components/charts'
import RecentTransaction from './components/recentTransaction'
import { Wallet, TrendingUp, TrendingDown,RotateCcw } from 'lucide-react'
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"

export default function Page() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([ {
    title: "Mock Expense",
    category: "Demo",
    amount: 100,
    date: "2025-01-01",
  },]);
  const userId = user?.id;

  const [totals, setTotals] = useState({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
  });
  //This function is for the StateCards to show highlights of the budget
  const fetchTotals = async () => {
  const { data: budgetData, error: budgetError } = await supabase
    .from("budget")
    .select("amount")
    .eq("user_id", userId);

  const { data: expenseData, error: expenseError } = await supabase
    .from("expense")
    .select("amount")
    .eq("user_id", userId);

  if (budgetError || expenseError) {
    console.log("Error fetching totals", budgetError || expenseError);
    return;
  }


  const totalBudget = budgetData.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalSpent = expenseData.reduce((sum, e) => sum + Number(e.amount), 0);
  const remaining = totalBudget - totalSpent;

  setTotals({ totalBudget, totalSpent, remaining });
  };

  // This function fetch chart data for category-wise spending
  const fetchChartData = async () => {
    const { data: budgetData, error: budgetError } = await supabase
      .from("budget")
      .select("category_name, amount")
      .eq("user_id", userId);

    const { data: expenseData, error: expenseError } = await supabase
      .from("expense")
      .select("category_name, amount")
      .eq("user_id", userId);

    if (budgetError || expenseError) {
      return;
    }

    const budgetMap = {};
    for (let b of budgetData) {
      budgetMap[b.category_name] = (budgetMap[b.category_name] || 0) + b.amount;
    }

    const expenseMap = {};
    for (let e of expenseData) {
      expenseMap[e.category_name] = (expenseMap[e.category_name] || 0) + e.amount;
    }

    const categories = new Set([
      ...Object.keys(budgetMap),
      ...Object.keys(expenseMap),
    ]);

    const merged = Array.from(categories).map((category) => ({
      name: category,
      total: budgetMap[category] || 0,
      spent: expenseMap[category] || 0,
    }));

    setChartData(merged);
  };

  

  function getIconForCategory(category) {
  const iconMap = {
    "Entertainment": "🎬",
    "Food & Dining": "🍽️",
    "Transportation": "🚗",
    "Shopping": "🛒",
    "Bills & Utilities": "💡",
    "Healthcare": "🏥",
    "Education": "📚",
    "Others": "📋",
    "Travel":"✈️",
    "Savings":"💰"
  };

  return iconMap[category] || "📦";
}
   
   
  const fetchRecentTransactions = async () => {
  const { data, error } = await supabase
    .from("expense")
    .select("description, category_name, amount, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3); // Get last 5 recent transactions

  if (error) {
    console.log("Error fetching recent transactions:", error);
    return;
  }

  const formatted = data.map(tx => ({
    title: tx.description,
    category: tx.category_name,
    amount: parseFloat(tx.amount),
    date: new Date(tx.created_at).toISOString().split("T")[0],
  })
  );

  setRecentTransactions(formatted);
};

const handleResetData = async () => {

  const confirmed = confirm("Are you sure you want to reset all your data? This cannot be undone.");
  if (!confirmed) return;

  // Delete from expense
  const { error: expenseError } = await supabase
    .from("expense")
    .delete()
    .eq("user_id", userId);

  // Delete from budget
  const { error: budgetError } = await supabase
    .from("budget")
    .delete()
    .eq("user_id", userId);

  if (expenseError || budgetError) {
    console.error("Error resetting data:", expenseError || budgetError);
    alert("Something went wrong while resetting data.");
    return;
  }

  // Refresh UI
  fetchTotals();
  fetchChartData();
  fetchRecentTransactions();
  alert("Your data has been reset.");
};




  useEffect(() => {
    if (userId) {
      fetchTotals();
      fetchChartData(); 
      fetchRecentTransactions();
    }
  }, [userId]);
  

  return (
    <div className="min-h-screen bg-blue-50">
      <DHeader />
      {/* Header Title and Buttons */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
              Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600"> Finances, Organized.</span>
            </h1>
           <div className="w-full flex justify-center sm:justify-start">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <AddBudgetDialog
                  onBudgetAdded={() => {
                    fetchTotals();
                    fetchChartData();
                  }}
                />
                <AddExpenseDialog
                  onExpenseAdded={() => {
                    fetchTotals();
                    fetchChartData();
                    fetchRecentTransactions();
                  }}
                />
                <button
                  onClick={handleResetData}
                  className="flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Budget
                </button>
              </div>
            </div>
          </div>
          {/* Recent Transactions */}
          <div className="w-full md:w-[300px]">
            <RecentTransaction transactions={recentTransactions} />
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Budget"
            value={new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(totals.totalBudget)}
            icon={Wallet}
            color="text-blue-600"
            trend="Monthly allocation"
          />
          <StatsCard
            title="Total Spent"
            value={new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(totals.totalSpent.toFixed(2))}
            icon={TrendingUp}
            color="text-red-600"
            trend={`${((totals.totalSpent / totals.totalBudget) * 100 || 0).toFixed(1)}% of budget`}
          />
          <StatsCard
            title="Remaining"
            value={new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(totals.remaining.toFixed(2))}
            icon={totals.remaining >= 0 ? TrendingDown : TrendingUp}
            color={totals.remaining >= 0 ? "text-green-600" : "text-red-600"}
            trend={totals.remaining >= 0 ? "Under budget" : "Over budget"}
          />
        </div>
      </div>
      {/* Budgets & Chart */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-6">
        <div className="w-full lg:w-1/3 flex flex-col gap-5">
          {chartData.map((item) => (
            <BudgetCard
              key={item.name}
              category={item.name}
              budget={item.total}
              spent={item.spent}
              icon={getIconForCategory(item.name)}
            />
          ))}
        </div>
        <div className="w-full lg:w-2/3">
          <Charts data={chartData} />
        </div>
      </div>
    </div>
  );
}
