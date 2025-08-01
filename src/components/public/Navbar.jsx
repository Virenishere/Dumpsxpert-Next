"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import dumpslogo from "../../assets/landingassets/dumplogo.webp";
import NavbarSearch from "./NavbarSearch";
import { ShoppingCart, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navlinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "IT Dumps", path: "/ItDumps", dropdownKey: "itDumps" },
  { label: "Blogs", path: "/blogs", dropdownKey: "blogs" },
  { label: "Contact Us", path: "/contact" },
];

const dropdownData = {
  itDumps: ["AWS", "Azure", "Google Cloud", "Salesforce", "Cisco"],
  blogs: ["Certifications", "Study Tips", "Industry Trends", "Product Updates"],
};
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchUserData = async () => {
        try {
          const res = await fetch("/api/user/me");
          if (!res.ok) throw new Error("Failed to fetch user profile.");
          const data = await res.json();
          setUserData(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUserData();
    }
  }, [status, session]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-white fixed w-full shadow z-50 flex justify-between items-center py-2 lg:px-28 px-4">
      {/* Logo */}
      <Link href="/">
        <Image src={dumpslogo} alt="dumpsxpert logo" width={150} height={150} />
      </Link>

      {/* Desktop Nav Links */}
      <ul className="hidden lg:flex gap-10 font-semibold items-center relative">
        {navlinks.map((item, index) => {
          const hasDropdown =
            item.dropdownKey && dropdownData[item.dropdownKey];
          return (
            <li
              key={index}
              className="relative group"
              onMouseEnter={() =>
                hasDropdown && setActiveDropdown(item.dropdownKey)
              }
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.path}
                className="hover:text-gray-500 flex items-center gap-1"
              >
                {item.label}
                {hasDropdown && <span className="text-sm">&#9662;</span>}
              </Link>
              {hasDropdown && activeDropdown === item.dropdownKey && (
                <ul className="absolute top-full left-0  bg-white border rounded-lg shadow-lg w-48 z-50">
                  {dropdownData[item.dropdownKey].map((sub, i) => (
                    <li key={i}>
                      <Link
                        href={`/ItDumps/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden lg:block">
          <NavbarSearch hideOnLarge={false} />
        </div>

        {/* Cart */}
        <Link href="/cart">
          <ShoppingCart className="hover:text-gray-500" />
        </Link>

        {/* Authenticated User */}
        {status === "authenticated" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto">
                <Avatar>
                  <AvatarImage
                    src={
                      userData?.profileImage || "https://via.placeholder.com/40"
                    }
                  />
                  <AvatarFallback>
                    {userData?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {userData?.name || session?.user?.email}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {userData?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/guest">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/auth/signin"
            className="hidden lg:inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Login / Register
          </Link>
        )}

        {/* Mobile menu toggle */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute left-0 top-20 w-full bg-white z-50 px-4 py-4 shadow-md">
          <NavbarSearch hideOnLarge={true} />
          <ul className="flex flex-col gap-4 font-semibold mt-4">
            {navlinks.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block py-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              {status === "authenticated" ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 py-2">
                    <Avatar>
                      <AvatarImage
                        src={
                          userData?.profileImage ||
                          "https://via.placeholder.com/40"
                        }
                      />
                      <AvatarFallback>
                        {userData?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{userData?.name}</p>
                      <p className="text-sm text-gray-500">{userData?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/guest"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-gray-100 text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Dashboard
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Login / Register
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
