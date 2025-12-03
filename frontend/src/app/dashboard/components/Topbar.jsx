"use client";

import { Menu } from "lucide-react";


export default function DashboardTopBar({ toggleSidebar }) {


  return (
    <div className="flex items-center gap-4 bg-white  border-b-2 border-b-gray-300 px-6 py-4">
      
      {/* Toggle Sidebar Button */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md hover:bg-gray-100 transition"
      >
        <Menu className="w-6 h-6 text-gray-500" />
      </button>

    </div>
  );
}
