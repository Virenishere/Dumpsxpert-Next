import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

import banner from "@/assets/landingassets/banner.webp";
import instance from "./lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 60; // ISR every 60s

export default async function HomePage() {
  // Fetch Data Server-Side (no 'use client', no waterfalling)
  let categories = [];
  let blogs = [];
  let dumps = [];

  try {
    const [categoryRes, blogRes, dumpRes] = await Promise.all([
      instance.get("/api/blog-categories"),
      instance.get("/api/blogs/all?page=1&limit=6"),
      instance.get("/api/product-categories"),
    ]);

    categories = [
      { _id: "all", category: "All" },
      ...(categoryRes.data?.filter((c) => c.category) || []),
    ];

    blogs = blogRes.data?.data || [];
    dumps = dumpRes.data || [];
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
  }

  return (
    <>
      {/* === Hero Section === */}
      <section className="w-full bg-white pt-24 px-4 sm:px-6 lg:px-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Dumpsxpert Provides Best Quality Practice Exams & PDF For All IT
            Certification Exams
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6">
            Get certified on your first attempt with our expertly crafted study
            materials – available in PDF and browser-based practice exam
            formats.
          </p>
          <ul className="space-y-3 text-gray-700 mb-6 text-sm sm:text-base">
            {[
              "100% Valid IT Exam Dumps",
              "100% Money Back Guarantee",
              "24/7 Customer Support",
              "Get 3 Months of Free Updates",
              "Practice Exam with a User-friendly Interface",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="bg-green-500 rounded-full p-1.5 flex items-center justify-center w-7 h-7">
                  <Check className="text-white w-4 h-4" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm sm:text-base text-gray-500">
            ⭐ Rated 4.8 by over 10,000 satisfied customers
          </p>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <Image
            src={banner}
            alt="Professional IT certification preparation"
            className="w-full max-w-[600px] h-auto object-contain"
            placeholder="blur"
            priority
          />
        </div>
      </section>

      {/* === Popular Dumps Section === */}
      <section className="py-16 px-4 md:px-12">
  <h2 className="text-3xl font-bold text-center mb-10">All Other Dumps</h2>

  <div className="flex flex-wrap justify-center gap-3 mb-10">
    {dumps.length > 0 ? (
      dumps.map((dump) => (
        <Button
          key={dump._id}
          variant="secondary"
          className="text-xs sm:text-sm md:text-base bg-[#012147] text-white hover:bg-[#02346d] px-4 py-2"
        >
          {dump.name}
        </Button>
      ))
    ) : (
      <p className="text-center col-span-full text-gray-500">
        No categories found.
      </p>
    )}
  </div>
</section>


      {/* === Blog Section === */}
      <section className="py-20 px-4 md:px-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Blog Categories & Posts
        </h2>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <Button
              key={cat._id}
              variant="outline"
              asChild
              className="capitalize rounded-full"
            >
              <Link
                href={`/?category=${encodeURIComponent(
                  cat.category.toLowerCase()
                )}`}
              >
                {cat.category}
              </Link>
            </Button>
          ))}
        </div>

        {/* Blog Cards */}
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Card
                  key={blog._id}
                  className="hover:shadow-md transition cursor-pointer"
                >
                  <Link href={`/blogs/${blog.slug}`}>
                    {/* Uncomment below if blog image is available */}
                    {/* <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      width={600}
                      height={300}
                      className="h-48 w-full object-cover rounded-t-md"
                    /> */}
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {blog.metaDescription}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button
                asChild
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                <Link href="/blogs">See All Blogs</Link>
              </Button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
