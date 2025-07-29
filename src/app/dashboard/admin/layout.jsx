"use client";

import React, { useState } from "react";
import AdminSidebar from "./adminComps/AdminSidebar";
import BasicInformation from "./adminPages/BasicInformation/page"; 
import AdminDashboard from "./adminComps/AdminDashboard";

export default function AdminLayoutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleNavigate = (pageKey) => {
    setCurrentPage(pageKey); // updates which page to render
  };

  const renderPage = () => {
    switch (currentPage) {
      case "basic-info":
        return <BasicInformation />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300`}>
        <AdminSidebar onNavigate={handleNavigate} />  {/* <-- Pass it here */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {renderPage()}
      </div>
    </div>
  );
}
