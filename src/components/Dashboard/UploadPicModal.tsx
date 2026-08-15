"use client";

import { API_URLS } from "@/constants";
import { useAuthStore } from "@/store/authStrore";
import { ApiResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { X, UploadCloud, ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type UploadModalProps = {
  open: boolean;
  onClose: () => void;
};

const MAX_SIZE_KB = 500;

export default function UploadModal({ open, onClose }: UploadModalProps) {
  // 1. Ensure we only portal on the client to avoid Next.js hydration errors
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { signout, updateDp } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetAndClose = () => {
    setFile(null);
    setPreview(null);
    setError("");
    setSuccess("");
    onClose();
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file chosen");
      throw new Error("No file chosen");
    }

    const formData = new FormData();
    formData.append("image", file);
    
    const res = await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      body: formData
    });

    const resdata: ApiResponse<string> = await res.json();

    if (!res.ok || !resdata.success) {
      throw new Error(resdata?.message || "Upload failed");
    }

    if (!resdata.data) {
      signout();
      throw new Error("No Image Returned, Please sign in again...");
    }
    return resdata;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError("");

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (selectedFile.size > MAX_SIZE_KB * 1024) {
      setError(`File must be under ${MAX_SIZE_KB}KB`);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const mutation = useMutation({
    mutationFn: handleUpload,
    onSuccess: (data: ApiResponse<string>) => {
      setSuccess(data?.message || "Profile picture updated");
      if (data.data) {
        updateDp(data.data);
      }
      setTimeout(() => {
        resetAndClose();
      }, 1200);
    },
    onError: (err: Error) => {
      setError(err.message || "Something went wrong");
    },
  });

  // 2. Only render if open AND mounted
  if (!open || !mounted) return null;

  // 3. The Modal Content
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 selection:bg-emerald-700/30 selection:text-emerald-200">
      {/* Backdrop */}
      <div
        onClick={mutation.isPending ? undefined : resetAndClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-[24px] bg-[#09090A] border border-emerald-900/30 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Subtle Inner Pattern & Glow */}
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[150px] bg-emerald-500/[0.04] blur-[60px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 mb-6 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-white tracking-tight">Upload Picture</h2>

          <button
            onClick={resetAndClose}
            disabled={mutation.isPending}
            className="rounded-full p-2 text-zinc-500 transition-all hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload Area */}
        <label className="relative z-10 flex h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-[#111113] transition-all duration-300 hover:border-emerald-500/50 hover:bg-[#0a0a0c] group shadow-inner">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Selected preview"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ImageIcon className="mb-2 h-8 w-8 text-emerald-500" />
                <p className="text-[13px] font-semibold text-white">Click to change</p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 rounded-full bg-[#050505] border border-white/5 p-4 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300 shadow-inner">
                <UploadCloud className="h-8 w-8 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
              </div>
              <p className="font-semibold text-zinc-300 text-[14px]">Click to upload</p>
              <p className="mt-1.5 text-[11px] text-zinc-500 font-medium">
                PNG, JPG, JPEG (Max {MAX_SIZE_KB}KB)
              </p>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={mutation.isPending}
          />
        </label>

        {/* File Name Display */}
        {file && !error && (
          <div className="relative z-10 mt-4 flex items-center gap-2.5 text-[13px] text-zinc-300 bg-[#111113] p-3 rounded-xl border border-white/5 shadow-inner">
            <ImageIcon className="h-4 w-4 text-emerald-500 shrink-0" />
            <p className="truncate font-medium">{file.name}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="relative z-10 mt-8 flex justify-end gap-3">
          <button
            onClick={resetAndClose}
            disabled={mutation.isPending}
            className="rounded-xl px-5 py-2.5 text-[13px] font-semibold text-zinc-300 bg-[#111113] border border-white/5 hover:bg-[#18181B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            Cancel
          </button>

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !file}
            className={`rounded-xl px-6 py-2.5 text-[13px] font-bold text-white transition-all duration-300 flex items-center gap-2 active:scale-[0.98] ${
              mutation.isPending || !file
                ? "cursor-not-allowed bg-[#111113] border border-white/5 text-zinc-500"
                : "bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 shadow-[0_4px_15px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)]"
            }`}
          >
            {mutation.isPending ? "Uploading..." : "Upload Picture"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {(error || success) && (
        <div
          className={`fixed bottom-10 right-10 z-[10000] flex items-center gap-3 rounded-2xl px-6 py-4 text-[13px] font-medium shadow-2xl backdrop-blur-xl border animate-in slide-in-from-bottom-5 duration-300 ${
            error
              ? "bg-[#09090A] text-zinc-200 border-red-900/50 shadow-[0_10px_30px_rgba(220,38,38,0.15)]"
              : "bg-[#09090A] text-zinc-200 border-emerald-900/50 shadow-[0_10px_30px_rgba(16,185,129,0.15)]"
          }`}
        >
          {error ? (
            <AlertCircle size={20} className="text-red-500" />
          ) : (
            <CheckCircle2 size={20} className="text-emerald-500" />
          )}
          {error || success}
        </div>
      )}
    </div>
  );

  // 4. Return using createPortal to inject directly into the body!
  return createPortal(modalContent, document.body);
}