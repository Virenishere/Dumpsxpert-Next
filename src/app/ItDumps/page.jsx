import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import guarantee from "../../assets/userAssets/guaranteed.png";

// Simulated Server Data Fetch
async function getDumpsData() {
  // This would be an API call or DB query in real case
  return [
    { _id: "1", name: "AWS", image: "https://via.placeholder.com/150?text=AWS" },
    { _id: "2", name: "Azure", image: "https://via.placeholder.com/150?text=Azure" },
    { _id: "3", name: "Cisco", image: "https://via.placeholder.com/150?text=Cisco" },
    { _id: "4", name: "Google Cloud", image: "https://via.placeholder.com/150?text=GCP" },
  ];
}

export default async function ITDumpsPage() {
  const dumpsData = await getDumpsData();

  return (
  <div
      className="relative min-h-screen w-full pt-34 pb-10 px-4 md:px-8"
      style={{
        backgroundImage: `url(${guarantee.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-0" />
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8">
          Unlock Your Potential with IT Certification Dumps
        </h1>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center max-w-2xl mx-auto mb-10 text-gray-900 text-sm sm:text-base font-medium">
          <div className="space-y-3">
            {[
              "Instant Download After Purchase",
              "100% Real & Updated Dumps",
              "100% Money Back Guarantee",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-600 text-xl" />
                {text}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {[
              "90 Days Free Updates",
              "24/7 Customer Support",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-600 text-xl" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap py-10 justify-center gap-4">
          {dumpsData.map((item) => (
            <Link
              key={item._id}
              href={`/ItDumps/${item.name.toLowerCase()}`}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all flex flex-col items-center text-center overflow-hidden w-[160px] sm:w-[170px] md:w-[180px]"
            >
              <div className="h-28 md:h-32 w-full relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="px-2 pb-3">
                <h3 className="text-sm sm:text-base font-medium capitalize text-gray-800 truncate">
                  {item.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
