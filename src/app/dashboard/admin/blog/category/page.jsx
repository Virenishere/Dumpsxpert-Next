"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
import axios from 'axios';
// import useBlogStore from '@/store/blogStore';

const BlogCategory = () => {
  const router = useRouter();
//   const {
//     blogCategories,
//     setBlogCategories,
//     deleteBlogCategory,
//     fetchBlogCategories,
//     loading,
//     error,
//   } = useBlogStore();

//   const categories = Array.isArray(blogCategories) ? blogCategories : [];
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBlogCategories();
  }, [fetchBlogCategories]);

  const filtered = categories.filter((cat) =>
    cat.sectionName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/blog-categories/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        deleteBlogCategory(id);
        // toast.success('Category deleted successfully');
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
    //   toast.error('Failed to delete category');
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/blog/category/edit/${id}`);
  };

  const handleManage = (cat) => {
    const categoryValue = cat.category || cat.sectionName || cat.name || cat.title || '';
    if (categoryValue) {
      const encoded = encodeURIComponent(categoryValue);
      router.push(`/admin/blog/list?category=${encoded}`);
    } else {
    //   toast.error('Unable to manage blogs: Category value not found');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-xl font-semibold text-gray-700 mb-4">Blog Category</div>

      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Blog Category List</div>
          <Link
            href="/admin/blog/category/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Category
          </Link>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by section name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No categories found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 rounded-tl">Section Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Image</th>
                  <th className="p-3 rounded-tr">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((cat) => (
                  <tr key={cat._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{cat.sectionName}</td>
                    <td className="p-3">{cat.category}</td>
                    <td className="p-3">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.sectionName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td className="px-6 py-4 border border-gray-300 text-center">
                      <button
                        onClick={() => handleEdit(cat._id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          window.confirm('Are you sure?') && handleDelete(cat._id)
                        }
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleManage(cat)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Manage Blogs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 border rounded disabled:opacity-50 hover:bg-gray-200"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 mx-1 border rounded ${
                  page === currentPage ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 mx-1 border rounded disabled:opacity-50 hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCategory;
