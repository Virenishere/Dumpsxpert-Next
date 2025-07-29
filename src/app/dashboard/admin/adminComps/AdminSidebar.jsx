"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChevronDown,
  FaPlusCircle,
  FaCogs,
  FaList,
  FaTachometerAlt,
  FaUser,
  FaBook,
  FaIdBadge,
  FaTags,
  FaClipboardList,
  FaShoppingCart,
  FaCreditCard,
  FaBoxOpen,
  FaGift,
  FaPeopleArrows,
  FaPhotoVideo,
  FaBlog,
  FaEnvelope,
  FaDownload,
  FaTools,
} from "react-icons/fa";
import { FiToggleRight, FiToggleLeft } from "react-icons/fi";
import "./adminSidebar.css";

const iconMap = {
  Dashboard: <FaTachometerAlt size={20} />,
  "Web Customization": <FaTools size={20} />,
  "Basic Information": <FaIdBadge size={20} />,
  "Menu Builder": <FaList size={20} />,
  "Social Links": <FaPeopleArrows size={20} />,
  SEO: <FaTags size={20} />,
  "SEO Meta Info": <FaTags size={20} />,
  "SEO Site Map": <FaTags size={20} />,
  Permalink: <FaList size={20} />,
  "Maintenance Mode": <FaTools size={20} />,
  Announcement: <FaBlog size={20} />,
  Preloader: <FaCogs size={20} />,
  Scripts: <FaTools size={20} />,
  "Mail From Admin": <FaEnvelope size={20} />,
  "Mail To Admin": <FaEnvelope size={20} />,
  Currencies: <FaCreditCard size={20} />,
  "Payment Gateway": <FaCreditCard size={20} />,
  "Shipping Method": <FaBoxOpen size={20} />,
  Products: <FaBoxOpen size={20} />,
  "Product Categories": <FaTags size={20} />,
  "Product List": <FaBoxOpen size={20} />,
  "Product Reviews": <FaClipboardList size={20} />,
  Coupons: <FaGift size={20} />,
  "Coupon List": <FaGift size={20} />,
  Orders: <FaShoppingCart size={20} />,
  "All Orders": <FaShoppingCart size={20} />,
  "Pending Orders": <FaShoppingCart size={20} />,
  "Completed Orders": <FaShoppingCart size={20} />,
  "Rejected Orders": <FaShoppingCart size={20} />,
  "Order Reports": <FaClipboardList size={20} />,
  "Product Sale Report": <FaClipboardList size={20} />,
  Customers: <FaUser size={20} />,
  Exam: <FaBook size={20} />,
  "Online Exam": <FaIdBadge size={20} />,
  Media: <FaPhotoVideo size={20} />,
  "Media List": <FaPhotoVideo size={20} />,
  Blog: <FaBlog size={20} />,
  Category: <FaTags size={20} />,
  Archive: <FaBoxOpen size={20} />,
  Posts: <FaBlog size={20} />,
  Subscribers: <FaPeopleArrows size={20} />,
  "Subscribers List": <FaPeopleArrows size={20} />,
  "Mail to Subscribers": <FaEnvelope size={20} />,
  Downloads: <FaDownload size={20} />,
  "Downloaded Samples": <FaDownload size={20} />,
  Settings: <FaCogs size={20} />,
};

const sidebarItems = [
  {
    sectionTitle: "Admin Panel",
    links: [
      { label: "Dashboard", to: "/dashboard/admin" },
      {
        label: "Web Customization",
        to: "#",
        children: [
          { label: "Basic Information", to: "/dashboard/admin/adminPages/BasicInformation" },
          { label: "Menu Builder", to: "/dashboard/admin/menu-builder" },
          { label: "Social Links", to: "/dashboard/admin/social-links" },
          {
            label: "SEO",
            to: "#",
            children: [
              { label: "SEO Meta Info", to: "/dashboard/admin/seo/meta-info" },
              { label: "SEO Site Map", to: "/dashboard/admin/seo/site-map" },
            ],
          },
          { label: "Permalink", to: "/dashboard/admin/permalink" },
          { label: "Maintenance Mode", to: "/dashboard/admin/maintenance" },
          { label: "Announcement", to: "/dashboard/admin/announcement" },
          { label: "Preloader", to: "/dashboard/admin/preloader" },
        ],
      },
      {
        label: "Products",
        to: "#",
        children: [
          { label: "Product Categories", to: "/dashboard/admin/products/categories" },
          { label: "Product List", to: "/dashboard/admin/products/list" },
          { label: "Product Reviews", to: "/dashboard/admin/products/reviews" },
        ],
      },
      {
        label: "Coupons",
        to: "#",
        children: [{ label: "Coupon List", to: "/dashboard/admin/coupons/list" }],
      },
      {
        label: "Orders",
        to: "#",
        children: [
          { label: "All Orders", to: "/dashboard/admin/orders/all" },
          { label: "Pending Orders", to: "/dashboard/admin/orders/pending" },
          { label: "Completed Orders", to: "/dashboard/admin/orders/completed" },
          { label: "Rejected Orders", to: "/dashboard/admin/orders/rejected" },
        ],
      },
      {
        label: "Exam",
        to: "#",
        children: [{ label: "Exam Code", to: "/dashboard/admin/exam/code" }],
      },
      {
        label: "Blog",
        to: "#",
        children: [
          { label: "Category", to: "/dashboard/admin/blog/category" },
          { label: "Posts", to: "/dashboard/admin/blog/posts" },
        ],
      },
      { label: "Manage General FAQs", to: "/dashboard/admin/general-faqs" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (label) => {
    setOpenItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isPathActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <aside
      className={`h-screen transition-all duration-300 shadow-md overflow-y-auto mt-28 bg-white text-gray-800 
        ${isOpen ? "w-64 p-4" : "w-16 p-2"}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-4">
        {isOpen && <h2 className="text-xl font-semibold">My Admin</h2>}
        <button onClick={() => setIsOpen(!isOpen)} className="ml-auto text-gray-600 hover:text-blue-600">
          {isOpen ? <FiToggleLeft size={24} /> : <FiToggleRight size={24} />}
        </button>
      </div>

      {sidebarItems.map((section, index) => (
        <div key={index} className="mb-6">
          {isOpen && (
            <div className="text-xs uppercase text-gray-500 mb-2 flex items-center gap-2">
              {iconMap[section.sectionTitle] || null}
              {section.sectionTitle}
            </div>
          )}

          <div className="space-y-1">
            {section.links.map((item, idx) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const isExpanded = openItems[item.label];

              return hasChildren ? (
                <div key={idx} className="border rounded-md">
                  <button
                    onClick={() => toggleItem(item.label)}
                    className={`flex items-center justify-between w-full px-2 py-1 rounded hover:bg-blue-50 transition
                      ${isExpanded ? "bg-blue-100" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      {iconMap[item.label] || <FaPlusCircle size={16} />}
                      {isOpen && item.label}
                    </div>
                    {isOpen && (
                      <FaChevronDown
                        className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.children?.map((subItem, subIdx) => (
                        <Link
                          key={subIdx}
                          href={subItem.to}
                          className={`block px-2 py-1 rounded hover:bg-blue-50
                            ${isPathActive(subItem.to) ? "bg-blue-600 text-white font-semibold" : ""}`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={idx}
                  href={item.to}
                  className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-50 
                    ${isPathActive(item.to) ? "bg-blue-600 text-white font-semibold" : ""}`}
                >
                  {iconMap[item.label] || <FaPlusCircle size={16} />}
                  {isOpen && item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
