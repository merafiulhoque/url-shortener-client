"use client";

import { API_URLS } from "@/constants";
import { X, UploadCloud } from "lucide-react";
import { useState } from "react";

type UploadModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function UploadModal({
  open,
  onClose,
}: UploadModalProps) {

    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState("")

    const handleUpload = async () => {
        if(!file) return
        const formData = new FormData()
        formData.append("image", file)
        const res = await fetch(API_URLS.UPLOAD_PIC, {
            method: "POST",
            credentials: "include",
            body: formData
        })
        const resdata = await res.json()
        setError(resdata.message)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if(!selectedFile) return
        setFile(selectedFile)
    }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upload Picture</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Upload Area */}
        <label className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-blue-500 hover:bg-blue-50">
          <UploadCloud className="mb-3 h-10 w-10 text-gray-500" />

          <p className="font-medium text-gray-700">
            Click to upload
          </p>

          <p className="mt-1 text-sm text-gray-500">
            PNG, JPG, JPEG (Max 5MB)
          </p>

          <input
            type="file"
            accept="image/*"
            className=""
            onChange={handleFileChange}
          />
        </label>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button 
            onClick={handleUpload}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">
            Upload
          </button>
        </div>
      </div>
      {
        error && (
            <div className="fixed right-10 bottom-10 bg-green-700 text-black p-4">
                {error}
            </div>
        )
      }
    </div>
  );
}