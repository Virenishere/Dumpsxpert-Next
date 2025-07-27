"use client";

import { useState } from "react";
import { FaChevronRight, FaQuestionCircle } from "react-icons/fa";

const faqData = [
  {
    question: "What is the duration of each course?",
    answer: "Each course varies in duration: Basic (3 months), Intermediate (6 months), and Advanced (9 months).",
  },
  {
    question: "Do I need prior experience to join?",
    answer: "No prior experience is required for the Basic course. Intermediate and Advanced may need some knowledge.",
  },
  {
    question: "Are there any job opportunities after the course?",
    answer: "Yes, we offer placement support and internship opportunities after course completion.",
  },
  {
    question: "Is this course available online or offline?",
    answer: "Currently, we offer offline classes only at our center in Bageshwar, Uttarakhand.",
  },
];

const GeneralFAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
        <FaQuestionCircle className="text-indigo-600" /> Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqData.map((faq, index) => {
          const isOpen = activeIndex === index;

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl shadow-sm transition-all duration-300 bg-white"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left group hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800 text-base">
                  {faq.question}
                </span>
                <FaChevronRight
                  className={`text-gray-600 transition-transform duration-300 transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              <div
                className={`px-6 overflow-hidden text-gray-600 text-sm transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 py-2" : "max-h-0 py-0"
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeneralFAQs;
