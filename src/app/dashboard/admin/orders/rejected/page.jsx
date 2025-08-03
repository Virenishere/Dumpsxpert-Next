"use client";

import React, { useState } from "react";

const OrdersRejected = () => {
  const ordersData = Array.from({ length: 18 }).map((_, i) => ({
    id: i + 1,
    date: `2025-08-${(i % 28) + 1}`.padStart(10, "0"),
    orderId: `ORD-${1000 + i}`,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    mobile: `12345678${i}`,
    status: "Rejected",
  }));

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(ordersData.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = ordersData.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Rejected Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Mobile</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-4 py-2 border">{order.date}</td>
                <td className="px-4 py-2 border">{order.orderId}</td>
                <td className="px-4 py-2 border">{order.name}</td>
                <td className="px-4 py-2 border">{order.email}</td>
                <td className="px-4 py-2 border">{order.mobile}</td>
                <td className="px-4 py-2 border">
                  <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
        >
          Prev
        </button>

        <div className="space-x-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersRejected;
