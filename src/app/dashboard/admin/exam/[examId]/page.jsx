'use client';
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
});
import 'react-quill/dist/quill.snow.css';
import { useRouter } from 'next/navigation';

const ExamForm = ({ exam }) => {
  const router = useRouter();
  const isEditing = Boolean(exam);
  
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (exam) {
      setFormData({
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
  }, [exam]);

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
      router.push('/admin/exams');
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
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push('/admin/exams')}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back
        </button>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
          {isEditing ? "Edit Exam" : "Add New Exam"}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 shadow p-6 md:p-10 space-y-8"
      >
        {/* Form fields same as before */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
  {[
    {
      name: "name",
      label: "Exam Name",
      placeholder: "e.g. Final Test",
      type: "text",
    },
    {
      name: "eachQuestionMark",
      label: "Each Question Mark",
      placeholder: "e.g. 2",
      type: "number",
    },
    {
      name: "duration",
      label: "Duration (Minutes)",
      placeholder: "e.g. 60",
      type: "number",
    },
    {
      name: "sampleDuration",
      label: "Sample Duration (Minutes)",
      placeholder: "e.g. 30",
      type: "number",
    },
    {
      name: "passingScore",
      label: "Passing Score (%)",
      placeholder: "e.g. 50",
      type: "number",
    },
    {
      name: "code",
      label: "Exam Code",
      placeholder: "e.g. EX-123",
      type: "text",
    },
    {
      name: "numberOfQuestions",
      label: "Number of Questions",
      placeholder: "e.g. 20",
      type: "number",
    },
    {
      name: "priceUSD",
      label: "Price ($)",
      placeholder: "e.g. 10",
      type: "number",
    },
    {
      name: "priceINR",
      label: "Price (₹)",
      placeholder: "e.g. 799",
      type: "number",
    },
    {
      name: "mrpUSD",
      label: "MRP ($)",
      placeholder: "e.g. 10",
      type: "number",
    },
    {
      name: "mrpINR",
      label: "MRP (₹)",
      placeholder: "e.g. 799",
      type: "number",
    },
    {
      name: "lastUpdatedBy",
      label: "Updated By",
      placeholder: "e.g. admin123",
      type: "text",
    },
  ].map((field, i) => (
    <div key={i}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>
      <input
        name={field.name}
        type={field.type}
        value={formData[field.name]}
        onChange={handleChange}
        placeholder={field.placeholder}
        className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm"
        required={[
          "name",
          "duration",
          "numberOfQuestions",
          "lastUpdatedBy",
        ].includes(field.name)}
        min={field.type === "number" ? 0 : undefined}
      />
    </div>
  ))}

  {/* Status */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Status
    </label>
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
</div>
        {/* Product Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam For Product
          </label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm"
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.title} - {product.sapExamCode}
              </option>
            ))}
          </select>
        </div>
        
        {/* ReactQuill Editors */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Exam Instructions
            </label>
            <ReactQuill
              theme="snow"
              placeholder="Enter main exam instructions here..."
              modules={quillModules}
              value={formData.mainInstructions}
              onChange={(content) => setFormData(prev => ({ ...prev, mainInstructions: content }))}
              className="bg-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sample Exam Instructions
            </label>
            <ReactQuill
              theme="snow"
              modules={quillModules}
              value={formData.sampleInstructions}
              onChange={(content) => setFormData(prev => ({ ...prev, sampleInstructions: content }))}
              className="bg-white"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow"
          >
            {isEditing ? "Update Exam" : "Save Exam"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamForm;