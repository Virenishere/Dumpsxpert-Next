"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const OrdersAll = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    try {
      const res = await axios.get("http://localhost:8000/api/orders/all", {
        params: { page, limit: itemsPerPage },
      });

      const { data, pagination } = res.data || {};
      setOrders(data || []);
      setTotalPages(pagination?.pages || 1);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>

      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border">Order #</th>
            <th className="px-4 py-2 border">Customer</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Courses</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-2 border">{order.orderNumber}</td>
                <td className="px-4 py-2 border">{order.user?.name || "N/A"}</td>
                <td className="px-4 py-2 border">{order.user?.email || "N/A"}</td>
                <td className="px-4 py-2 border">
                  {order.courseDetails?.map((c, idx) => (
                    <div key={c._id || idx}>
                      {c.name} - ₹{c.price?.toFixed(2)}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(order.purchaseDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border capitalize">{order.status}</td>
                <td className="px-4 py-2 border">
                  ₹{order.totalAmount?.toFixed(2) || "0.00"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            } hover:bg-gray-300`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersAll;
