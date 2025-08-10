"use client"
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Changed import

const AddProductCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("Ready");
  const router = useRouter(); // Changed from useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("status", status);
    formData.append("image", image);
 console.log("Submitting form with data:", {
      name,     
        status,
        image,
    });
    try {
      await axios.post(
        "http://localhost:3000/api/product-categories/add",
        formData
      );
      alert("Category added successfully");
      router.push("/admin/products/categories"); // Changed from navigate
    } catch (err) {
      console.error(
        "❌ Error submitting form:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Product Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          name="status"
        >
          <option value="Ready">Ready</option>
          <option value="Publish">Publish</option>
        </select>

        <input
          type="file"
          name="file"
          accept="image/*"
          className="w-full"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddProductCategory;