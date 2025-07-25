"use client";

import Profile from '@/components/dashboard/Profile';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">Welcome to the Admin Dashboard! Here you can:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Manage users and roles</li>
            <li>Add/edit exam questions</li>
            <li>View analytics and reports</li>
            <li>Handle user subscriptions</li>
            <li>Moderate content</li>
          </ul>
        </div>
        <Profile />
      </div>
    </div>
  );
}