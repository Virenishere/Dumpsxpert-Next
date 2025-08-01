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
  { label: "Contact Us", path: "/contact" },
  { label: "IT Dumps", path: "/ItDumps" },
  { label: "Blogs", path: "/blogs" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data when session is available
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/user/me");
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("User profile not found. Please try signing out and signing in again.");
            } else if (response.status === 401) {
              throw new Error("Unauthorized: Please sign in again.");
            }
            throw new Error(`Failed to fetch user data: ${response.statusText}`);
          }
          const data = await response.json();
          setUserData(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else if (status === "unauthenticated") {
      setError("Please sign in to view your profile");
      setLoading(false);
    }
  }, [status, session]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Failed to log out. Please try again.");
    }
  };

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

        {/* Profile or Login/Register */}
        {status === "authenticated" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto">
                <Avatar>
                  <AvatarImage src={userData?.profileImage || "https://via.placeholder.com/40"} alt="Profile" />
                  <AvatarFallback>
                    {userData?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold">{userData?.name || session?.user?.email || "User"}</span>
                  <span className="text-sm text-muted-foreground">{userData?.email || session?.user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/guest">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/auth/signin"
            className="hidden lg:inline-block bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login / Register
          </Link>
        )}

        {/* Hamburger Icon (mobile only) */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </Button>
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
                      <AvatarImage src={userData?.profileImage || "https://via.placeholder.com/40"} alt="Profile" />
                      <AvatarFallback>
                        {userData?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{userData?.name || session?.user?.email || "User"}</p>
                      <p className="text-sm text-gray-500">{userData?.email || session?.user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/guest"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-gray-100 text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition"
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
                  className="block w-full text-center bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
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