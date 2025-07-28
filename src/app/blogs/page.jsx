"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import BlogCard from "./BlogCard";

const BASE_URL = "http://localhost:8000";

const BlogPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/blog-categories`);
        const valid = res.data?.filter((c) => !!c.category);
        setCategories(valid);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const categoryQuery = selectedCategory
          ? `&category=${selectedCategory.toLowerCase()}`
          : "";

        const res = await axios.get(
          `${BASE_URL}/api/blogs/all?page=1&limit=20${categoryQuery}`
        );
        const allBlogs = res.data?.data || [];

        const publishedBlogs = allBlogs.filter(
          (blog) => blog.status === "publish"
        );

        const filteredBlogs = selectedCategory
          ? publishedBlogs.filter(
              (b) =>
                b.category?.toLowerCase() ===
                selectedCategory.toLowerCase()
            )
          : publishedBlogs;

        setBlogs(filteredBlogs);

        const recent = [...publishedBlogs]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        setRecentPosts(recent);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
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
