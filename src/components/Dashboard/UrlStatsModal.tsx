"use client";

import { XIcon, GlobeIcon, ClockIcon, MonitorIcon } from "lucide-react";
import { API_URLS } from "@/constants";
import { UrlStatData } from "@/types"; // Adjust import path

interface UrlStatsModalProps {
  data: UrlStatData;
  onClose: () => void;
}

export default function UrlStatsModal({ data, onClose }: UrlStatsModalProps) {
  const fullShortUrl = `${API_URLS.BASE_URL}/${data.shortnedUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">Link Statistics</h2>
            <p className="text-sm text-zinc-400 mt-1">Detailed visitor logs for your shortened URL.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition-all"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800/50">
              <span className="text-xs text-zinc-500 uppercase font-semibold">Short Link</span>
              <a href={fullShortUrl} target="_blank" rel="noreferrer" className="block mt-1 text-indigo-400 hover:underline truncate">
                {fullShortUrl}
              </a>
            </div>
            <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800/50">
              <span className="text-xs text-zinc-500 uppercase font-semibold">Original Destination</span>
              <div className="mt-1 text-zinc-300 truncate" title={data.originalUrl}>
                {data.originalUrl}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-zinc-200 mb-4 flex items-center gap-2">
            <GlobeIcon className="w-5 h-5 text-indigo-400" />
            Visitor Logs ({data.visitors?.length})
          </h3>

          {/* Visitors Table */}
          { data.visitors && data.visitors.length > 0 ? (
            <div className="border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-zinc-800/50 text-zinc-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">IP Address</th>
                      <th className="px-6 py-4 font-medium">Date & Time</th>
                      <th className="px-6 py-4 font-medium">Device / Browser</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {data.visitors?.map((visitor) => (
                      <tr key={visitor.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-zinc-300">
                          {visitor.ipAddress}
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {visitor.visitedAt && new Date(visitor.visitedAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          <div className="flex items-center gap-2 max-w-[250px] truncate" title={visitor.userAgent}>
                            <MonitorIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{visitor.userAgent}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-zinc-800/20 rounded-2xl border border-zinc-800 border-dashed">
              <p className="text-zinc-500">No visitors tracked for this URL yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}