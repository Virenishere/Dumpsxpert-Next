"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "./adminComps/AdminSidebar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-100" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300`}>
        <AdminSidebar />
      </div>

      {/* Main Page Content */}
      <div className="flex-1 p-4 overflow-y-auto">{children}</div>
    </div>
  );
}
