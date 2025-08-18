"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const BlogDetail = () => {
  // Mock current blog
  const blog = {
    title: "Mastering SAP Financials in 2025",
    createdAt: "2025-07-20T10:00:00Z",
    imageUrl: "https://via.placeholder.com/800x400.png?text=SAP+Financials",
    content: `<p>SAP Financials is a core module in SAP ERP systems. It helps businesses track and manage financial conditions.</p><p>In this blog, we will dive deep into the modules, use cases, and why it's important in 2025.</p>`,
    category: "SAP",
    language: "English",
    metaKeywords: "SAP, Finance, ERP, Accounting",
  };

  // Mock recent blogs
  const recentBlogs = [
    {
      _id: "2",
      slug: "sap-mm-module",
      title: "SAP MM Module Explained",
      createdAt: "2025-07-15T09:00:00Z",
      imageUrl: "https://via.placeholder.com/600x300.png?text=SAP+MM",
    },
    {
      _id: "3",
      slug: "future-of-erp",
      title: "The Future of ERP in India",
      createdAt: "2025-07-10T14:00:00Z",
      imageUrl: "https://via.placeholder.com/600x300.png?text=ERP+Future",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Blog Content */}
      <div className="md:col-span-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{blog.title}</h1>

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
              <Link key={b._id} href={`/blogs/${b.slug}`}>
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
