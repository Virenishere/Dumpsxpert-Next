"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const BlogDetail = ({ params }) => {
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // fetch single blog detail
        const res = await fetch(
          `/api/blogs/slug/${params.slug}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (data?.data) {
          setBlog(data.data);
        }

        // fetch recent blogs (for sidebar)
        const recentRes = await fetch(
          `/api/blogs?limit=5`,
          { cache: "no-store" }
        );
        const recentData = await recentRes.json();

        if (recentData?.data) {
          setRecentBlogs(recentData.data.filter((b) => b.slug !== params.slug));
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.slug]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (!blog) return <p className="p-10 text-center">Blog not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Blog Content */}
      <div className="md:col-span-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {blog.title}
        </h1>

        <div className="text-sm text-gray-500 mb-6">
          Published on{" "}
          {new Date(blog.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-80 object-cover rounded mb-6"
          />
        )}

        <div
          className="prose max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="mt-10 border-t pt-4 text-sm text-gray-500 space-y-2">
          <p>
            <strong>Category:</strong> {blog.category}
          </p>
          <p>
            <strong>Language:</strong> {blog.language}
          </p>
          {blog.metaKeywords && (
            <p>
              <strong>Tags:</strong> {blog.metaKeywords}
            </p>
          )}
        </div>
      </div>

      {/* Other Blogs */}
      {recentBlogs.length > 0 && (
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-6">Other Blogs</h2>
          <div className="space-y-6">
            {recentBlogs.map((b) => (
              <Link key={b._id} href={`/blogsPages/blog/${b.slug || blog._id}`}>
                <Card className="overflow-hidden">
                  {b.imageUrl && (
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="w-full h-36 object-cover"
                    />
                  )}
                  <CardContent className="p-3">
                    <h3 className="text-md font-semibold mb-1 line-clamp-2">
                      {b.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">
                      {new Date(b.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <span className="text-sm text-blue-600 hover:underline">
                      Read more →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
