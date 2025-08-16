// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { FaCheckCircle, FaChevronRight, FaStar, FaUser } from "react-icons/fa";
// import useCartStore from "@/store/useCartStore";
// import { Toaster, toast } from "sonner";
// import axios from "axios";
// import Breadcrumbs from "@/components/public/Breadcrumbs";

// export default function ProductDetailsPage() {
//   const { coursename, slug } = useParams();
//   const router = useRouter();
//   const [product, setProduct] = useState(null);
//   const [avgRating, setAvgRating] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const reviews = []; // You can plug in real reviews later

//   const handleAddToCart = () => {
//     if (!product) return;
//     const item = {
//       ...product,
//       title: `${product.title} [PDF]`,
//       price: product.dumpsPriceInr || product.dumpsPriceUsd,
//     };
//     useCartStore.getState().addToCart(item);
//     toast.success(`Added ${item.title} to cart!`);
//   };

//   useEffect(() => {
//     async function fetchProduct() {
//       try {
//         const res = await axios.get("http://localhost:3000/api/products");
//         const allProducts = res.data?.data || [];

//         // find product by category & slug
//         const foundProduct = allProducts.find(
//           (p) =>
//             p.category?.toLowerCase() === coursename.toLowerCase() &&
//             p.slug === slug
//         );
//         setProduct(foundProduct || null);

//         // related products from same category except current one
//         setRelatedProducts(
//           allProducts.filter(
//             (p) =>
//               p.category?.toLowerCase() === coursename.toLowerCase() &&
//               p.slug !== slug
//           )
//         );
//       } catch (err) {
//         console.error("Error fetching product:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchProduct();
//   }, [coursename, slug]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-600">Product not found.</p>
//       </div>
//     );
//   }

//   const calculateDiscount = (mrp, price) => {
//     const m = parseFloat(mrp);
//     const p = parseFloat(price);
//     if (!m || !p || m <= p) return 0;
//     return Math.round(((m - p) / m) * 100);
//   };

//   return (
//     <div className="min-h-screen mt-20 bg-white py-10 px-4 md:px-20 text-gray-800">
//       <div className="max-w-5xl mx-auto mb-6">
//         <Breadcrumbs />
//       </div>

//       <div className="flex flex-col md:flex-row gap-10">
//         {/* Left Column - Image */}
//         <div className="md:w-[40%]">
//           <img
//             src={product.imageUrl}
//             alt={product.title}
//             className="w-full rounded-xl object-contain shadow-md max-h-[400px]"
//           />
//           {/* Features */}
//           <div className="flex flex-wrap justify-center gap-6 bg-white border border-gray-200 shadow-sm rounded-xl px-6 py-5 mt-8 text-gray-900 text-sm font-medium">
//             {[
//               "Instant Download After Purchase",
//               "100% Real & Updated Dumps",
//               "100% Money Back Guarantee",
//               "90 Days Free Updates",
//               "24/7 Customer Support",
//             ].map((f, i) => (
//               <div key={i} className="flex items-center gap-2 min-w-[200px]">
//                 <FaCheckCircle className="text-blue-600 text-xl" />
//                 <span>{f}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right Column - Details */}
//         <div className="md:w-[60%] space-y-3">
//           <h1 className="text-3xl font-bold">{product.title}</h1>
//           <p className="text-sm">
//             Exam Code: <strong>{product.sapExamCode}</strong>
//           </p>
//           <p className="text-sm">
//             Category: <strong>{product.category}</strong>
//           </p>

//           {/* Prices */}
//           <div className="mt-4">
//             <p className="text-blue-600 font-bold">
//               ₹{product.dumpsPriceInr.trim()}{" "}
//               <span className="text-red-500 ml-2 line-through">
//                 ₹{product.dumpsMrpInr.trim()}
//               </span>
//               <span className="text-gray-600 text-sm ml-1">
//                 ({calculateDiscount(product.dumpsMrpInr, product.dumpsPriceInr)}%
//                 off)
//               </span>
//             </p>
//             <p>
//               ${product.dumpsPriceUsd}{" "}
//               <span className="text-red-400 font-bold line-through ml-2">
//                 ${product.dumpsMrpUsd}
//               </span>
//               <span className="text-gray-400 font-bold text-sm ml-1">
//                 ({calculateDiscount(product.dumpsMrpUsd, product.dumpsPriceUsd)}%
//                 off)
//               </span>
//             </p>
//             <button
//               onClick={handleAddToCart}
//               className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-4 py-2 rounded"
//             >
//               🛒 Add to Cart
//             </button>
//           </div>

//           {/* Description */}
//           <div className="mt-6">
//             <h2 className="text-lg font-semibold mb-2">Description:</h2>
//             <div
//               className="prose max-w-none text-sm"
//               dangerouslySetInnerHTML={{ __html: product.Description }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Long Description */}
//       {product.longDescription && (
//         <div className="my-10">
//           <h2 className="text-lg font-semibold mb-2">Detailed Overview:</h2>
//           <div
//             className="prose max-w-none text-sm"
//             dangerouslySetInnerHTML={{ __html: product.longDescription }}
//           />
//         </div>
//       )}

//       {/* FAQs */}
//       {product.faqs && product.faqs.length > 0 && (
//         <div className="mt-12">
//           <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
//             <FaUser className="text-blue-600" /> Frequently Asked Questions
//             (FAQs)
//           </h2>
//           <div className="space-y-4">
//             {product.faqs.map((faq, idx) => {
//               const isOpen = activeIndex === idx;
//               return (
//                 <div
//                   key={idx}
//                   className="border border-gray-200 rounded-xl shadow-sm bg-white"
//                 >
//                   <button
//                     onClick={() =>
//                       setActiveIndex(isOpen ? null : idx)
//                     }
//                     className="w-full flex justify-between items-center px-6 py-4 text-left group hover:bg-gray-50"
//                   >
//                     <span className="font-medium text-gray-800">
//                       {faq.question}
//                     </span>
//                     <FaChevronRight
//                       className={`text-gray-600 transform transition-transform ${
//                         isOpen ? "rotate-90" : ""
//                       }`}
//                     />
//                   </button>
//                   {isOpen && (
//                     <div className="px-6 py-2 text-gray-600 text-sm">
//                       <p>{faq.answer}</p>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Related Products */}
//       {relatedProducts.length > 0 && (
//         <div className="mt-16">
//           <h2 className="text-xl font-bold mb-4">Related Products</h2>
//           <div className="flex gap-4 overflow-x-auto">
//             {relatedProducts.map((p) => (
//               <div
//                 key={p._id}
//                 className="min-w-[200px] bg-white border rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md"
//                 onClick={() =>
//                   router.push(`/ItDumps/${coursename}/by-slug/${p.slug}`)
//                 }
//               >
//                 <img
//                   src={p.imageUrl}
//                   alt={p.title}
//                   className="h-32 object-contain w-full mb-2"
//                 />
//                 <h3 className="text-sm font-semibold truncate">{p.title}</h3>
//                 <p className="text-xs text-gray-500 mt-1">
//                   ₹{p.dumpsPriceInr}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <Toaster />
//     </div>
//   );
// }
