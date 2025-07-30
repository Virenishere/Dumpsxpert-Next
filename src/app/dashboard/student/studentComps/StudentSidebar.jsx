"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUser,
  FaSignOutAlt,
  FaShoppingCart,
  FaFileAlt,
} from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Dashboard", to: "/student/dashboard", icon: <FaUser /> },
  { name: "My Orders", to: "/student/orders", icon: <FaShoppingCart /> },
  { name: "My Courses (PDF)", to: "/student/courses-pdf", icon: <FaFileAlt /> },
  { name: "My Courses (Online Exam)", to: "/student/courses-exam/list", icon: <FaFileAlt /> },
  { name: "Result History Tracking", to: "/student/results", icon: <FaFileAlt /> },
  { name: "Edit Profile", to: "/student/edit-profile", icon: <FaUser /> },
  { name: "Change Password", to: "/student/change-password", icon: <FaUser /> },
  { name: "Logout", to: "/logout", icon: <FaSignOutAlt /> },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <Card className="w-68 mt-20 min-h-screen p-4 shadow-lg border bg-white">
      {/* Sidebar Header */}
      <h2 className="text-xl font-bold text-center text-blue-600 mb-6">
        🎓 Student Panel
      </h2>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item, i) => {
          const isActive = pathname === item.to;

          return (
            <Link key={i} href={item.to}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full flex items-center justify-start gap-3 px-4 py-2 rounded-lg text-base ${
                  isActive
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </Card>
  );
}
