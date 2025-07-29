"use client";
import React, { useState, useEffect, useRef } from "react";
import { Calendar, FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3); // Dynamically adjust
  const totalSlides = examDumps.length;
  const trackRef = useRef(null);

  // Update slides per view based on screen size
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth < 640) setSlidesPerView(1);
      else if (window.innerWidth < 1024) setSlidesPerView(2);
      else setSlidesPerView(4);
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? totalSlides - slidesPerView : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev >= totalSlides - slidesPerView ? 0 : prev + 1
    );
  };

  // Autoplay every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [slidesPerView]); // Reset autoplay when slidesPerView changes

  // Smooth transition effect
  useEffect(() => {
    if (trackRef.current) {
      const offset = (currentIndex * 100) / slidesPerView;
      trackRef.current.style.transform = `translateX(-${offset}%)`;
      trackRef.current.style.transition = "transform 0.6s ease-in-out";
    }
  }, [currentIndex, slidesPerView]);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Most Popular IT Certification{" "}
          <span className="text-orange-500">Dumps</span>
        </h2>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="icon" onClick={handlePrev}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden">
          <div
            ref={trackRef}
            className="flex"
            style={{
              width: `${(totalSlides / slidesPerView) * 100}%`,
            }}
          >
            {examDumps.map((dump) => (
              <div
                key={dump.id}
                style={{ flex: `0 0 ${100 / slidesPerView}%` }}
                className="px-2"
              >
                <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <img
                    src={dump.image}
                    alt={dump.title}
                    className="h-40 w-full object-cover"
                  />
                  <CardContent className="flex flex-col flex-grow p-5">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                      {dump.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {dump.code}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow mb-4">
                      {dump.description}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Updated: {dump.updatedOn}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                      <FolderOpen className="w-4 h-4" /> Category: {dump.category}
                    </div>
                    <Button className="mt-auto w-full bg-blue-500 hover:bg-orange-600 text-white">
                      View More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
