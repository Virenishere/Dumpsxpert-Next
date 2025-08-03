import React, { useEffect, useState } from "react";
import axios from "axios";

const ExamList = ({ setView, setSelectedExam }) => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/exams")
      .then((res) => setExams(res.data))
      .catch(console.error);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this exam?")) return;
    axios
      .delete(`http://localhost:8000/api/exams/${id}`)
      .then(() => setExams((prev) => prev.filter((e) => e._id !== id)))
      .catch(console.error);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">All Exams</h2>
        <button
          onClick={() => setView("addExam")}
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium shadow transition"
        >
          + Add Exam
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {["Code","Name","Each Q Mark","Duration (min)","Sample Duration","Passing (%)","# Questions","Price ($)","Price (₹)","Updated By","Status","Actions"].map((heading) => (
                <th key={heading} className="px-4 py-3 text-left font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{exam.code}</td>
                <td className="px-4 py-2">{exam.name}</td>
                <td className="px-4 py-2">{exam.eachQuestionMark}</td>
                <td className="px-4 py-2">{exam.duration}</td>
                <td className="px-4 py-2">{exam.sampleDuration}</td>
                <td className="px-4 py-2">{exam.passingScore}%</td>
                <td className="px-4 py-2">{exam.numberOfQuestions}</td>
                <td className="px-4 py-2">${exam.priceUSD}</td>
                <td className="px-4 py-2">₹{exam.priceINR}</td>
                <td className="px-4 py-2">{exam.lastUpdatedBy}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${exam.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {exam.status === "published" ? "Published" : "Unpublished"}
                  </span>
                </td>
                <td className="px-4 py-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedExam(exam);
                      setView("editExam");
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedExam(exam);
                      setView("manageQuestions");
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Manage Q&A
                  </button>
                  <button
                    onClick={() => handleDelete(exam._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {exams.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-6 text-center text-gray-500">
                  No exams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamList;
