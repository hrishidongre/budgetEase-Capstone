import { formatDate } from "../utils/formatDate";

export default function ExpenseItem({ title, category, amount, date }) {
  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num || 0);
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{category}</p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-gray-800">{formatCurrency(amount)}</p>
          <p className="text-xs text-gray-500">{formatDate(date)}</p>
        </div>

      </div>
    </div>
  );
}
