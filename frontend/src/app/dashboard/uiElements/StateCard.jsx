export default function StatsCard({ title, value, icon: Icon, color, trend }) {
  return (
    <div className="relative w-full bg-white p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Icon - Top Right */}
      <div className={`absolute top-3 right-3 ${color}`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>

      {/* Content */}
      <div className="flex flex-col space-y-1 pr-8 sm:pr-10">
        <h4 className="text-sm sm:text-base font-medium text-gray-800">{title}</h4>
        <span className="text-xl sm:text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-xs sm:text-sm text-gray-600">{trend}</span>
      </div>
    </div>
  );
}
