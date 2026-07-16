"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_URLS } from "@/constants";
import { ApiResponse, URLS } from "@/types";
import { CopyIcon, Trash2Icon, QrCodeIcon, DownloadIcon, PlusIcon } from "lucide-react";
import QRCode from 'qrcode';
import { useURLStore } from "@/store/urlStore";

export default function DashboardPage() {
  // const [urls, setUrls] = useState<URLS[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const {urls, hydrated, setUrls, invalidate, removeUrl} = useURLStore()

  useEffect(() => {

    if(!hydrated) return

    const fetchUrls = async () => {
      try {
        const response = await fetch("/api/url/get-all-url");
        const result: ApiResponse<URLS[]> = await response.json();
        if (!response.ok || !result.success || !result.data) throw new Error(result.message || "Failed to load URLs.");
        setUrls(result.data);
      } catch (err: any) {
        setError(err.message || "A network error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    if(!urls){
      fetchUrls()
    } else {
      setIsLoading(false)
      return
    }
  }, [hydrated, urls, setUrls]);

  const handleDeleteUrl = async (id: number) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      const res = await fetch("api/url/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const response: ApiResponse<null> = await res.json();
      
      if (!response.success && response.message) {
        setError(response.message);
      } else {
        // Optimistically remove from UI without reloading the page
        // setUrls(prev => prev.filter(url => url.id !== id));
        removeUrl(id)
      }
    } catch (error) {
      setError("Something went wrong deleting the URL.");
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urls)
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "urls.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError("Failed to export URLs.");
    }
  };

  const generateQR = async (url: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(url, { margin: 2, width: 200 });
      setQr(dataUrl);
    } catch (err) {
      setError("Failed to generate QR Code");
    }
  };

  const downloadQR = () => {
    if (!qr) return;
    const a = document.createElement("a");
    a.href = qr;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Links</h1>
          <p className="text-sm text-slate-500 mt-1">Manage, share, and track your shortened URLs.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {urls !== null && urls.length > 0 && (
            <button 
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-all shadow-sm"
            >
              <DownloadIcon className="w-4 h-4" /> Export CSV
            </button>
          )}
          <Link 
            href="/dashboard/create" 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <PlusIcon className="w-4 h-4" /> Create New
          </Link>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">&times;</button>
        </div>
      )}

      {/* URLs Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex flex-col gap-4 animate-pulse">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-lg w-full" />)}
          </div>
        ) : (urls !== null && urls.length > 0) ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Short Link</th>
                  <th className="px-6 py-4 font-semibold">Original URL</th>
                  <th className="px-6 py-4 font-semibold text-center">Clicks</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100">
                {urls.map((url: URLS) => {
                  const fullShortUrl = `${API_URLS.BASE_URL}/${url.shortnedUrl}`;
                  return (
                    <tr key={url.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-6 py-4">
                        <a 
                          href={fullShortUrl} target="_blank" rel="noopener noreferrer"
                          className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline"
                        >
                          {fullShortUrl}
                        </a>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="max-w-[200px] md:max-w-sm truncate text-slate-500" title={url.originalUrl}>
                          {url.originalUrl}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium text-xs">
                          {url.clicks || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                            title="Copy to clipboard"
                            onClick={() => navigator.clipboard.writeText(fullShortUrl)}
                          >
                            <CopyIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                            title="Generate QR"
                            onClick={() => generateQR(fullShortUrl)}
                          >
                            <QrCodeIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                            title="Delete URL"
                            onClick={() => handleDeleteUrl(url.id)}
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <QrCodeIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No links created yet</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm">
              You haven't shortened any URLs yet. Create your first short link to start managing and tracking it here.
            </p>
            <Link href="/dashboard/create" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
              Create Your First Link
            </Link>
          </div>
        )}
      </div>

      {/* QR Code Modal Popup */}
      {qr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl flex flex-col items-center gap-5">
            <div className="w-full flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">QR Code</h3>
              <button onClick={() => setQr(null)} className="text-slate-400 hover:text-slate-600 text-xl font-medium">&times;</button>
            </div>
            
            <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
              <img src={qr} alt="Generated QR Code" className="w-48 h-48" />
            </div>
            
            <div className="flex gap-3 w-full mt-2">
              <button 
                onClick={() => setQr(null)} 
                className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={downloadQR} 
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}