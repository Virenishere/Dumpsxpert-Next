"use client";

export default function StudentDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">Welcome to the Student Dashboard! Here you can:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Access all practice exams</li>
          <li>Track your progress</li>
          <li>View detailed explanations</li>
          <li>Download study materials</li>
        </ul>
      </div>
    </div>
  );
}