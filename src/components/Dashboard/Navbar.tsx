"use client";
export const dynamic = "force-dynamic"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URLS } from "@/constants";
import { UserInfo } from "@/types";


export default function Navbar() {
  const router = useRouter();
  
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ref to handle clicking outside the modal to close it
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(API_URLS.GET_USER, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json"
          }
        });
        const data = await response.json();

        if (data.success && data.data) {
          setUser(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Close modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  const handleLogout = async () => {
    try {
      // Call your logout endpoint
      await fetch(API_URLS.LOGOUT, { method: "POST", credentials: "include" });
      // Redirect to signin page
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-50">
      
      {/* 1. Top Left: Brand Name */}
      <div className="flex-shrink-0">
        <Link href="/" className="text-xl font-bold text-indigo-600 tracking-tight">
          URL Shortener
        </Link>
      </div>

      {/* 2. Middle: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* Search Icon SVG */}
          <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search your links..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-sm"
        />
      </div>

      {/* 3. Top Right: User Profile & Modal */}
      <div className="flex-shrink-0 relative" ref={modalRef}>
        
        {/* Rounded Div (Avatar trigger) */}
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-transparent hover:border-indigo-200 transition-all focus:outline-none"
        >
          <span className="text-sm font-bold text-indigo-700 uppercase">
            {user?.email ? user.email.charAt(0) : "U"}
          </span>
        </button>

        {/* Modal / Dropdown Menu */}
        {isModalOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 py-4 px-1 animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* User Info Section */}
            <div className="px-4 pb-3 border-b border-slate-100 mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Account
              </p>
              {isLoading ? (
                <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4"></div>
              ) : (
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.email || "No email found"}
                </p>
              )}
            </div>

            {/* Logout Button */}
            <div className="px-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
            
          </div>
        )}
      </div>
    </nav>
  );
}