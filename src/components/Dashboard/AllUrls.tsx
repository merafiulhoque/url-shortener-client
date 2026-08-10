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
import { useToast } from "../Toast";
import UrlStatsModal from "@/components/Dashboard/UrlStatsModal";
import { UrlStatData } from "@/types";

// Must match the page size returned by the API / store so we can reliably
// tell whether another page exists without an extra request.
// Backend returns 10 entries per page.
const PAGE_LIMIT = 10;

export default function AllUrls() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [statData, setStatData] = useState<UrlStatData | null>(null);

  const { urls, hydrated, getUrls, removeUrl } = useURLStore();
  const { showToast } = useToast();

  // Fetch URLs whenever the page changes
  useEffect(() => {
    if (!hydrated) return;

    const fetchUrls = async () => {
      setIsLoading(true);
      await getUrls(page);
      setIsLoading(false);
    };

    fetchUrls();
  }, [hydrated, page, getUrls]);

  // A full page means there could be more results; a short page means we've
  // hit the end of the list.
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
        // Optional: refresh if the current page becomes empty
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
      const dataUrl = await QRCode.toDataURL(url, {
        margin: 2,
        width: 200,
        color: { dark: "#09090b", light: "#ffffff" },
      });
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
    // Outer container set to exact viewport height (h-[100dvh]) to prevent global scrolling
    <div className="flex flex-col w-full h-full min-h-0 bg-zinc-800 p-3 md:p-4 overflow-hidden animate-in fade-in duration-500 font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-md shadow-indigo-500/30">
            <LinkIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 leading-tight">
              Your Links
            </h1>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Manage, share, and track your shortened URLs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {urls !== null && urls.length > 0 && (
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-200 text-zinc-400 text-xs font-medium rounded-lg transition-all shadow-sm"
            >
              <DownloadIcon className="w-3.5 h-3.5" /> Export CSV
            </button>
          )}
          <Link
            href="/dashboard/create"
            className="group relative inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-indigo-500/20 overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            <PlusIcon className="w-3.5 h-3.5" /> Create New
          </Link>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-3 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center justify-between shrink-0 animate-in slide-in-from-top-2">
          <span className="font-medium">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400/70 hover:text-red-400 text-lg font-bold transition-colors"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Table Layout container — fixed height, no internal scrolling */}
      <div className="flex flex-col flex-1 min-h-0 bg-zinc-900/40 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/50 border border-zinc-800 overflow-hidden">
        {isLoading && (!urls || urls.length === 0) ? (
          <div className="p-4 flex flex-col gap-2 flex-1">
            {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
              <div
                key={i}
                className="h-9 bg-zinc-800/50 rounded-lg w-full animate-pulse"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        ) : urls !== null && urls.length > 0 ? (
          <>
            {/* Fixed-layout table — height stays constant across pages, no scrollbar */}
            <div className="flex-1 min-h-0">
              <table className="w-full table-fixed text-left text-xs">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[28%]" />
                  <col className="w-[8%]" />
                  <col className="w-[10%]" />
                  <col className="w-[13%]" />
                  <col className="w-[13%]" />
                  <col className="w-[8%]" />
                </colgroup>
                <thead className="bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Short Link</th>
                    <th className="px-4 py-2.5">Original URL</th>
                    <th className="px-4 py-2.5 text-center">Clicks</th>
                    <th className="px-4 py-2.5 text-center">Stats</th>
                    <th className="px-4 py-2.5 text-center">Created</th>
                    <th className="px-4 py-2.5 text-center">Expires</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800/50">
                  {urls.map((url: URLS) => {
                    const fullShortUrl = `${API_URLS.BASE_URL}/${url.shortnedUrl}`;
                    return (
                      <tr
                        key={url.id}
                        className="group h-10 border-l-2 border-transparent hover:border-l-indigo-500 hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="px-4 py-1.5 truncate">
                          <a
                            href={fullShortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors truncate inline-block max-w-full text-xs"
                            title={fullShortUrl}
                          >
                            {fullShortUrl}
                          </a>
                        </td>

                        <td className="px-4 py-1.5">
                          <div
                            className="truncate text-zinc-500"
                            title={url.originalUrl}
                          >
                            {url.originalUrl}
                          </div>
                        </td>

                        <td className="px-4 py-1.5 text-center">
                          <span className="inline-flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full font-medium min-w-[2rem]">
                            {url.clicks || 0}
                          </span>
                        </td>
                        <td className="px-4 py-1.5 text-center">
                          <button
                            className="inline-flex items-center justify-center h-6 w-6 bg-zinc-800 hover:bg-cyan-500/10 border border-zinc-700 hover:border-cyan-500/40 text-zinc-400 hover:text-cyan-400 rounded-full transition-colors"
                            title="View full stats"
                            onClick={async () => await getFullStat(url.id)}
                          >
                            <BarChart3Icon className="w-3 h-3" />
                          </button>
                        </td>
                        <td className="px-4 py-1.5 text-center text-zinc-400 truncate">
                          {new Date(url.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-1.5 text-center truncate">
                          {url.expiresAt ? (
                            <span className="text-zinc-400">
                              {new Date(url.expiresAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          ) : (
                            <span className="text-emerald-400/80 font-medium">Forever</span>
                          )}
                        </td>

                        <td className="px-4 py-1.5 text-right">
                          <div className="flex items-center justify-end gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 rounded-md transition-all"
                              title="Copy to clipboard"
                              onClick={() => navigator.clipboard.writeText(fullShortUrl)}
                            >
                              <CopyIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              className="p-1 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-md transition-all"
                              title="Generate QR"
                              onClick={() => generateQR(fullShortUrl)}
                            >
                              <QrCodeIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              className="p-1 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                              title="Delete URL"
                              onClick={() => handleDeleteUrl(url.id)}
                            >
                              <Trash2Icon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Spacer rows keep the table height fixed across pages with fewer results,
                      so the layout never jumps and nothing needs to scroll. */}
                  {Array.from({ length: paddingRows }).map((_, i) => (
                    <tr key={`pad-${i}`} className="h-10" aria-hidden="true">
                      <td colSpan={7} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Fixed at Bottom of Table */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800 bg-zinc-900/80 shrink-0">
              <span className="text-[11px] text-zinc-500 font-medium">
                Page {page} &middot; {rowCount} {rowCount === 1 ? "link" : "links"} shown
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1 || isLoading}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!hasNextPage || isLoading}
                  title={!hasNextPage ? "You've reached the end of the list" : undefined}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next <ChevronRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="h-16 w-16 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 mb-4 shadow-inner">
              <Link2Off className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-200 mb-1">No links found</h3>
            <p className="text-xs text-zinc-500 mb-6 max-w-sm leading-relaxed">
              {page > 1
                ? "You've reached the end of the list."
                : "You haven't shortened any URLs yet. Create your first short link to start managing and tracking it here."}
            </p>
            {page === 1 ? (
              <Link
                href="/dashboard/create"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-md"
              >
                Create Your First Link
              </Link>
            ) : (
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Go Back
              </button>
            )}
          </div>
        )}
      </div>

      {/* QR Code Modal Popup */}
      {qr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-[300px] w-full shadow-2xl flex flex-col items-center gap-5 animate-in zoom-in-95 duration-200">
            <div className="w-full flex justify-between items-center">
              <h3 className="text-base font-bold text-zinc-200">Scan QR Code</h3>
              <button
                onClick={() => setQr(null)}
                className="text-zinc-500 hover:text-zinc-300 text-xl font-light transition-colors leading-none"
              >
                &times;
              </button>
            </div>

            <div className="bg-white p-2 rounded-xl border-4 border-zinc-800 shadow-inner">
              <img src={qr} alt="Generated QR Code" className="w-48 h-48 object-contain" />
            </div>

            <div className="flex gap-2 w-full mt-1">
              <button
                onClick={() => setQr(null)}
                className="flex-1 bg-zinc-800 text-zinc-300 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={downloadQR}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
              >
                <DownloadIcon className="w-3.5 h-3.5" /> Download
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