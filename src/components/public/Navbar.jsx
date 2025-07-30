"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dumpslogo from "../../assets/landingassets/dumplogo.webp";
import NavbarSearch from "./NavbarSearch";
import { ShoppingCart, Menu, X } from "lucide-react";

const navlinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
  { label: "IT Dumps", path: "/itDumps" },
  { label: "Blogs", path: "/blogs" },
  { label: "Cart", path: "/cart" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white fixed w-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between items-center py-2 lg:px-28 px-4 z-50">
      {/* Logo */}
      <div className="flex items-center cursor-pointer">
        <Link href="/">
          <Image
            src={dumpslogo}
            alt="dumpsxpert logo"
            width={200}
            height={200}
          />
        </Link>
      </div>

      {/* Nav links (desktop only) */}
      <ul className="hidden lg:flex gap-12 font-semibold items-center">
        {navlinks.map((item, index) => (
          <li
            key={index}
            className="hover:text-gray-400 transition-colors duration-200"
          >
            <Link href={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Search Bar (desktop only) */}
        <div className="hidden lg:block">
          <NavbarSearch hideOnLarge={false} />
        </div>

        {/* Cart Icon */}
        <Link
          href="/cart"
          className="hover:text-gray-400 transition-colors duration-200"
        >
          <ShoppingCart />
        </Link>

        {/* Login/Register Button (desktop only) */}
        <Link
          href="/auth/signin"
          className="hidden lg:inline-block bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Login / Register
        </Link>

        {/* Hamburger Icon (mobile only) */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute left-0 top-24 w-full bg-white z-50 px-4 py-4 shadow-md">
          {/* Mobile Search */}
          <NavbarSearch hideOnLarge={true} />

          {/* Links */}
          <ul className="flex flex-col gap-4 font-semibold mt-4">
            {navlinks.map((item, index) => (
              <li key={index}>
                <Link href={item.path} onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li> 
              {/* comment */}
              <Link
                href="/auth/signin"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Login / Register
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
