"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";

// Simulated server data (deduped by slug)
const allProducts = [
  {
    _id: "1",
    category: "SAP",
    title: "SAP Financials Exam",
    sapExamCode: "SAP-FIN-01",
    dumpsPriceInr: 1999,
    dumpsPriceUsd: 25,
    slug: "sap-financials-exam",
  },
  {
    _id: "2",
    category: "SAP",
    title: "SAP Logistics Exam",
    sapExamCode: "SAP-LOG-02",
    dumpsPriceInr: 1799,
    dumpsPriceUsd: 22,
    slug: "sap-logistics-exam",
  },
  {
    _id: "2",
    category: "SAP",
    title: "SAP Logistics Exam",
    sapExamCode: "SAP-LOG-02",
    dumpsPriceInr: 1799,
    dumpsPriceUsd: 22,
    slug: "sap-logistics-exam",
  },
  {
    _id: "3",
    category: "AWS",
    title: "AWS Solutions Architect",
    sapExamCode: "AWS-SA-01",
    dumpsPriceInr: 2199,
    dumpsPriceUsd: 28,
    slug: "aws-solutions-architect-01",
  },
  {
    _id: "4",
    category: "AWS",
    title: "AWS Solutions Architect",
    sapExamCode: "AWS-SA-02",
    dumpsPriceInr: 3199,
    dumpsPriceUsd: 38,
    slug: "aws-solutions-architect-02",
  },
];

export default function CategoryPage({ params }) {
  const { coursename } = params;
  const [searchTerm, setSearchTerm] = useState("");
  const [showFullText, setShowFullText] = useState(false);

  // Filter by category (case-insensitive)
  const categoryProducts = useMemo(() => {
    return allProducts.filter(
      (p) => p.category.toLowerCase() === coursename.toLowerCase()
    );
  }, [coursename]);

  // Deduplicate by `slug`
  const uniqueProducts = useMemo(() => {
    const seen = new Set();
    return categoryProducts.filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });
  }, [categoryProducts]);

  // Apply search filter
  const filteredProducts = useMemo(() => {
    return uniqueProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sapExamCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [uniqueProducts, searchTerm]);

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-10 bg-gray-100">
      {/* Breadcrumbs */}
      <div className="max-w-5xl mx-auto mb-6">
      <Breadcrumbs/>
      </div>
      <div className="w-full max-w-5xl mx-auto">
        {/* Page Heading */}
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4">
          Latest {coursename.toUpperCase()} Exam Questions & Dumps [2025]
        </h1>

        {/* Description with Read More/Read Less */}
        <p className="text-gray-600 text-base mb-3">
          {showFullText
            ? `DumpsExpert provides the most up-to-date ${coursename} certification dumps. All exam questions are based on the latest formats, helping you practice and pass with confidence.`
            : `${coursename} certification can boost your IT or business career globally. DumpsExpert gives you the latest questions & answers PDF to pass your exam easily and confidently...`}
        </p>
        <button
          className="text-blue-600 text-sm mb-6 hover:underline"
          onClick={() => setShowFullText(!showFullText)}
        >
          {showFullText ? "Read Less" : "Read More"}
        </button>

        {/* Search + Results Counter */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} results
          </p>
          <div className="flex items-center border border-gray-300 rounded-md bg-white shadow-sm w-full sm:w-[400px]">
            <input
              type="text"
              placeholder="Search Exam Code or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 text-sm focus:outline-none"
              aria-label="Search exam code or name"
            />
            <span className="px-4 text-gray-500">🔍</span>
          </div>
        </div>

        {/* Products Table (Desktop) */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
              <table className="min-w-full text-left text-gray-800">
                <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="px-4 py-3">{coursename} Exam Code</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-semibold text-blue-900">
                        {product.sapExamCode}
                      </td>
                      <td className="px-4 py-3">{product.title}</td>
                      <td className="px-4 py-3">
                        <span className="block text-xs text-gray-600">
                          Starting at:
                        </span>
                        <span className="font-semibold">
                          ₹{product.dumpsPriceInr} (${product.dumpsPriceUsd})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/itdumps/${coursename}/${product.slug}`}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md shadow-sm"
                          aria-label={`View details for ${product.title}`}
                        >
                          See Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Products Card View (Mobile) */}
            <div className="md:hidden flex flex-col items-center gap-6 mt-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="relative w-full max-w-sm bg-white rounded-xl shadow border border-gray-200 p-5"
                >
                  <div className="mb-2 text-center">
                    <p className="text-sm text-gray-600">Exam Code</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {product.sapExamCode}
                    </p>
                  </div>
                  <div className="mb-2 text-center">
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-base font-medium">{product.title}</p>
                  </div>
                  <div className="mb-2 text-center">
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-black font-semibold">
                      ₹{product.dumpsPriceInr} (${product.dumpsPriceUsd})
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Link
                      href={`/itdumps/${coursename}/${product.slug}`}
                      className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-sm text-center py-2 rounded-md shadow"
                      aria-label={`View details for ${product.title}`}
                    >
                      See Details
                    </Link>
                  </div>
                  <div className="h-10" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No products available for this category.
          </p>
        )}
      </div>
    </div>
  );
}