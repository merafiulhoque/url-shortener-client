"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_URLS } from "@/constants";
import { ApiResponse, URLS } from "@/types";
import {
  CopyIcon,
  Trash2Icon,
  QrCodeIcon,
  DownloadIcon,
  PlusIcon,
  Link2Off,
  ChevronLeftIcon,
  ChevronRightIcon,
  BarChart3Icon,
  LinkIcon,
} from "lucide-react";
import QRCode from "qrcode";
import { useURLStore } from "@/store/urlStore";
import { useToast } from "../ui/Toast";
import UrlStatsModal from "@/components/Dashboard/UrlStatsModal";
import { UrlStatData } from "@/types";

const PAGE_LIMIT = 10;

export default function AllUrls() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [statData, setStatData] = useState<UrlStatData | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const { urls, hydrated, getUrls, removeUrl } = useURLStore();
  const { showToast } = useToast();

  useEffect(() => {
    if (!hydrated) return;

    const fetchUrls = async () => {
      setIsLoading(true);
      await getUrls(page);
      setIsLoading(false);
    };

    fetchUrls();
  }, [hydrated, page, getUrls]);

  const hasNextPage = !!urls && urls.length === PAGE_LIMIT;
  const rowCount = urls?.length ?? 0;
  const paddingRows = Math.max(PAGE_LIMIT - rowCount, 0);

  const handleDeleteUrl = async (id: number) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      const res = await fetch("api/url/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const response: ApiResponse<null> = await res.json();

      if (!response.success && response.message) {
        setError(response.message);
      } else {
        removeUrl(id);
        if (urls && urls.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
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
        body: JSON.stringify(urls),
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
      setQrUrl(url);
      const dataUrl = await QRCode.toDataURL(url, {
        margin: 2,
        width: 200,
        // Match QR code to the emerald theme
        color: { dark: "#047857", light: "#ffffff" },
      });
      setQr(dataUrl);
    } catch (err) {
      setError("Failed to generate QR Code");
      setQrUrl("");
    }
  };

  const downloadQR = () => {
    if (!qr) return;
    const a = document.createElement("a");
    a.href = qr;
    a.download = "qrcode.png";
    a.click();
  };

  const getFullStat = async (id: number) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/url/get-stat", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      const resData: ApiResponse<any> = await res.json();

      if (resData.success) {
        setStatData(resData.data);
      } else {
        showToast({
          text: resData.message || "Failed to fetch stats",
          bgColor: "red",
        });
      }
    } catch (error) {
      showToast({
        text: error instanceof Error ? error.message : "Something went wrong",
        bgColor: "red",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0 bg-[#000000] p-3 md:p-6 overflow-hidden animate-in fade-in duration-500 font-sans selection:bg-emerald-700/30 selection:text-emerald-200 z-0 relative">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0a0a0a] border-2 border-emerald-700/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <LinkIcon className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Links</span>
            </h1>
            <p className="text-[12px] sm:text-[13px] text-zinc-500 mt-0.5">
              Manage, share, and track your shortened URLs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {urls !== null && urls.length > 0 && (
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#09090A] border border-white/5 hover:border-emerald-700/50 hover:bg-[#111113] text-zinc-300 text-[13px] font-medium rounded-xl transition-all shadow-sm active:scale-[0.98]"
            >
              <DownloadIcon className="w-4 h-4" /> <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}
          <Link
            href="/dashboard/create"
            className="group relative inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white text-[13px] font-bold rounded-xl transition-all shadow-[0_4px_12px_rgba(16,185,129,0.15)] overflow-hidden active:scale-[0.98]"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            <PlusIcon className="w-4 h-4 relative z-10" /> <span className="relative z-10">Create New</span>
          </Link>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 bg-red-950/30 border border-red-900/50 rounded-xl text-red-500 text-[13px] flex items-center justify-between shrink-0 animate-in slide-in-from-top-2 relative z-10">
          <span className="font-medium">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-500/70 hover:text-red-400 text-lg font-bold transition-colors leading-none"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Table Layout container */}
      <div className="flex flex-col flex-1 min-h-0 bg-[#09090A] rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-emerald-900/30 overflow-hidden relative z-10">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>

        {isLoading && (!urls || urls.length === 0) ? (
          <div className="p-4 flex flex-col gap-3 flex-1 relative z-10">
            {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-white/[0.03] rounded-xl w-full animate-pulse"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        ) : urls !== null && urls.length > 0 ? (
          <>
            {/* Horizontal scroll on mobile, min-w prevents squishing */}
            <div className="flex-1 min-h-0 overflow-x-auto custom-scrollbar relative z-10">
              <table className="w-full min-w-[800px] table-fixed text-left text-[13px]">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[28%]" />
                  <col className="w-[8%]" />
                  <col className="w-[10%]" />
                  <col className="w-[13%]" />
                  <col className="w-[13%]" />
                  <col className="w-[8%]" />
                </colgroup>
                <thead className="bg-[#050505] border-b border-white/[0.06] text-zinc-400 uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Short Link</th>
                    <th className="px-5 py-3.5">Original URL</th>
                    <th className="px-5 py-3.5 text-center">Clicks</th>
                    <th className="px-5 py-3.5 text-center">Stats</th>
                    <th className="px-5 py-3.5 text-center">Created</th>
                    <th className="px-5 py-3.5 text-center">Expires</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.04]">
                  {urls.map((url: URLS) => {
                    const fullShortUrl = `${API_URLS.BASE_URL}/${url.shortnedUrl}`;
                    return (
                      <tr
                        key={url.id}
                        className="group h-12 border-l-2 border-transparent hover:border-l-emerald-500 hover:bg-emerald-900/10 transition-colors"
                      >
                        <td className="px-5 py-2 truncate">
                          <a
                            href={fullShortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-500 font-medium hover:text-emerald-400 transition-colors truncate inline-block max-w-full"
                            title={fullShortUrl}
                          >
                            {fullShortUrl}
                          </a>
                        </td>

                        <td className="px-5 py-2">
                          <div
                            className="truncate text-zinc-400 group-hover:text-zinc-300 transition-colors"
                            title={url.originalUrl}
                          >
                            {url.originalUrl}
                          </div>
                        </td>

                        <td className="px-5 py-2 text-center">
                          <span className="inline-flex items-center justify-center bg-[#111113] border border-white/10 text-zinc-300 px-2.5 py-0.5 rounded-full font-medium min-w-[2.5rem]">
                            {url.clicks || 0}
                          </span>
                        </td>
                        <td className="px-5 py-2 text-center">
                          <button
                            className="inline-flex items-center justify-center h-7 w-7 bg-[#111113] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 rounded-full transition-colors"
                            title="View full stats"
                            onClick={async () => await getFullStat(url.id)}
                          >
                            <BarChart3Icon className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="px-5 py-2 text-center text-zinc-500 truncate">
                          {new Date(url.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-2 text-center truncate">
                          {url.expiresAt ? (
                            <span className="text-zinc-500">
                              {new Date(url.expiresAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          ) : (
                            <span className="text-emerald-600/80 font-medium">Forever</span>
                          )}
                        </td>

                        <td className="px-5 py-2 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                              title="Copy to clipboard"
                              onClick={() => navigator.clipboard.writeText(fullShortUrl)}
                            >
                              <CopyIcon className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                              title="Generate QR"
                              onClick={() => generateQR(fullShortUrl)}
                            >
                              <QrCodeIcon className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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

                  {Array.from({ length: paddingRows }).map((_, i) => (
                    <tr key={`pad-${i}`} className="h-12" aria-hidden="true">
                      <td colSpan={7} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-[#050505] shrink-0 relative z-10">
              <span className="text-[12px] text-zinc-500 font-medium">
                Page {page} &middot; {rowCount} {rowCount === 1 ? "link" : "links"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1 || isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111113] border border-white/5 text-zinc-300 text-[12px] font-medium rounded-lg hover:bg-[#18181B] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!hasNextPage || isLoading}
                  title={!hasNextPage ? "You've reached the end of the list" : undefined}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111113] border border-white/5 text-zinc-300 text-[12px] font-medium rounded-lg hover:bg-[#18181B] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  Next <ChevronRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            <div className="h-16 w-16 bg-[#050505] border border-white/5 rounded-2xl flex items-center justify-center text-zinc-600 mb-5 shadow-inner">
              <Link2Off className="w-8 h-8 text-emerald-700/50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No links found</h3>
            <p className="text-[13px] text-zinc-500 mb-8 max-w-sm leading-relaxed">
              {page > 1
                ? "You've reached the end of the list."
                : "You haven't shortened any URLs yet. Create your first short link to start managing and tracking it here."}
            </p>
            {page === 1 ? (
              <Link
                href="/dashboard/create"
                className="px-6 py-3 bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white text-[13px] font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(16,185,129,0.15)] active:scale-[0.98]"
              >
                Create Your First Link
              </Link>
            ) : (
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-6 py-3 bg-[#111113] border border-white/10 hover:bg-[#18181B] text-white text-[13px] font-bold rounded-xl transition-colors active:scale-[0.98]"
              >
                Go Back
              </button>
            )}
          </div>
        )}
      </div>

      {/* QR Code Modal Popup */}
      {qr && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#09090A] border border-emerald-900/30 rounded-2xl p-6 max-w-[320px] w-full shadow-2xl flex flex-col items-center gap-5 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] to-transparent pointer-events-none" />
            
            <div className="w-full flex justify-between items-center relative z-10">
              <h3 className="text-[15px] font-bold text-white">Scan QR Code</h3>
              <button
                onClick={() => setQr(null)}
                className="text-zinc-500 hover:text-white text-xl font-light transition-colors leading-none"
              >
                &times;
              </button>
            </div>

            <div className="bg-white p-2.5 rounded-xl border-4 border-[#111113] shadow-inner relative z-10">
              <img src={qr} alt="Generated QR Code" className="w-48 h-48 object-contain" />
            </div>

            <span className="w-full text-center text-[11px] text-emerald-500/80 truncate px-2 relative z-10">
              {qrUrl}
            </span>

            <div className="flex gap-3 w-full mt-2 relative z-10">
              <button
                onClick={() => setQr(null)}
                className="flex-1 bg-[#111113] border border-white/10 text-zinc-300 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-[#18181B] transition-colors active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={downloadQR}
                className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-[13px] font-bold hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98]"
              >
                <DownloadIcon className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL Statistics Modal Popup */}
      {statData && <UrlStatsModal data={statData} onClose={() => setStatData(null)} />}
    </div>
  );
}