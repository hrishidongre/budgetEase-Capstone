"use client";

import { LayoutDashboard, CreditCard, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const items = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
  { name: "Transactions", href: "/dashboard/transactions", icon: TrendingUp },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export default function SidebarMini() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  // Extract initials from fullName (e.g., "Hrishi Admin" → "HA")
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  const initials = getInitials(user?.fullName);

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
  };

  return (
    <div className="fixed left-0 top-0 hidden md:flex flex-col items-center w-20 h-screen bg-[#1b1b1f] text-white py-6 z-40 gap-2">
      {/* Navigation Icons */}
      <div className="flex flex-col gap-2 mt-6">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={index} href={item.href}>
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer transition ${
                  isActive
                    ? "bg-[#2e2e33] text-teal-400"
                    : "hover:bg-[#2a2a2f] active:bg-[#2e2e33] text-gray-300 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Avatar at Bottom */}
      <div className="mt-auto border-t border-[#2e2e33] pt-4">
        <button
          onClick={handleProfileClick}
          className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-[#2a2a2f] active:bg-[#2e2e33] transition"
        >
          {user ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center font-bold text-sm text-white">
              {initials}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
          )}
        </button>
      </div>
    </div>
  );
}
