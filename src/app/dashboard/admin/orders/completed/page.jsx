"use client";

import { useState } from "react";

const OrdersCompleted = () => {
  const orders = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    customer: `CompletedUser ${i + 1}`,
    date: `2025-06-${(i % 30) + 1}`.padStart(10, "0"),
    total: `$${(150 + i * 5).toFixed(2)}`,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const currentOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Completed Orders</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-zinc-200 dark:border-zinc-700">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-2 text-left border dark:border-zinc-700">Order ID</th>
              <th className="px-4 py-2 text-left border dark:border-zinc-700">Customer</th>
              <th className="px-4 py-2 text-left border dark:border-zinc-700">Date</th>
              <th className="px-4 py-2 text-left border dark:border-zinc-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800">
                <td className="px-4 py-2 border dark:border-zinc-700">{order.id}</td>
                <td className="px-4 py-2 border dark:border-zinc-700">{order.customer}</td>
                <td className="px-4 py-2 border dark:border-zinc-700">{order.date}</td>
                <td className="px-4 py-2 border dark:border-zinc-700">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, idx) => {
          const page = idx + 1;
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 text-sm rounded-md border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersCompleted;
