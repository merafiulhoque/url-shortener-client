"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_URLS } from "@/constants";
import { ApiResponse, URLS } from "@/types";
import { CopyIcon, ArchiveIcon } from "lucide-react"
import { useRouter } from "next/navigation";



// Data interface matching your API response
interface ShortUrl {
  id: number;
  originalUrl: string;
  shortnedUrl: string; // Kept your exact spelling
  userId: number;
}

export default function DashboardPage() {
  const [urls, setUrls] = useState<URLS[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()


  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch(API_URLS.GET_ALL_SHORT_URLS, {
          method: "GET",
          headers: {"Content-type": "application/json"},
          credentials: "include",
          cache: "no-cache"
        });
        const result: ApiResponse<URLS[] | null> = await response.json();

        if(!result.success) {
          setError(result.message || "Failed to load URLs.");
          return
        }

        if(!result.data) {
          setError(result.message || "Failed to load URLs.");
          return
        }
        setUrls(result.data)
      } catch (err) {
        setError("A network error occurred while fetching your links.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const handleDeteteUrl = async (id: number) => {
    if(!confirm("Are you sure ??")) return
    try {
      const ApiResponse = await fetch(API_URLS.DELETE_SHORT_URL, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify({id})
      })
      const response: ApiResponse<null> = await ApiResponse.json()
      setError(response.message)

    } catch (error) {
      setError("Something went wrong")
    } finally {
      setTimeout(() => {
        window.location.reload()
      }, 2000);
    }
  }

  const handleExport = async () => {
    const response = await fetch("/api/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(urls)
    })
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "urls.csv"
    a.click()
  }


  return (
    <div className="max-w-5xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Links</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and share your shortened URLs.</p>
        </div>
        
        <Link 
          href="/dashboard/create" 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* URLs Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          /* Loading Skeleton */
          <div className="p-8 flex flex-col gap-4 animate-pulse">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="h-12 bg-slate-100 rounded-lg w-full"></div>
            ))}
          </div>
        ) : urls.length > 0 ? (
          /* Data Table */
          <div className="overflow-x-auto grid place-items-center w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-medium">Short Link</th>
                  <th className="px-6 py-4 font-medium">Original URL</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100">
                {urls.map((url: URLS) => {
                  // Construct the full short URL here

                  const fullShortUrl = `${API_URLS.BASE_URL}/${url.shortnedUrl}`;

                  return (
                    <tr key={url.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Short Link */}
                      <td className="px-6 py-4">
                        <a 
                          href={fullShortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 font-semibold hover:underline flex items-center gap-1.5"
                        >
                          {fullShortUrl}
                        </a>
                      </td>
                      
                      {/* Original URL with Truncation */}
                      <td className="px-6 py-4">
                        <div className="max-w-[250px] md:max-w-md truncate text-slate-500" title={url.originalUrl}>
                          {url.originalUrl}
                        </div>
                      </td>
                      
                      {/* Actions (Copy Button) */}
                      <td className="px-6 py-4 text-right">
                        <button 
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all" 
                          title="Copy to clipboard"
                          onClick={() => {
                            navigator.clipboard.writeText(fullShortUrl);
                            // Optional: Add a toast notification here
                          }}
                        >
                          {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg> */}
                          <CopyIcon />
                        </button>
                        <button
                          className="p-2 text-red-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all" 
                          title="Delete This URL"
                          onClick={async () =>await handleDeteteUrl(url.id)}
                        >
                          <ArchiveIcon
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button
              className="flex w-full bg-slate-300 max-w-md justify-center px-5 py-3 rounded-2xl hover:scale-95"
              onClick={async () => await handleExport()}
            >Export to Excel</button>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-12 w-12 text-slate-300 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No links yet</h3>
            <p className="text-sm text-slate-500 mb-4 max-w-sm">
              You haven't shortened any URLs yet. Create your first short link to start managing them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}