import StatCard from "../components/StateCard";
import { DollarSign, CreditCard, TrendingUp, PiggyBank } from "lucide-react";

export default function OverviewCards({ data }) {
  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num || 0);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        title="Total Balance"
        value={formatCurrency(data?.totalBalance || 0)}
        icon={<DollarSign className="w-5 h-5 text-gray-500" />}
        change={`$${(data?.totalBalance || 0).toFixed(2)} available`}
        positive={true}
      />

      <StatCard
        title="Monthly Expenses"
        value={formatCurrency(data?.monthlyExpenses || 0)}
        icon={<CreditCard className="w-5 h-5 text-gray-500" />}
        change={`This month: ${data?.expenses?.filter((e) => {
          const date = new Date(e.createdAt);
          const now = new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length || 0} transactions`}
        positive={false}
      />

      <StatCard
        title="Income"
        value={formatCurrency(data?.income || 0)}
        icon={<TrendingUp className="w-5 h-5 text-gray-500" />}
        change={`Total budgets: ${data?.budgets?.length || 0}`}
        positive={true}
      />

      <StatCard
        title="Monthly Savings"
        value={formatCurrency(data?.savings || 0)}
        icon={<PiggyBank className="w-5 h-5 text-gray-500" />}
        change={
          data?.savings > 0
            ? `This month: +${formatCurrency(data.savings)} saved`
            : data?.savings < 0
            ? `This month: overspent by ${formatCurrency(Math.abs(data.savings))}`
            : "This month: ₹0 saved"
        }
        positive={(data?.savings || 0) > 0}
      />
    </div>
  );
}
