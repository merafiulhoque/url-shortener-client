"use client";

import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { useAuthStore } from "@/store/authStrore";
import { ApiResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { X, UploadCloud, ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

type UploadModalProps = {
  open: boolean;
  onClose: () => void;
};

const MAX_SIZE_KB = 500;

export default function UploadModal({ open, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { signout } = useAuthStore();
  const { updateDp } = useAuthStore()
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
    })

    const resdata: ApiResponse<string> = await res.json();

    if (!res.ok || !resdata.success) {
      throw new Error(resdata?.message || "Upload failed");
    }

    if(!resdata.data){
      signout()
      throw new Error("No Image Returned, Please sign in again...")
    }
    return resdata
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
      if(data.data){
        updateDp(data.data)
      }
      setTimeout(() => {
        resetAndClose();
      }, 1200);
    },
    onError: (err: Error) => {
      setError(err.message || "Something went wrong");
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={mutation.isPending ? undefined : resetAndClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Upload Picture</h2>

          <button
            onClick={resetAndClose}
            disabled={mutation.isPending}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* Upload Area */}
        <label className="relative flex h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 transition hover:border-indigo-400 hover:bg-indigo-50/50">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Selected preview"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
                <ImageIcon className="mb-2 h-6 w-6 text-white" />
                <p className="text-sm font-medium text-white">Click to change</p>
              </div>
            </>
          ) : (
            <>
              <UploadCloud className="mb-3 h-10 w-10 text-slate-400" />
              <p className="font-medium text-slate-700">Click to upload</p>
              <p className="mt-1 text-sm text-slate-500">
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

        {file && !error && (
          <p className="mt-2 truncate text-xs text-slate-500">{file.name}</p>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={resetAndClose}
            disabled={mutation.isPending}
            className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !file}
            className={`rounded-lg px-4 py-2 font-medium text-white transition ${
              mutation.isPending || !file
                ? "cursor-not-allowed bg-slate-300"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {mutation.isPending ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {(error || success) && (
        <div
          className={`fixed bottom-10 right-10 z-20 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            error
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {error || success}
        </div>
      )}
    </div>
  );
}