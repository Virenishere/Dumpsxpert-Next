'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function InstructionsPage() {
  const [agreed, setAgreed] = useState(false);
  const [mainInstructions, setMainInstructions] = useState("");
  const [exam, setExam] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    const fetchInstructions = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/exams/byId/${id}`);
        const exam = res.data;

        if (!exam?.mainInstructions) {
          setMainInstructions("<p>No instructions available.</p>");
        } else {
          setMainInstructions(exam.mainInstructions);
        }

        setExam(exam);
        console.log("🔥 exam from API:", exam);
      } catch (err) {
        console.error(err);
        setError("Failed to load instructions.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, [id]);

  const handleStart = () => {
    if (!agreed) {
      alert("Please agree to the terms and conditions before starting.");
      return;
    }
    router.push(`/student/courses-exam/test/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 my-16 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">📝 Test Instructions</h1>

      {loading ? (
        <p>Loading instructions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div
          className="prose prose-sm mb-6"
          dangerouslySetInnerHTML={{ __html: mainInstructions }}
        />
      )}

      {!loading && !error && (
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
          <p className="font-semibold mb-2">📋 Please read the following test instructions carefully:</p>

          <li>⏱️ <strong>Duration:</strong> {exam.duration} minutes</li>
          <li>✍️ <strong>Marks per Question:</strong> {exam.eachQuestionMark} marks</li>
          <li>📉 <strong>Negative Marking:</strong> -1 mark per wrong answer</li>
          <li>🔢 <strong>Total Questions:</strong> {exam.numberOfQuestions}</li>
          <li>🎯 <strong>Passing Score:</strong> {exam.passingScore}%</li>
          <li>✅ Mark for review (<span className="text-purple-600 font-medium">purple</span>)</li>
          <li>❌ Skipped (<span className="text-red-600 font-medium">red</span>)</li>
          <li>✔️ Answered (<span className="text-green-600 font-medium">green</span>)</li>
          <li>🚨 Switching tabs more than 5 times will auto-submit your test.</li>
          <li>🚫 Copy-paste and tab switching are restricted.</li>
        </ul>
      )}

      <div className="mt-6 flex items-start gap-2">
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="agree" className="text-sm">
          I have read and agree to the above instructions.
        </label>
      </div>

      <button
        onClick={handleStart}
        disabled={loading || !!error}
        className={`mt-6 w-full py-2 px-4 text-white rounded ${
          agreed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Start Test
      </button>
    </div>
  );
}
