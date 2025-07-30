"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";

// 🟢 Mock Data
const mockCategories = [
  { _id: "1", category: "Technology" },
  { _id: "2", category: "Education" },
  { _id: "3", category: "Career" },
  { _id: "4", category: "Coding" },
];

const mockBlogs = Array.from({ length: 15 }, (_, i) => ({
  _id: `${i + 1}`,
  slug: `blog-${i + 1}`,
  title: `Sample Blog Post ${i + 1}`,
  metaDescription: `This is a short description for blog post ${i + 1}.`,
  status: "publish",
  category: mockCategories[i % mockCategories.length].category,
  createdAt: new Date(Date.now() - i * 10000000).toISOString(),
  imageUrl: "https://via.placeholder.com/600x400",
}));

const BlogPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load mock categories
  useEffect(() => {
    setCategories(mockCategories);
  }, []);

  // Load mock blogs
  useEffect(() => {
    setLoading(true);
    const allBlogs = mockBlogs;

    const publishedBlogs = allBlogs.filter((blog) => blog.status === "publish");

    const filteredBlogs = selectedCategory
      ? publishedBlogs.filter(
          (b) =>
            b.category?.toLowerCase() === selectedCategory.toLowerCase()
        )
      : publishedBlogs;

    setBlogs(filteredBlogs);

    const recent = [...publishedBlogs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    setRecentPosts(recent);
    setLoading(false);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      <div
        className="w-full h-80 bg-cover bg-center py-14 px-4 text-white"
        style={{
          backgroundImage:
            "url(https://t3.ftcdn.net/jpg/03/16/91/28/360_F_316912806_RCeHVmUx5LuBMi7MKYTY5arkE4I0DcpU.jpg)",
        }}
      >
        <h1 className="text-4xl pt-24 font-bold text-center mb-6">OUR BLOGS</h1>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-1 rounded-full border ${
              selectedCategory === ""
                ? "bg-white text-black font-semibold"
                : "bg-transparent border-white"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-4 py-1 rounded-full border ${
                selectedCategory === cat.category
                  ? "bg-white text-black font-semibold"
                  : "bg-transparent border-white"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-3/4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-center text-gray-500 col-span-full">
              Loading blogs...
            </p>
          ) : blogs.length === 0 ? (
            <p className="text-gray-600 italic col-span-full">No blogs found.</p>
          ) : (
            blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                slug={blog.slug}
                title={blog.title}
                description={blog.metaDescription}
                date={new Date(blog.createdAt).toLocaleDateString()}
                imageUrl={blog.imageUrl}
              />
            ))
          )}
        </div>

        <div className="w-full lg:w-1/4 space-y-8">
          <input
            type="text"
            placeholder="Search blog..."
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />

          <div>
            <h4 className="text-lg font-semibold mb-2">Recent Posts</h4>
            <ul className="text-sm space-y-2">
              {recentPosts.map((post) => (
                <li key={post._id}>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="text-blue-600 hover:underline block"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
