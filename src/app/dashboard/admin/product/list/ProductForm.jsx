"use client"; // Client-side component directive
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import CKEditor components (client-side only)
const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);
const ClassicEditor = dynamic(
  () => import("@ckeditor/ckeditor5-build-classic").then((mod) => mod.default),
  { ssr: false }
);

const ProductForm = ({ mode }) => {
  // Next.js navigation hooks
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  // Form state management
  const [form, setForm] = useState({
    sapExamCode: "",
    title: "",
    price: "",
    category: "",
    status: "",
    action: "",
    image: null,
    samplePdf: null,
    mainPdf: null,
    dumpsPriceInr: "",
    dumpsPriceUsd: "",
    dumpsMrpInr: "",
    dumpsMrpUsd: "",
    comboPriceInr: "",
    comboPriceUsd: "",
    comboMrpInr: "",
    comboMrpUsd: "",
    sku: "",
    longDescription: "",
    Description: "",
    slug: "",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    schema: "",
  });

  // Existing file URLs for edit mode
  const [existingFiles, setExistingFiles] = useState({
    imageUrl: "",
    samplePdfUrl: "",
    mainPdfUrl: "",
  });

  // Component state variables
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    fetch("/api/product-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // Load product data when in edit mode
  useEffect(() => {
    if (mode === "edit" && id) {
      fetch(`/api/products?id=${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch product");
          return res.json();
        })
        .then((res) => {
          if (res.data) {
            const p = res.data;
            setForm((prev) => ({
              ...prev,
              ...p,
              image: null,
              samplePdf: null,
              mainPdf: null,
            }));
            setExistingFiles({
              imageUrl: p.imageUrl || "",
              samplePdfUrl: p.samplePdfUrl || "",
              mainPdfUrl: p.mainPdfUrl || "",
            });
          }
        })
        .catch((err) => {
          console.error("Product load error:", err);
          setError("Failed to load product data");
        });
    }
  }, [mode, id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle file inputs
    if (["image", "samplePdf", "mainPdf"].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    }
    // Handle regular inputs
    else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!form.title || !form.sapExamCode || !form.slug || !form.category) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    // Prepare form data
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      // Only append non-null/undefined values
      if (form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    });

    try {
      // API endpoint based on mode (add/edit)
      const url = mode === "add" ? "/api/products" : "/api/products";
      const method = mode === "add" ? "POST" : "PUT";
      console.log(formData);
      // Send request to API
      const res = await fetch(url, {
        method,
        body: formData,
      });

      // Handle response
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Operation failed");
      }

      // Redirect on success
      router.push("/dashboard/admin/product/list");
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "An error occurred during submission");
    } finally {
      setLoading(false);
    }
  };

  // Delete product handler
  const handleDelete = async () => {
    if (!id) return;

    // Confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      // Send DELETE request
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      // Handle response
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Delete operation failed");
      }

      // Redirect after successful deletion
      router.push("/dashboard/admin/product/list");
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      {/* Form Header */}
      <h2 className="text-xl font-bold mb-4">
        {mode === "add" ? "Add New Product" : "Edit Product"}
      </h2>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">SAP Exam Code*</label>
            <input
              type="text"
              name="sapExamCode"
              value={form.sapExamCode}
              onChange={handleChange}
              placeholder="C_S4FTR_2021"
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Title*</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Product Title"
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Slug*</label>
            <input
              name="slug"
              placeholder="product-slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="border w-full px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">SKU*</label>
            <input
              name="sku"
              placeholder="SKU-001"
              value={form.sku}
              onChange={handleChange}
              required
              className="border w-full px-4 py-2 rounded"
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Dumps Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "dumpsPriceInr", label: "Price (INR)" },
              { name: "dumpsPriceUsd", label: "Price (USD)" },
              { name: "dumpsMrpInr", label: "MRP (INR)" },
              { name: "dumpsMrpUsd", label: "MRP (USD)" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block mb-1">{field.label}</label>
                <input
                  name={field.name}
                  type="number"
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.label}
                  className="border w-full px-4 py-2 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Combo Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "comboPriceInr", label: "Price (INR)" },
              { name: "comboPriceUsd", label: "Price (USD)" },
              { name: "comboMrpInr", label: "MRP (INR)" },
              { name: "comboMrpUsd", label: "MRP (USD)" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block mb-1">{field.label}</label>
                <input
                  name={field.name}
                  type="number"
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.label}
                  className="border w-full px-4 py-2 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Category and Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Category*</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Status*</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Action</label>
            <select
              name="action"
              value={form.action}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">Select Action</option>
              <option value="edit">Edit</option>
              <option value="review">Review</option>
            </select>
          </div>
        </div>

        {/* File Uploads Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">File Uploads</h3>

          {/* Product Image */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Product Image</label>
            {mode === "edit" && existingFiles.imageUrl && (
              <div className="mb-2">
                <img
                  src={existingFiles.imageUrl}
                  alt="Current product"
                  className="w-32 h-32 object-contain border rounded"
                />
                <p className="text-sm text-gray-500 mt-1">Current Image</p>
              </div>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              required={mode === "add"}
            />
          </div>

          {/* Sample PDF */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Sample PDF</label>
            {mode === "edit" && existingFiles.samplePdfUrl && (
              <div className="mb-2">
                <a
                  href={existingFiles.samplePdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Current Sample PDF
                </a>
              </div>
            )}
            <input
              type="file"
              name="samplePdf"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>

          {/* Main PDF */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Main PDF</label>
            {mode === "edit" && existingFiles.mainPdfUrl && (
              <div className="mb-2">
                <a
                  href={existingFiles.mainPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Current Main PDF
                </a>
              </div>
            )}
            <input
              type="file"
              name="mainPdf"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>
        </div>

        {/* Description Editors */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Description</label>
          <CKEditor
            editor={ClassicEditor}
            data={form.Description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setForm((prev) => ({ ...prev, Description: data }));
            }}
            config={{
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "blockQuote",
                "insertTable",
                "undo",
                "redo",
              ],
            }}
          />
        </div>

        {/* SEO Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">SEO Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Meta Title</label>
              <input
                name="metaTitle"
                placeholder="Product Meta Title"
                value={form.metaTitle}
                onChange={handleChange}
                className="border w-full px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Meta Keywords</label>
              <textarea
                name="metaKeywords"
                placeholder="keyword1, keyword2, keyword3"
                value={form.metaKeywords}
                onChange={handleChange}
                rows={2}
                className="border w-full px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Meta Description</label>
              <textarea
                name="metaDescription"
                placeholder="Product description for search engines"
                value={form.metaDescription}
                onChange={handleChange}
                rows={3}
                className="border w-full px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Schema Markup</label>
              <textarea
                name="schema"
                placeholder="JSON-LD Schema"
                value={form.schema}
                onChange={handleChange}
                rows={4}
                className="border w-full px-4 py-2 rounded font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 min-w-[150px]"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              `${mode === "add" ? "Create" : "Update"} Product`
            )}
          </button>

          {mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 min-w-[100px]"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
