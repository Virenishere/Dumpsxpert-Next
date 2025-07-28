// app/itdumps/[categoryName]/page.jsx
import Link from "next/link";

// Simulated server data
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
    _id: "3",
    category: "AWS",
    title: "AWS Solutions Architect",
    sapExamCode: "AWS-SA-01",
    dumpsPriceInr: 2199,
    dumpsPriceUsd: 28,
    slug: "aws-solutions-architect",
  },
];

export default async function CategoryPage({ params }) {
  const categoryName = params.categoryName;
  const products = allProducts.filter(
    (p) => p.category.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {categoryName} Certification Dumps
      </h1>

      {products.length > 0 ? (
        <div className="space-y-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 bg-white shadow"
            >
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-sm text-gray-600">
                Exam Code: {product.sapExamCode}
              </p>
              <p className="mt-1">
                Price: ₹{product.dumpsPriceInr} (${product.dumpsPriceUsd})
              </p>
              <Link
                href={`/product/${product.slug}`}
                className="inline-block mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
              >
                See Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No products found for this category.</p>
      )}
    </div>
  );
}
