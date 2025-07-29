"use client";

import React, { useState } from "react";
import AdminSidebar from "./adminComps/AdminSidebar"; // adjust path if needed
import AdminDashboard from "./adminComps/AdminDashboard"; // adjust path if needed

export default function AdminLayoutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300`}>
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <AdminDashboard />
      </div>
    </div>
  );
}
