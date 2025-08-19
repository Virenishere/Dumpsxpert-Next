"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // ✅ Import router for navigation
import { Calendar, FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ExamDumpsSlider() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const trackRef = useRef(null);
  const router = useRouter(); // ✅ router hook

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();

        // ✅ Normalize API response
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalSlides = products.length;

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? totalSlides - slidesPerView : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev >= totalSlides - slidesPerView ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth < 640) setSlidesPerView(1);
      else if (window.innerWidth < 1024) setSlidesPerView(2);
      else setSlidesPerView(4);
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  useEffect(() => {
    if (totalSlides > 0) {
      const interval = setInterval(() => {
        handleNext();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [slidesPerView, totalSlides]);

  useEffect(() => {
    if (trackRef.current) {
      const offset = (currentIndex * 100) / slidesPerView;
      trackRef.current.style.transform = `translateX(-${offset}%)`;
      trackRef.current.style.transition = "transform 0.6s ease-in-out";
    }
  }, [currentIndex, slidesPerView]);

  return (
    <section className="py-20 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Most Popular IT Certification{" "}
          <span className="text-orange-500">Dumps</span>
        </h2>

        {/* States */}
        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading products...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 dark:text-red-400">{error}</p>
        )}

        {/* Navigation */}
        {totalSlides > 0 && (
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" size="icon" onClick={handlePrev}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Slider */}
        <div className="relative overflow-hidden">
          <div
            ref={trackRef}
            className="flex"
            style={{
              width: `${(totalSlides / slidesPerView) * 100}%`,
            }}
          >
            {products.length > 0 ? (
              products.map((dump) => (
                <div
                  key={dump._id}
                  style={{ flex: `0 0 ${100 / slidesPerView}%` }}
                  className="px-2"
                >
                  <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                    <img
                      src={dump.imageUrl}
                      alt={dump.title}
                      className="h-40 w-full object-cover"
                    />
                    <CardContent className="flex flex-col flex-grow p-5">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        {dump.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {dump.sapExamCode || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow mb-4">
                        {dump.metaDescription || "No description available."}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> Updated:{" "}
                        {dump.updatedAt
                          ? new Date(dump.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                        <FolderOpen className="w-4 h-4" /> Category:{" "}
                        {dump.category || "N/A"}
                      </div>
{/* updted this stuff */}
                      {/* ✅ Route to blogPages/blog/[slug] */}
                      <Button
                        onClick={() =>
                          router.push(`/ItDumps/aws/by-slug/${dump.slug}`)
                        }
                        className="mt-auto w-full bg-[#1A2E33] hover:bg-[#19332d] text-white"
                      >
                        View More
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              !loading &&
              !error && (
                <p className="text-center text-gray-500 dark:text-gray-400 w-full">
                  No products available.
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
