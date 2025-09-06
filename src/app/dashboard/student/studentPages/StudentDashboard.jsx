"use client";

import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import PurchasedItemsAccess from "@/components/student/PurchasedItemsAccess";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function StudentDashboard() {
  const router = useRouter();

  const barData = {
    labels: ["Attempt 1", "Attempt 2", "Attempt 3"],
    datasets: [
      {
        label: "Score %",
        data: [83, 92, 89],
        backgroundColor: "#4F46E5",
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [4, 2],
        backgroundColor: ["#22C55E", "#EAB308"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
        <span className="text-indigo-600 text-4xl">📊</span> Student Dashboard
      </h1>

      {/* Top Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* Result Analytics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-md hover:shadow-lg transition duration-300">
            <CardHeader>
              <CardTitle className="text-indigo-600">Result Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <Bar
                  data={barData}
                  options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Completion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center">
            <CardHeader>
              <CardTitle className="text-indigo-600">Course Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-[200px]">
                <Doughnut data={doughnutData} options={{ cutout: "70%" }} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="shadow-md hover:shadow-lg transition duration-300 text-center">
            <CardContent className="flex flex-col items-center pt-6">
              <img
                src="https://via.placeholder.com/100"
                alt="profile"
                className="w-28 h-28 rounded-full border-4 border-indigo-500 mb-4"
              />
              <h3 className="font-bold text-lg mb-1">John Doe</h3>
              <p className="text-gray-500 mb-4">john.doe@example.com</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="default" onClick={() => router.push("/student/edit-profile")}>
                  Edit Profile
                </Button>
                <Button variant="secondary" onClick={() => router.push("/student/change-password")}>
                  Change Password
                </Button>
                <Button variant="destructive" onClick={() => router.push("/student/logout")}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Purchased Items Access Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6 }}
        className="mb-10"
      >
        <PurchasedItemsAccess />
      </motion.div>

      {/* Quick Access Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Exams",
            icon: "📅",
            subtitle: "2 upcoming exams",
            link: "/student/courses-exam",
          },
          {
            title: "Courses",
            icon: "📚",
            subtitle: "4 active courses",
            link: "/student/courses-pdf",
          },
          {
            title: "Results",
            icon: "📈",
            subtitle: "3 attempts recorded",
            link: "/student/results",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <Card className="shadow-md hover:shadow-lg transition duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-600 text-lg">
                  <span className="text-2xl">{item.icon}</span> {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">{item.subtitle}</p>
                <Button
                  className="w-full"
                  onClick={() => router.push(item.link)}
                >
                  View {item.title}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
