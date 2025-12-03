"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import SidebarMini from "./components/miniSidebar";
import DashboardTopBar from "./components/Topbar";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(true);  // open full sidebar
  const closeSidebar = () => setOpen(false);   // close full sidebar

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Icon-only sidebar (visible on medium and up) */}
      <SidebarMini />

      {/* Full sidebar overlay (opens on top of content) */}
      <Sidebar open={open} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="md:ml-20 transition-all duration-300">
        {/* TopBar with menu button */}
        <DashboardTopBar toggleSidebar={toggleSidebar} />

        <div className="p-6 bg-white">{children}</div>
      </div>
    </div>
  );
}
