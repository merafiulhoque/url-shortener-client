"use client";
export const dynamic = "force-dynamic"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStrore";
import { useURLStore } from "@/store/urlStore";
import Image from "next/image";
import { LogOutIcon, Trash2Icon, UploadCloud, Search } from "lucide-react";
import UploadModal from "./UploadPicModal";
import { ApiResponse } from "@/types";
import { useToast } from "../ui/Toast";
import { getPublicId } from "@/actions/getPublicId";
import { ROUTES } from "@/constants";

export default function Navbar() {
  const router = useRouter();
  const { user, hydrated, signin, signout, deleteDp } = useAuthStore();
  const { invalidate } = useURLStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

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

  useEffect(() => {
    setImgError(false);
  }, [user?.profilePic]);

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

  const deleteProfilePicture = async () => {
    if (!(user?.profilePic)) {
      showToast({ text: "No Profile Picture Found", bgColor: "red", duration: 2000 });
      return;
    } else {
      if (!confirm("Are you sure you want to delete your profile picture?")) {
        return;
      }
      
      const publicId = await getPublicId(user.profilePic);
      if (!publicId) {
        showToast({ text: "Invalid Cloudinary URL", bgColor: "red", duration: 2000 });
        return;
      }

      const res = await fetch("/api/delete", {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({
          id: user.id,
          publicId
        })
      });
      const resData: ApiResponse<null> = await res.json();
      if (!resData.success) {
        showToast({ text: resData.message, bgColor: "red", duration: 2000 });
        return;
      }
      showToast({ text: resData.message, bgColor: "green", duration: 2000 });
      deleteDp(user.profilePic);
      return;
    }
  };

  // user is "available" once hydration + fetch finished AND we have a user object
  const userReady = !isLoading && !!user;

  return (
    <nav className="w-full h-16 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-50">

      {/* 1. Top Left: Logo & Brand Name */}
      <div className="shrink-0 flex items-center">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80 active:scale-95 duration-200">
          {/* Custom "W" Logo matching Auth pages */}
          <div className="w-8 h-8 bg-[#0a0a0a] border border-emerald-700/50 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-900/30 shrink-0">
            <span className="text-lg font-bold text-emerald-500 font-serif">W</span>
          </div>
          {/* Removed the 'hidden xs:block' so it's always visible now! */}
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            URL Shortener
          </span>
        </Link>
      </div>

      {/* 2. Middle: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search your links..."
          className="w-full pl-10 pr-4 py-2 bg-[#111113] border border-white/5 rounded-xl text-zinc-200 placeholder-zinc-500 focus:bg-[#141417] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all text-[13px] shadow-inner"
        />
      </div>

      {/* 3. Top Right: User Profile & Modal */}
      <div className="shrink-0 relative" ref={modalRef}>

        {/* Avatar trigger */}
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          disabled={!userReady}
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#111113] flex items-center justify-center border-2 border-white/10 hover:border-emerald-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30 overflow-hidden disabled:cursor-default"
        >
          {!userReady ? (
            // Loading skeleton
            <div className="h-full w-full rounded-full bg-white/5 animate-pulse" />
          ) : user?.profilePic && !imgError ? (
            <Image
              src={user.profilePic}
              alt="Profile Photo"
              height={40}
              width={40}
              className="h-full w-full object-cover rounded-full"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-[13px] sm:text-sm font-bold text-emerald-500 uppercase">
              {user?.email ? user.email.charAt(0) : "?"}
            </span>
          )}
        </button>

        {/* Modal / Dropdown Menu */}
        {isModalOpen && userReady && (
          <div className="absolute right-0 mt-3 w-72 bg-[#09090A]/95 backdrop-blur-xl rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-emerald-900/30 py-3 px-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[100] overflow-hidden">
            
            {/* Subtle Inner Glow */}
            <div className="absolute top-0 right-0 w-full h-[100px] bg-emerald-500/[0.03] blur-[40px] pointer-events-none z-0" />

            {/* User Info Section */}
            <div className="relative z-10 px-3 pb-3 mb-2 border-b border-white/5">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                Account
              </p>
              <div className="flex items-center justify-between gap-2 mt-2">
                <p className="text-[13px] font-medium text-zinc-200 truncate" title={user?.email || ""}>
                  {user?.email || "No email found"}
                </p>
                
                {/* Premium Badge / Upgrade Button */}
                {user.isPremium ? (
                  <span className="shrink-0 inline-flex items-center justify-center px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-black bg-emerald-500 rounded-full shadow-md">
                    Premium
                  </span>
                ) : (
                  <Link 
                    href={ROUTES.GET_PREMIUM}
                    className="shrink-0 inline-flex items-center justify-center px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-b from-emerald-600 to-emerald-800 rounded-full shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:from-emerald-500 hover:to-emerald-700 transition-all active:scale-95"
                  >
                    Upgrade
                  </Link>
                )}
              </div>
            </div>

            {/* Actions List */}
            <div className="relative z-10 flex flex-col gap-1 px-1">
              <button
                onClick={() => {
                  setUploadModalOpen(true);
                  setIsModalOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-[13px] text-zinc-300 rounded-xl hover:bg-white/5 hover:text-white transition-colors font-medium flex items-center gap-3 active:scale-[0.98]"
              >
                <UploadCloud className="h-4 w-4 text-zinc-400" />
                Upload Avatar
              </button>

              <button
                onClick={() => {
                  deleteProfilePicture();
                  setIsModalOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-[13px] text-zinc-300 rounded-xl hover:bg-white/5 hover:text-white transition-colors font-medium flex items-center gap-3 active:scale-[0.98]"
              >
                <Trash2Icon className="h-4 w-4 text-zinc-400" />
                Delete Avatar
              </button>

              <div className="h-px bg-white/5 my-1 mx-2" />

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 text-[13px] text-red-500 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors font-medium flex items-center gap-3 active:scale-[0.98]"
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