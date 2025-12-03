"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  User,
  LogOut,
  X,
  Home,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const items = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
  { name: "Transactions", href: "/dashboard/transactions", icon: TrendingUp },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Extract first name from fullName
  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "User";
  
  // Extract initials from fullName (e.g., "Hrishi Admin" → "HA")
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };
  
  const initials = getInitials(user?.fullName);

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
    onClose();
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-[#1b1b1f] text-white z-50 transition-all duration-300 flex flex-col
      ${open ? "w-64" : "w-20 overflow-hidden"}`}
    >
      {/* Close button (only visible when open) */}
      {open && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-[#2a2a2f] active:bg-[#2e2e33] transition"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>
      )}

      {/* App Logo */}
      <div className={`p-6 text-lg font-bold text-center ${!open && "hidden"}`}>BudgetEase</div>

      {/* Navigation */}
      <nav className={`flex-1 flex flex-col gap-2 ${open ? "px-4 mt-8" : "px-0 items-center mt-8"}`}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center justify-center rounded-lg cursor-pointer transition py-3 ${
                  open ? "gap-3 px-4 w-full" : "w-12 h-12"
                } ${
                  isActive
                    ? "bg-[#2e2e33] text-teal-400"
                    : "hover:bg-[#2a2a2f] active:bg-[#2e2e33] text-gray-300 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {open && <span className="text-sm font-medium">{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className={`border-t border-[#2e2e33] py-4 ${open ? "px-4" : "px-2"}`}>
        <button
          onClick={handleProfileClick}
          className={`flex items-center gap-3 rounded-lg hover:bg-[#2a2a2f] active:bg-[#2e2e33] transition py-2 ${
            open ? "px-3 w-full" : "justify-center w-14 h-14 mx-auto"
          }`}
        >
          {user ? (
            <>
              <div className={`rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center font-bold text-white flex-shrink-0 ${
                open ? "w-10 h-10 text-sm" : "w-12 h-12 text-lg"
              }`}>
                {initials}
              </div>
              {open && <p className="text-sm font-semibold truncate text-left">{firstName}</p>}
            </>
          ) : (
            <>
              <div className={`bg-gray-700 rounded-full flex-shrink-0 animate-pulse ${
                open ? "w-10 h-10" : "w-12 h-12"
              }`}></div>
              {open && <div className="h-4 bg-gray-700 rounded flex-1 animate-pulse"></div>}
            </>
          )}
        </button>

        {/* Logout Button */}
        {open && (
          <>
            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition font-semibold text-sm"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 mt-3 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white rounded-lg transition font-semibold text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
