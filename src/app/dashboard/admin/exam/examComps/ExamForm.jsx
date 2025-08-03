"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ExamForm = ({ exam, setView }) => {
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
    axios
      .get("/api/products")
      .then((res) => {
        const productList = res.data?.data || res.data;
        setProducts(productList);
      })
      .catch((err) => console.error("Failed to load products:", err));
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    };

    try {
      if (isEditing) {
        await axios.put(`/api/exams/${exam._id}`, payload);
      } else {
        await axios.post("/api/exams", payload);
      }
      setView("list");
    } catch (err) {
      console.error("Failed to save exam:", err.response?.data || err.message);
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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setView("list")}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">
          {isEditing ? "Edit Exam" : "Add New Exam"}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 shadow rounded-xl p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "name", label: "Exam Name", type: "text" },
            { name: "eachQuestionMark", label: "Each Question Mark", type: "number" },
            { name: "duration", label: "Duration (min)", type: "number" },
            { name: "sampleDuration", label: "Sample Duration (min)", type: "number" },
            { name: "passingScore", label: "Passing Score (%)", type: "number" },
            { name: "code", label: "Exam Code", type: "text" },
            { name: "numberOfQuestions", label: "Number of Questions", type: "number" },
            { name: "priceUSD", label: "Price ($)", type: "number" },
            { name: "priceINR", label: "Price (₹)", type: "number" },
            { name: "mrpUSD", label: "MRP ($)", type: "number" },
            { name: "mrpINR", label: "MRP (₹)", type: "number" },
            { name: "lastUpdatedBy", label: "Updated By", type: "text" },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={["name", "duration", "numberOfQuestions", "lastUpdatedBy"].includes(
                  field.name
                )}
                placeholder={field.label}
                className="w-full px-4 py-2 border rounded-lg text-sm shadow-sm"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Product</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-sm shadow-sm"
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

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-sm shadow-sm"
            >
              <option value="unpublished">Unpublished</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Main Instructions</label>
          <ReactQuill
            modules={quillModules}
            value={formData.mainInstructions}
            onChange={(value) => setFormData((prev) => ({ ...prev, mainInstructions: value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sample Instructions</label>
          <ReactQuill
            modules={quillModules}
            value={formData.sampleInstructions}
            onChange={(value) => setFormData((prev) => ({ ...prev, sampleInstructions: value }))}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {isEditing ? "Update Exam" : "Save Exam"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamForm;
