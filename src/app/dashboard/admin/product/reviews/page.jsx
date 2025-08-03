"use client";

import React, { useState } from "react";

const mockReviews = [
  {
    id: 1,
    customer: "John Doe",
    rating: 4,
    exam: "SAP FICO",
    comment: "Great course!",
    date: "2024-06-01",
    status: "Unpublish",
  },
  {
    id: 2,
    customer: "Jane Smith",
    rating: 5,
    exam: "SAP ABAP",
    comment: "Very detailed.",
    date: "2024-06-03",
    status: "Publish",
  },
  {
    id: 3,
    customer: "Alice Johnson",
    rating: 3,
    exam: "SAP HANA",
    comment: "Could be better.",
    date: "2024-06-04",
    status: "Publish",
  },
];

const ProductReviews = () => {
  const [search, setSearch] = useState("");

  const filteredReviews = mockReviews.filter((review) =>
    review.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product Reviews</h2>
        <div className="flex items-center space-x-2">
          <select className="border px-2 py-1 rounded">
            <option>All</option>
          </select>
          <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
            Filter
          </button>
          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
            + Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <label>
            Show
            <select className="mx-2 border rounded px-2 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            entries
          </label>
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 px-3 py-1 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 border">Sr. No.</th>
              <th className="p-2 border">Customer Name</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Exam</th>
              <th className="p-2 border">Comment</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review, index) => (
              <tr key={review.id} className="text-center">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{review.customer}</td>
                <td className="p-2 border">{review.rating}</td>
                <td className="p-2 border">{review.exam}</td>
                <td className="p-2 border">{review.comment}</td>
                <td className="p-2 border">{review.date}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      review.status === "Publish"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {review.status}
                  </span>
                </td>
                <td className="p-2 border flex justify-center space-x-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600">
                    Edit
                  </button>
                  <button className="bg-pink-500 text-white px-3 py-1 rounded text-xs hover:bg-pink-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredReviews.length === 0 && (
          <p className="text-center py-4 text-gray-500">No reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
