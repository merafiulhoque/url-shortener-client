"use client";
export const dynamic = "force-dynamic"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStrore";
import { useURLStore } from "@/store/urlStore";
import Image from "next/image";
import { DeleteIcon, LogOutIcon, RecycleIcon, Trash2Icon, UploadCloud, Search } from "lucide-react";
import UploadModal from "./UploadPicModal";
import { ApiResponse } from "@/types";
import { useToast } from "../Toast";
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
    <nav className="w-full h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-50">

      {/* 1. Top Left: Brand Name */}
      <div className="shrink-0">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 transition-opacity hover:opacity-80">
          URL Shortener
        </Link>
      </div>

      {/* 2. Middle: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-500" />
        </div>
        <input
          type="text"
          placeholder="Search your links..."
          className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
        />
      </div>

      {/* 3. Top Right: User Profile & Modal */}
      <div className="shrink-0 relative" ref={modalRef}>

        {/* Avatar trigger */}
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          disabled={!userReady}
          className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 hover:border-indigo-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 overflow-hidden disabled:cursor-default"
        >
          {!userReady ? (
            // Loading skeleton
            <div className="h-full w-full rounded-full bg-zinc-700 animate-pulse" />
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
            <span className="text-sm font-bold text-indigo-400 uppercase">
              {user?.email ? user.email.charAt(0) : "?"}
            </span>
          )}
        </button>

        {/* Modal / Dropdown Menu */}
        {isModalOpen && userReady && (
          <div className="absolute right-0 mt-3 w-72 bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black border border-zinc-800 py-3 px-2 animate-in fade-in slide-in-from-top-2 duration-200">

            {/* User Info Section */}
            <div className="px-3 pb-3 mb-2 border-b border-zinc-800">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Account
              </p>
              <div className="flex items-center justify-between gap-2 mt-2">
                <p className="text-sm font-medium text-zinc-200 truncate" title={user?.email || ""}>
                  {user?.email || "No email found"}
                </p>
                
                {/* Premium Badge / Upgrade Button */}
                {user.isPremium ? (
                  <span className="shrink-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                    Premium
                  </span>
                ) : (
                  <Link 
                    href={ROUTES.GET_PREMIUM}
                    className="shrink-0 inline-flex items-center justify-center px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
                  >
                    Upgrade
                  </Link>
                )}
              </div>
            </div>

            {/* Actions List */}
            <div className="flex flex-col gap-1 px-1">
              <button
                onClick={() => {
                  setUploadModalOpen(true);
                  setIsModalOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-zinc-300 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors font-medium flex items-center gap-3"
              >
                <UploadCloud className="h-4 w-4 text-zinc-400" />
                Upload Avatar
              </button>

              <button
                onClick={() => {
                  deleteProfilePicture();
                  setIsModalOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-zinc-300 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors font-medium flex items-center gap-3"
              >
                <Trash2Icon className="h-4 w-4 text-zinc-400" />
                Delete Avatar
              </button>

              <div className="h-px bg-zinc-800 my-1 mx-2" />

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium flex items-center gap-3"
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