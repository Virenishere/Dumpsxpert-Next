"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import dumpslogo from "../../assets/landingassets/dumplogo.webp";
// import Button from "../ui/Button";
// import Input from "../ui/Input";

export default function Footer() {
  return (
    <footer className="bg-[#1E1E24] text-white text-sm px-4 sm:px-6 lg:px-20 py-10">
      {/* Top Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-gray-600 pb-8">
        {/* Disclaimer */}
        <div>
          <p className="font-semibold">Disclaimer :</p>
          <p className="mt-2">
            We provide top-quality dumps, practice exams, and study materials
            for various certifications. Join us to ensure success in your IT
            career!
          </p>
          <Image
            src={dumpslogo}
            alt="DumpsXpert Logo"
            className="mt-4"
            width={130}
            height={40}
            placeholder="blur"
          />
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/sap-dumps" className="hover:underline">
                SAP Dumps
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/link-name" className="hover:underline">
                Link Name
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <FaFacebookF /> Facebook
            </li>
            <li className="flex items-center gap-2">
              <FaLinkedinIn /> Linkedin
            </li>
            <li className="flex items-center gap-2">
              <FaYoutube /> Youtube
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-2">Subscribe to Our Newsletter</h3>
          {/* <Input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded text-black placeholder-gray-700 bg-white"
          /> */}
          {/* <Button className="bg-blue-600 text-white h-10 w-full mt-2 py-2 rounded hover:bg-blue-700">
            Subscribe
          </Button> */}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center text-center text-gray-400 text-xs mt-4 border-t border-gray-600 pt-4 gap-2">
        <div>
          © 2025 Exam Dump. All Rights Reserved. Designed By Dumpsxpert.Com
        </div>
        <div className="space-x-4">
          <Link href="/guarantee" className="hover:underline">
            Guarantee
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms & Condition
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className="hover:underline">
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
