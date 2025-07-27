"use client";

import Image from "next/image";

const cardData = [
  {
    icon: "/landingassets/downloadable.jpg",
    title: "Downloadable PDF with Questions & Answers",
    description:
      "The Dumpsxpert provides 100% original and verified updated IT Certification Dumps for all exams.",
  },
  {
    icon: "/landingassets/affordable.webp",
    title: "Affordable & Reasonable Price",
    description:
      "You will never have to pay much for these real exam questions. Our prices are very reasonable and affordable.",
  },
  {
    icon: "/landingassets/moneyBack.webp",
    title: "100% Money Back Guarantee",
    description:
      "We provide exact IT exam questions & answers at no risk to you. If our resources do not live up to expectations, you can claim a refund.",
  },
  {
    icon: "/landingassets/support.jpg",
    title: "24/7 Customer Support",
    description:
      "We offer live customer support to make your learning process smooth and effortless. Reach out for any assistance.",
  },
  {
    icon: "/landingassets/freeUpdate.webp",
    title: "Free Updates up to 90 Days",
    description:
      "We provide free 90 days of updates on all IT certification exam preparation materials.",
  },
  {
    icon: "/landingassets/validDumps.webp",
    title: "100% Valid IT Exam Dumps",
    description:
      "Dumpsxpert provides 100% valid IT exam questions and answers for certification success.",
  },
  {
    icon: "/landingassets/freesample.webp",
    title: "Free Sample",
    description:
      "Dumpsxpert provides 100% valid IT exam questions and answers for certification success.",
  },
  {
    icon: "/landingassets/specialDiscount.webp",
    title: "Special Discount Offer",
    description:
      "Dumpsxpert provides 100% valid IT exam questions and answers for certification success.",
  },
];

const UnlockGoals = () => {
  return (
    <div className=" min-h-screen py-10">
      <header className="text-center mb-10 py-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Unlock your IT certification goals with Dumps Xpert
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mt-4">
          Benefits of IT Certification Dumps, Practice Exams and Study Materials
          With Dumpsxpert
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform hover:scale-105"
            >
              <div className="mb-4 flex items-center justify-center">
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-md object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-center">
                {card.title}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm text-center">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UnlockGoals;
