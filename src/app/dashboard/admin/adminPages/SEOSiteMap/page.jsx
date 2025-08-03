"use client";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

const SEOSiteMap = () => {
  const [file, setFile] = useState(null);
  const [sitemaps, setSitemaps] = useState([
    { id: 1, name: "sitemap1.xml" },
    { id: 2, name: "sitemap1.xml" },
    { id: 3, name: "sitemap1.xml" },
    { id: 4, name: "sitemap1.xml" },
  ]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return alert("Please choose a file.");
    // Fake upload logic
    const newEntry = {
      id: Date.now(),
      name: file.name,
    };
    setSitemaps([...sitemaps, newEntry]);
    setFile(null);
    document.getElementById("fileInput").value = null;
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this sitemap?")) return;
    setSitemaps(sitemaps.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Upload Form */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Add SiteMap</h2>
          <div>
            <label className="text-sm text-gray-600 mb-2 block uppercase">
              Upload Sitemap
            </label>
            <div className="flex items-center space-x-4">
              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                className="border rounded px-3 py-2 w-full"
              />
              <button
                onClick={handleUpload}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
              >
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* Sitemap Table */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">All Social link</h2>
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">SR NO.</th>
                <th className="text-left px-4 py-2">File Name</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sitemaps.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded flex items-center gap-1"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {sitemaps.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 py-4">
                    No sitemap uploaded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 mt-6">
          © 2025, made with <span className="text-pink-500">❤️</span> by
        </div>
      </div>
    </div>
  );
};

export default SEOSiteMap;
