"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_URLS } from "@/constants";
import { ApiResponse, URLS } from "@/types";
import { CopyIcon, Trash2Icon, QrCodeIcon, DownloadIcon, PlusIcon, Link2Off } from "lucide-react";
import QRCode from 'qrcode';
import { useURLStore } from "@/store/urlStore";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const { urls, hydrated, getUrls, removeUrl } = useURLStore()

  useEffect(() => {
    if (!hydrated) return;

    if (!urls) {
      getUrls();
      setIsLoading(false);
      return;
    } else {
      setIsLoading(false);
      return;
    }
  }, [hydrated, urls, getUrls]);

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
        removeUrl(id);
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
      // Keep QR code white background for reliable scanning
      const dataUrl = await QRCode.toDataURL(url, { margin: 2, width: 200, color: { dark: '#09090b', light: '#ffffff' } });
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
    <div className="w-full bg-zinc-800 max-w-full mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Your Links
          </h1>
          <p className="text-sm text-zinc-400 mt-2">Manage, share, and track your shortened URLs.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {urls !== null && urls.length > 0 && (
            <button 
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 text-zinc-400 text-sm font-medium rounded-xl transition-all shadow-sm"
            >
              <DownloadIcon className="w-4 h-4" /> Export CSV
            </button>
          )}
          <Link 
            href="/dashboard/create" 
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            <PlusIcon className="w-4 h-4" /> Create New
          </Link>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-between animate-in slide-in-from-top-2">
          <span className="font-medium">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400/70 hover:text-red-400 text-xl font-bold transition-colors">&times;</button>
        </div>
      )}

      {/* URLs Table Container */}
      <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 border border-zinc-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-zinc-800/50 rounded-xl w-full animate-pulse" />
            ))}
          </div>
        ) : (urls !== null && urls.length > 0) ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-xs font-semibold">
                <tr>
                  <th className="px-6 py-5">Short Link</th>
                  <th className="px-6 py-5">Original URL</th>
                  <th className="px-6 py-5 text-center">Clicks</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-zinc-800/50">
                {urls.map((url: URLS) => {
                  const fullShortUrl = `${API_URLS.BASE_URL}/${url.shortnedUrl}`;
                  return (
                    <tr key={url.id} className="hover:bg-zinc-800/40 transition-colors group">
                      <td className="px-6 py-4">
                        <a 
                          href={fullShortUrl} target="_blank" rel="noopener noreferrer"
                          className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors flex items-center gap-2"
                        >
                          {fullShortUrl}
                        </a>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="max-w-[200px] md:max-w-sm truncate text-zinc-500" title={url.originalUrl}>
                          {url.originalUrl}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-full font-medium text-xs shadow-inner shadow-black/20">
                          {url.clicks || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button 
                            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 rounded-lg transition-all" 
                            title="Copy to clipboard"
                            onClick={() => navigator.clipboard.writeText(fullShortUrl)}
                          >
                            <CopyIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all" 
                            title="Generate QR"
                            onClick={() => generateQR(fullShortUrl)}
                          >
                            <QrCodeIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" 
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
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="h-20 w-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600 mb-6 shadow-inner shadow-black/20">
              <Link2Off className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-zinc-200 mb-2">No links created yet</h3>
            <p className="text-sm text-zinc-500 mb-8 max-w-sm leading-relaxed">
              You haven't shortened any URLs yet. Create your first short link to start managing and tracking it here.
            </p>
            <Link 
              href="/dashboard/create" 
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
            >
              Create Your First Link
            </Link>
          </div>
        )}
      </div>

      {/* QR Code Modal Popup */}
      {qr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200">
            <div className="w-full flex justify-between items-center">
              <h3 className="text-lg font-bold text-zinc-200">Scan QR Code</h3>
              <button 
                onClick={() => setQr(null)} 
                className="text-zinc-500 hover:text-zinc-300 text-2xl font-light transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="bg-white p-3 rounded-2xl border-4 border-zinc-800 shadow-inner">
              <img src={qr} alt="Generated QR Code" className="w-56 h-56 object-contain" />
            </div>
            
            <div className="flex gap-3 w-full mt-2">
              <button 
                onClick={() => setQr(null)} 
                className="flex-1 bg-zinc-800 text-zinc-300 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={downloadQR} 
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
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