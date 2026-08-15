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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300 selection:bg-emerald-700/30 selection:text-emerald-200">
      <div className="bg-[#09090A] border border-emerald-900/30 rounded-[24px] w-full max-w-4xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 relative">
        
        {/* Subtle Inner Pattern & Glow */}
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[150px] bg-emerald-500/[0.04] blur-[80px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/[0.06]">
          <div>
            <h2 className="text-[20px] font-bold text-white tracking-tight">Link Statistics</h2>
            <p className="text-[13px] text-zinc-500 mt-1">Detailed visitor logs for your shortened URL.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-[0.95]"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="relative z-10 p-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-[#111113] rounded-2xl border border-white/5 shadow-inner">
              <span className="text-[11px] text-zinc-500 uppercase font-bold tracking-widest">Short Link</span>
              <a href={fullShortUrl} target="_blank" rel="noreferrer" className="block mt-1.5 text-[14px] text-emerald-500 font-medium hover:text-emerald-400 hover:underline underline-offset-4 truncate transition-colors">
                {fullShortUrl}
              </a>
            </div>
            <div className="p-4 bg-[#111113] rounded-2xl border border-white/5 shadow-inner">
              <span className="text-[11px] text-zinc-500 uppercase font-bold tracking-widest">Original Destination</span>
              <div className="mt-1.5 text-[14px] text-zinc-300 truncate font-medium" title={data.originalUrl}>
                {data.originalUrl}
              </div>
            </div>
          </div>

          <h3 className="text-[16px] font-semibold text-white mb-4 flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <GlobeIcon className="w-4 h-4 text-emerald-500" />
            </div>
            Visitor Logs ({data.visitors?.length})
          </h3>

          {/* Visitors Table */}
          { data.visitors && data.visitors.length > 0 ? (
            <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#111113] shadow-inner">
              <div className="overflow-x-auto custom-scrollbar">
                {/* Removed whitespace-nowrap from table to allow specific columns to wrap */}
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[#050505] text-zinc-400 text-[11px] uppercase tracking-wider font-semibold border-b border-white/5">
                    <tr>
                      <th className="px-5 py-3.5 whitespace-nowrap">IP Address</th>
                      <th className="px-5 py-3.5 whitespace-nowrap">Date & Time</th>
                      <th className="px-5 py-3.5">Device / Browser</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.visitors?.map((visitor) => (
                      <tr key={visitor.id} className="hover:bg-emerald-900/10 transition-colors group">
                        <td className="px-5 py-4 font-mono text-zinc-300 whitespace-nowrap">
                          {visitor.ipAddress}
                        </td>
                        <td className="px-5 py-4 text-zinc-400 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-500/70 transition-colors" />
                            {visitor.visitedAt && new Date(visitor.visitedAt).toLocaleString()}
                          </div>
                        </td>
                        
                        {/* Device / Browser - Now wraps and shows full detail */}
                        <td className="px-5 py-4 text-zinc-400 min-w-[250px] sm:min-w-[350px]">
                          <div className="flex items-start gap-2.5">
                            <MonitorIcon className="w-4 h-4 shrink-0 mt-0.5 text-zinc-500 group-hover:text-emerald-500/70 transition-colors" />
                            <span className="whitespace-normal break-words leading-relaxed text-[12px] sm:text-[13px]">
                              {visitor.userAgent}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-[#050505] rounded-2xl border border-white/5 border-dashed">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                <GlobeIcon className="w-6 h-6 text-zinc-600" />
              </div>
              <p className="text-[13px] text-zinc-500 font-medium">No visitors tracked for this URL yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}