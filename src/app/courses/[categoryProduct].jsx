"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export async function getServerSideProps(context) {
  const { categoryName } = context.params;

  // Replace this array with real API data later
  const allProducts = [
    {
      _id: "1",
      category: "SAP",
      title: "SAP Financials Exam",
      sapExamCode: "SAP-FIN-01",
      dumpsPriceInr: 1999,
      dumpsPriceUsd: 25,
      slug: "sap-financials-exam"
    },
    {
      _id: "2",
      category: "SAP",
      title: "SAP Logistics Exam",
      sapExamCode: "SAP-LOG-02",
      dumpsPriceInr: 1799,
      dumpsPriceUsd: 22,
      slug: "sap-logistics-exam"
    },
    {
      _id: "3",
      category: "AWS",
      title: "AWS Solutions Architect",
      sapExamCode: "AWS-SA-01",
      dumpsPriceInr: 2199,
      dumpsPriceUsd: 28,
      slug: "aws-solutions-architect"
    }
  ];

  const filtered = allProducts.filter(
    (item) => item.category.toLowerCase() === categoryName.toLowerCase()
  );

  return {
    props: {
      products: filtered,
      categoryName
    }
  };
}

const CategoryProducts = ({ products, categoryName }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFullText, setShowFullText] = useState(false);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sapExamCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-34 pb-12 px-4 md:px-10 bg-[#f3f4f6]">
      <div className="w-full max-w-[1280px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-2">
          Latest {categoryName.toUpperCase()} Exam Questions and Answers
          [Updated for 2025]: {categoryName.toUpperCase()} Certification Dumps
        </h1>

        <p className="text-gray-600 my-5 text-lg sm:text-base mb-2">
          {showFullText
            ? `The greatest source for up-to-date ${categoryName} certification dumps is DumpsExpert. For your SAP certification tests, we provide straightforward and easy-to-understand SAP exam questions.`
            : `SAP Certification can be a game changer for your career...`}
        </p>

        <button
          className="text-blue-600 text-sm mb-6 hover:underline"
          onClick={() => setShowFullText(!showFullText)}
        >
          {showFullText ? "Read Less" : "Read More"}
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <p className="text-sm font-medium text-gray-700">
            Showing all {filteredProducts.length} results
          </p>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full sm:w-[400px] bg-white shadow-sm">
            <input
              type="text"
              placeholder="Search Your Exam Code / Exam Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 text-sm focus:outline-none"
            />
            <button className="bg-blue-800 text-white px-4 py-2">🔍</button>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto bg-white shadow text-2xl rounded-lg border border-gray-200">
              <table className="min-w-full text-xl text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xl border-b">
                  <tr>
                    <th className="px-4 py-3">{categoryName} Exam. Code</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">{categoryName} Details</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-semibold text-blue-900 whitespace-nowrap">
                        {product.sapExamCode}
                      </td>
                      <td className="px-4 py-3">{product.title}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="block text-xs text-gray-600">
                          Starting at:
                        </span>
                        <span className="text-black font-semibold">
                          ₹{product.dumpsPriceInr} (${product.dumpsPriceUsd})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/product/${product.slug}`}
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-4 py-2 rounded-md shadow-sm"
                        >
                          See Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden flex flex-col items-center justify-center space-y-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="relative w-full max-w-sm bg-white rounded-xl shadow border border-gray-200 p-5"
                >
                  <div className="mb-1 text-center">
                    <p className="text-sm text-gray-600">Exam Code</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {product.sapExamCode}
                    </p>
                  </div>
                  <div className="mb-1 text-center">
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-base font-medium">{product.title}</p>
                  </div>
                  <div className="mb-1 text-center">
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-black font-semibold">
                      ₹{product.dumpsPriceInr} (${product.dumpsPriceUsd})
                    </p>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <Link
                      href={`/product/${product.slug}`}
                      className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-sm text-center py-2 rounded-md shadow-md"
                    >
                      See Details
                    </Link>
                  </div>
                  <div className="h-12" />
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
};

export default CategoryProducts;