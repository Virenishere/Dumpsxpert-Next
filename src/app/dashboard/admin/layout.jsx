"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "./adminComps/AdminSidebar";
export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-gray-100" />;

  const sidebarWidth = sidebarOpen ? "ml-64" : "ml-16";

  return (
    <div className="bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <AdminSidebar />
      </div>

      {/* Content */}
      <div
        className={`transition-all duration-300 ${sidebarWidth} mt-20 p-6`} 
        // mt-20 = pushes below navbar, adjust if your header is taller
      >
        {children}
      </div>
    </div>
  );
}

