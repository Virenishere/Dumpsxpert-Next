"use client"; // Required if you're using the `app/` directory in Next.js

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/product-categories");
        const responseData = res.data;

        if (Array.isArray(responseData)) {
          setCategories(responseData);
        } else if (Array.isArray(responseData.data)) {
          setCategories(responseData.data);
        } else {
          setCategories([]);
          console.warn("Unexpected category response:", responseData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Delete category
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:8000/api/product-categories/${id}`);
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
      } catch (err) {
        alert("Failed to delete category");
        console.error(err);
      }
    }
  };

  // Search filter
  const filtered = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Product Categories</h2>
        <Link href="/product-categories/add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add
          </button>
        </Link>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search categories..."
        className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Loading, Error, Empty */}
      {loading ? (
        <p className="text-center text-gray-600">Loading categories...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">
          No matching categories found.
        </p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cat) => (
              <tr key={cat._id}>
                <td className="border p-2 text-center">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-12 h-12 object-cover rounded mx-auto"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border p-2">{cat.name}</td>
                <td className="border p-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${
                      cat.status === "Publish"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {cat.status || "Ready"}
                  </span>
                </td>
                <td className="border p-2 space-x-2 text-center">
                  <Link href={`/product-categories/edit/${cat._id}`}>
                    <button className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductCategories;
