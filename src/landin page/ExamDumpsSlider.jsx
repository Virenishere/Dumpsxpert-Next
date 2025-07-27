"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Calendar, FolderOpen } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const examDumps = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect",
    code: "SAA-C03",
    description: "Master AWS fundamentals with real-world scenarios and expert support.",
    updatedOn: "2025-07-26",
    category: "AWS",
    image: "/assets/aws-dump.jpg",
  },
  {
    id: 2,
    title: "Microsoft Azure Fundamentals",
    code: "AZ-900",
    description: "Get started with cloud basics using Azure services.",
    updatedOn: "2025-07-24",
    category: "Azure",
    image: "/assets/azure-dump.jpg",
  },
  {
    id: 3,
    title: "Google Cloud Associate Engineer",
    code: "ACE",
    description: "Learn to deploy and manage Google Cloud infrastructure.",
    updatedOn: "2025-07-22",
    category: "GCP",
    image: "/assets/gcp-dump.jpg",
  },
  {
    id: 4,
    title: "CompTIA Security+",
    code: "SY0-601",
    description: "Understand the foundations of modern cybersecurity.",
    updatedOn: "2025-07-20",
    category: "Security",
    image: "/assets/security-dump.jpg",
  },
  {
    id: 5,
    title: "Cisco CCNA",
    code: "200-301",
    description: "Dive into networking concepts and Cisco solutions.",
    updatedOn: "2025-07-18",
    category: "Cisco",
    image: "/assets/ccna-dump.jpg",
  },
  {
    id: 6,
    title: "AWS Certified Developer",
    code: "DVA-C02",
    description: "Develop, deploy, and debug AWS-based applications.",
    updatedOn: "2025-07-15",
    category: "AWS",
    image: "/assets/aws-dev.jpg",
  },
];

export default function ExamDumpsSlider() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Most Popular IT Certification <span className="text-orange-500">Dumps</span>
        </h2>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {examDumps.map((dump) => (
            <SwiperSlide key={dump.id}>
              <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <img
                  src={dump.image}
                  alt={dump.title}
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {dump.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{dump.code}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow mb-4">
                    {dump.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Updated: {dump.updatedOn}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                    <FolderOpen className="w-4 h-4" /> Category: {dump.category}
                  </div>
                  <button className="mt-auto w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition">
                    View More
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
