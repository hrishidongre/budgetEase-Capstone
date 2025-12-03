"use client";

import Sidebar from "../dashboard/components/Sidebar";
import Topbar from "../dashboard/components/Topbar";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <Topbar toggleSidebar={() => setOpen(true)} />

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
