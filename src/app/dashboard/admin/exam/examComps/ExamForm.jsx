'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function ExamForm({ exam }) {
  const router = useRouter();
  const isEditing = Boolean(exam);

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    eachQuestionMark: "",
    duration: "",
    sampleDuration: "",
    passingScore: "",
    code: "",
    numberOfQuestions: "",
    priceUSD: "",
    priceINR: "",
    mrpUSD: "",
    mrpINR: "",
    status: "unpublished",
    mainInstructions: "",
    sampleInstructions: "",
    lastUpdatedBy: "",
    productId: "",
  });

  const [products, setProducts] = useState([]);

  useEffect(() => setMounted(true), []);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (exam) {
      setFormData({
        ...formData,
        name: exam.name || "",
        eachQuestionMark: exam.eachQuestionMark || "",
        duration: exam.duration || "",
        sampleDuration: exam.sampleDuration || "",
        passingScore: exam.passingScore || "",
        code: exam.code || "",
        numberOfQuestions: exam.numberOfQuestions || "",
        priceUSD: exam.priceUSD || "",
        priceINR: exam.priceINR || "",
        mrpUSD: exam.mrpUSD || "",
        mrpINR: exam.mrpINR || "",
        status: exam.status || "unpublished",
        mainInstructions: exam.mainInstructions || "",
        sampleInstructions: exam.sampleInstructions || "",
        lastUpdatedBy: exam.lastUpdatedBy || "",
        productId: exam.productId || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam]);

  if (!mounted) return null; // prevent SSR errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      eachQuestionMark: Number(formData.eachQuestionMark),
      duration: Number(formData.duration),
      sampleDuration: Number(formData.sampleDuration),
      passingScore: Number(formData.passingScore),
      numberOfQuestions: Number(formData.numberOfQuestions),
      priceUSD: Number(formData.priceUSD),
      priceINR: Number(formData.priceINR),
      mrpUSD: Number(formData.mrpUSD),
      mrpINR: Number(formData.mrpINR),
      productId: formData.productId,
    };

    try {
      if (isEditing) {
        await fetch(`/api/exams/${exam._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/exams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      router.push('/dashboard/admin/exam');
    } catch (err) {
      console.error("Error saving exam:", err);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
        {isEditing ? "Edit Exam" : "Add New Exam"}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {[
            { name: "name", label: "Exam Name", type: "text" },
            { name: "eachQuestionMark", label: "Each Question Mark", type: "number" },
            { name: "duration", label: "Duration (Minutes)", type: "number" },
            { name: "sampleDuration", label: "Sample Duration", type: "number" },
            { name: "passingScore", label: "Passing Score (%)", type: "number" },
            { name: "code", label: "Exam Code", type: "text" },
            { name: "numberOfQuestions", label: "Number of Questions", type: "number" },
            { name: "priceUSD", label: "Price ($)", type: "number" },
            { name: "priceINR", label: "Price (₹)", type: "number" },
            { name: "mrpUSD", label: "MRP ($)", type: "number" },
            { name: "mrpINR", label: "MRP (₹)", type: "number" },
            { name: "lastUpdatedBy", label: "Updated By", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm"
                required
                min={field.type === "number" ? 0 : undefined}
              />
            </div>
          ))}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm"
            >
              <option value="unpublished">Unpublished</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Product Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam For Product</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm"
              required
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ReactQuill */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Instructions</label>
            <ReactQuill
              theme="snow"
              value={formData.mainInstructions}
              onChange={(val) => setFormData(prev => ({ ...prev, mainInstructions: val }))}
              modules={quillModules}
              className="bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sample Instructions</label>
            <ReactQuill
              theme="snow"
              value={formData.sampleInstructions}
              onChange={(val) => setFormData(prev => ({ ...prev, sampleInstructions: val }))}
              modules={quillModules}
              className="bg-white"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow">
            {isEditing ? "Update Exam" : "Save Exam"}
          </button>
        </div>
      </form>
    </div>
  );
}
