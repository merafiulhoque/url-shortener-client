"use client";
export const dynamic = "force-dynamic"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStrore";
import { useURLStore } from "@/store/urlStore";
import Image from "next/image";
import { LogOutIcon, UploadCloud } from "lucide-react";
import UploadModal from "./UploadPicModal";

export default function Navbar() {
  const router = useRouter();
  const { user, hydrated, signin, signout } = useAuthStore();
  const { invalidate } = useURLStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState<boolean>(false)

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (user) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/getUser");
        const data = await response.json();

        if (data.success && data.data) {
          signin(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [user, hydrated]);

  useEffect(()=>{
    setImgError(false)
  }, [user?.profilePic])

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
      const res = await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
      const { success, message } = await res.json();
      signout();
      invalidate();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // user is "available" once hydration + fetch finished AND we have a user object
  const userReady = !isLoading && !!user;

  return (
    <nav className="w-full h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-50">

      {/* 1. Top Left: Brand Name */}
      <div className="shrink-0">
        <Link href="/" className="text-xl font-bold text-indigo-600 tracking-tight">
          URL Shortener
        </Link>
      </div>

      {/* 2. Middle: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
      <div className="shrink-0 relative" ref={modalRef}>

        {/* Avatar trigger */}
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          disabled={!userReady}
          className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center border-2 border-transparent hover:border-indigo-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100 overflow-hidden disabled:cursor-default"
        >
          {!userReady ? (
            // Loading skeleton
            <div className="h-full w-full rounded-full bg-slate-200 animate-pulse" />
          ) : user?.profilePic ? (
            <Image
              src={user.profilePic}
              alt="Profile Photo"
              height={44}
              width={44}
              className="h-full w-full object-cover rounded-full"
              onError={()=> setImgError(true)}
            />
          ) : (
            <span className="text-sm font-semibold text-indigo-700 uppercase">
              {user?.email ? user.email.charAt(0) : "?"}
            </span>
          )}
        </button>

        {/* Modal / Dropdown Menu */}
        {isModalOpen && userReady && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl shadow-slate-200/60 border border-slate-100 py-4 px-1 animate-in fade-in slide-in-from-top-2 duration-200">

            {/* User Info Section */}
            <div className="px-4 pb-3 border-b border-slate-100 mb-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Account
              </p>
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.email || "No email found"}
              </p>
            </div>

            {/* Upload Profile Picture */}
            <div className="px-2">
              <button
                onClick={() => setUploadModalOpen(true)}
                className="w-full text-left px-3 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-50 transition-colors font-medium flex items-center gap-2"
              >
                <UploadCloud className="h-4 w-4" />
                Upload Profile Picture
              </button>
            </div>

            {/* Logout Button */}
            <div className="px-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
              >
                <LogOutIcon className="h-4 w-4" />
                Sign Out
              </button>
            </div>

          </div>
        )}

        {uploadModalOpen && (
          <UploadModal
            open={uploadModalOpen}
            onClose={() => setUploadModalOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}