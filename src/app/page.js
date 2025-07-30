// app/page.tsx or app/home/page.tsx

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import LogoutButton from "@/components/public/LogoutButton";
import Image from "next/image";

import banner from "@/assets/landingassets/banner.webp";
import ExamDumpsSlider from "@/landin page/ExamDumpsSlider";
import UnlockGoals from "@/landin page/UnlockGoals";
import GeneralFAQs from "@/landin page/GeneralFAQs";
import AdminDashboard from "@/app/dashboard/admin/page.jsx"; // Adjust the import path as necessary
import StudentDashboard from "@/app/dashboard/student/studentPages/StudentDashboard"; // Adjust the import path as necessary
import AdminLayout from "@/app/dashboard/admin/layout"; // Adjust the import path as necessary
import StudentLayout from "@/app/dashboard/student/layout"; // Adjust the import path as necessary



export const metadata = {
  title: "Dumpsxpert – #1 IT Exam Dumps Provider",
  description: "Pass your IT certifications in first attempt with trusted exam dumps, practice tests & PDF guides by Dumpsxpert.",
};

export default async function HomePage() {
  const categories = [
    { _id: "all", category: "All" },
    { _id: "cert", category: "Certifications" },
    { _id: "update", category: "Updates" },
  ];

  const blogs = [
    {
      _id: "1",
      slug: "pass-it-certification-first-try",
      title: "How to Pass IT Certification in Your First Attempt",
      metaDescription: "Top techniques and strategies to ensure exam success with confidence.",
    },
    {
      _id: "2",
      slug: "free-exam-prep-checklist",
      title: "Free Exam Preparation Checklist",
      metaDescription: "Download our ultimate checklist to stay on track with your study goals.",
    },
    {
      _id: "3",
      slug: "compare-pdf-vs-online-tests",
      title: "PDF Dumps vs Online Practice – What Works Best?",
      metaDescription: "A side-by-side comparison to help you choose the right learning method.",
    },
  ];

  const dumps = [
    { _id: "d1", name: "AWS Certified Solutions Architect" },
    { _id: "d2", name: "Microsoft Azure Fundamentals" },
    { _id: "d3", name: "Google Cloud Digital Leader" },
    { _id: "d4", name: "Cisco CCNA 200-301" },
    { _id: "d5", name: "CompTIA Security+" },
    { _id: "d6", name: "PMP Project Management Professional" },
    { _id: "d7", name: "Salesforce Administrator (ADM-201)" },
  ];

  return (
    <div className="p-6">
 {/* <StudentLayout>
      <StudentDashboard />
    </StudentLayout> */}
 {/* <AdminLayout>
      <AdminDashboard />
    </AdminLayout> */}
      {/* === Hero Section === */}
      <section className="w-full bg-white pt-24 px-4 sm:px-6 lg:px-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Pass Your IT Certification Exam <span className="text-blue-700">On the First Try</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6">
            Dumpsxpert offers industry-validated study materials, real exam dumps, and browser-based practice tests to help you get certified faster — and smarter.
          </p>
          <ul className="space-y-3 text-gray-700 mb-6 text-sm sm:text-base">
            {[
              "✅ 100% Verified & Up-to-Date Dumps",
              "💰 100% Money Back Guarantee",
              "📞 24/7 Expert Support",
              "🔁 Free Updates for 3 Months",
              "🧪 Realistic Practice Test Interface",
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
            ⭐ Trusted by over <strong>50,000 IT professionals</strong> worldwide. Rated <strong>4.8/5</strong> by verified users.
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
        <h2 className="text-3xl font-bold text-center mb-10">
          Top Trending Certification Dumps
        </h2>
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
          Latest Exam Tips & Insights
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <Button
              key={cat._id}
              variant="outline"
              asChild
              className="capitalize rounded-full"
            >
              <Link href={`/?category=${encodeURIComponent(cat.category.toLowerCase())}`}>
                {cat.category}
              </Link>
            </Button>
          ))}
        </div>

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

            {/* Extra Sections */}
            <ExamDumpsSlider />
            <UnlockGoals />
            <GeneralFAQs />
            <LogoutButton />
          </>
        )}
      </section>
    </div>
  );
}
