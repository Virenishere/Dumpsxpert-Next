"use client";

import { useState } from "react";
import { FaChevronRight, FaQuestionCircle } from "react-icons/fa";

const faqData = [
  {
    question: "What is the duration of each course?",
    answer:
      "Each course varies in duration: Basic (3 months), Intermediate (6 months), and Advanced (9 months).",
  },
  {
    question: "Do I need prior experience to join?",
    answer:
      "No prior experience is required for the Basic course. Intermediate and Advanced may need some knowledge.",
  },
  {
    question: "Are there any job opportunities after the course?",
    answer:
      "Yes, we offer placement support and internship opportunities after course completion.",
  },
  {
    question: "Is this course available online or offline?",
    answer:
      "Currently, we offer offline classes only at our center in Bageshwar, Uttarakhand.",
  },
];

export default function GeneralFAQs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-gradient-to-br from-white to-gray-50 py-16 px-4 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-900 flex items-center justify-center gap-3">
          <FaQuestionCircle className="text-indigo-600" size={32} />
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqData.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left group focus:outline-none"
                >
                  <span className="text-lg font-medium text-gray-800">
                    {faq.question}
                  </span>
                  <FaChevronRight
                    className={`text-indigo-600 transition-transform duration-300 transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                    size={18}
                  />
                </button>

                <div
                  className={`px-6 transition-all text-gray-700 text-sm ${
                    isOpen
                      ? "max-h-40 opacity-100 py-3"
                      : "max-h-0 opacity-0 py-0"
                  } overflow-hidden duration-300 ease-in-out`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
