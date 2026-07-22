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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={mutation.isPending ? undefined : resetAndClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-200 tracking-tight">Upload Picture</h2>

          <button
            onClick={resetAndClose}
            disabled={mutation.isPending}
            className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload Area */}
        <label className="relative flex h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-800/20 transition-all duration-300 hover:border-indigo-500/50 hover:bg-indigo-500/5 group">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Selected preview"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ImageIcon className="mb-2 h-8 w-8 text-indigo-400" />
                <p className="text-sm font-semibold text-zinc-200">Click to change</p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 rounded-full bg-zinc-800 p-4 group-hover:bg-indigo-500/20 transition-colors duration-300 shadow-inner shadow-black/20">
                <UploadCloud className="h-8 w-8 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <p className="font-semibold text-zinc-300">Click to upload</p>
              <p className="mt-1 text-xs text-zinc-500 font-medium">
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
          <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400 bg-zinc-800/50 p-2 rounded-lg border border-zinc-800">
            <ImageIcon className="h-4 w-4 text-indigo-400 shrink-0" />
            <p className="truncate">{file.name}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={resetAndClose}
            disabled={mutation.isPending}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !file}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 flex items-center gap-2 ${
              mutation.isPending || !file
                ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
            }`}
          >
            {mutation.isPending ? "Uploading..." : "Upload Picture"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {(error || success) && (
        <div
          className={`fixed bottom-10 right-10 z-50 flex items-center gap-3 rounded-2xl px-6 py-4 text-sm font-medium shadow-2xl backdrop-blur-xl border animate-in slide-in-from-bottom-5 duration-300 ${
            error
              ? "bg-zinc-900/95 text-zinc-200 border-red-500/30 shadow-red-500/10"
              : "bg-zinc-900/95 text-zinc-200 border-emerald-500/30 shadow-emerald-500/10"
          }`}
        >
          {error ? (
            <AlertCircle size={20} className="text-red-400" />
          ) : (
            <CheckCircle2 size={20} className="text-emerald-400" />
          )}
          {error || success}
        </div>
      )}
    </div>
  );

  // 4. Return using createPortal to inject directly into the body!
  return createPortal(modalContent, document.body);
}