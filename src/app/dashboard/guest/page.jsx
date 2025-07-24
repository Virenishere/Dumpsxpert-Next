"use client";

export default function GuestDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Guest Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">Welcome to the Guest Dashboard! Here you can:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Browse available courses</li>
          <li>View free sample questions</li>
          <li>Upgrade to student account</li>
        </ul>
      </div>
    </div>
  );
}