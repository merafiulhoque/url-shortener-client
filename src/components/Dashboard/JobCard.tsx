// components/BulkJobs/JobCard.tsx
"use client"

import { useMutation } from "@tanstack/react-query"
import { FileText, CalendarDays, Trash2, Loader2, Database, DownloadCloud } from "lucide-react"
import JobStatusBadge from "./StatusBadge"
import { useToast } from "../ui/Toast" // adjust path
import { BULK_JOB, BulkJobStatus } from "@/types" // adjust path

// Imports for your server actions
import { deleteJob } from "@/actions/deleteJob"
import { downloadErrorLog } from "@/actions/downloadErrorLog"
import { importJobUrls } from "@/actions/importJobUrls"

interface JobCardProps {
    job: BULK_JOB;
    onDeleted: () => void;
}

export default function JobCard({ job, onDeleted }: JobCardProps) {
    const { showToast } = useToast()

    // --- Delete Mutation ---
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteJob(id),
        onSuccess: (data: any) => {
            if (data?.success !== false) {
                showToast({ text: "Job deleted successfully", bgColor: "green", duration: 3000 })
                onDeleted()
            } else {
                showToast({ text: data?.message ?? "Failed to delete job", bgColor: "red", duration: 3000 })
            }
        },
        onError: (err: any) => showToast({ text: err.message ?? "Failed to delete job", bgColor: "red", duration: 3000 })
    })

    // --- Import Mutation ---
    const importMutation = useMutation({
        mutationFn: (id: number) => importJobUrls(id),
        onSuccess: (data: any) => showToast({ text: data?.message ?? "URLs imported successfully!", bgColor: "green", duration: 3000 }),
        onError: (err: any) => showToast({ text: err.message ?? "Failed to import URLs.", bgColor: "red", duration: 3000 })
    })

    // --- Download Mutation (Handling Base64 from Server Action) ---
    const downloadMutation = useMutation({
        mutationFn: (id: number) => downloadErrorLog(id),
        onSuccess: async (res: any) => {
            if (res?.success && res?.data) {
                try {
                    // 1. Create a data URL from the base64 string
                    const dataUrl = `data:${res.contentType || "text/plain"};base64,${res.data}`;
                    
                    // 2. Efficiently convert the base64 string to a Blob using fetch
                    const fetchResponse = await fetch(dataUrl);
                    const blob = await fetchResponse.blob();
                    
                    // 3. Create object URL and trigger download
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = res.fileName || `error_log_${job.id}.txt`;
                    
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    setTimeout(() => window.URL.revokeObjectURL(url), 1000);

                    showToast({ text: "Error log downloaded!", bgColor: "green", duration: 3000 });
                } catch (error) {
                    showToast({ text: "Failed to process the downloaded file.", bgColor: "red", duration: 3000 });
                }
            } else {
                showToast({ text: res?.message ?? "Failed to download error log.", bgColor: "red", duration: 3000 });
            }
        },
        onError: (err: any) => showToast({ text: err.message ?? "Something went wrong.", bgColor: "red", duration: 3000 })
    })

    // --- Helpers ---
    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
        })
    }

    // Safely normalize the status to uppercase
    const normalizedStatus = String(job.status).toUpperCase();

    const showDownloadLog = normalizedStatus === BulkJobStatus.COMPLETED_WITH_ERRORS;
    const showImport = normalizedStatus === BulkJobStatus.COMPLETED || normalizedStatus === BulkJobStatus.COMPLETED_WITH_ERRORS;

    return (
        <div className="flex flex-col bg-[#09090A] border border-white/5 hover:border-emerald-900/30 rounded-[24px] transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            
            {/* Subtle Inner Pattern & Hover Glow */}
            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[100px] bg-emerald-500/[0.04] blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
            
            {/* Top Section: Job Info */}
            <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
                <div className="flex flex-col gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-zinc-500 bg-[#111113] px-2.5 py-1 rounded-md border border-white/5 uppercase font-bold tracking-widest shadow-inner">
                            ID #{job.id}
                        </span>
                        <JobStatusBadge status={job.status} />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-inner shrink-0">
                            <FileText className="w-5 h-5 text-emerald-500" />
                        </div>
                        <span className="text-[16px] sm:text-lg font-bold text-white truncate" title={job.filePath}>
                            {job.filePath.split('/').pop() || job.filePath}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-zinc-500 font-medium mt-1">
                        <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                            Created: <span className="text-zinc-400">{formatDate(job.createdAt)}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                            Updated: <span className="text-zinc-400">{formatDate(job.updatedAt)}</span>
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Bottom Section: Action Bar */}
            <div className="flex flex-wrap items-center justify-end gap-3 p-4 sm:p-5 bg-[#050505] border-t border-white/[0.06] relative z-10">
                
                {showDownloadLog && (
                    <button 
                        onClick={() => downloadMutation.mutate(job.id)}
                        disabled={downloadMutation.isPending}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111113] hover:bg-amber-950/30 text-zinc-400 hover:text-amber-500 rounded-xl text-[13px] font-semibold transition-all border border-white/5 hover:border-amber-900/50 disabled:opacity-50 active:scale-[0.98] disabled:active:scale-100"
                    >
                        {downloadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                        Error Log
                    </button>
                )}

                {showImport && (
                    <button 
                        onClick={() => importMutation.mutate(job.id)}
                        disabled={importMutation.isPending}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-xl text-[13px] font-bold transition-all disabled:opacity-50 disabled:from-[#111113] disabled:to-[#111113] disabled:text-zinc-500 disabled:border-white/5 shadow-[0_4px_12px_rgba(16,185,129,0.2)] disabled:shadow-none active:scale-[0.98] disabled:active:scale-100"
                    >
                        {importMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                        Import URLs
                    </button>
                )}
                
                <button 
                    onClick={() => deleteMutation.mutate(job.id)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111113] hover:bg-red-950/30 text-zinc-400 hover:text-red-500 rounded-xl text-[13px] font-semibold transition-all border border-white/5 hover:border-red-900/50 disabled:opacity-50 active:scale-[0.98] disabled:active:scale-100"
                >
                    {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete
                </button>
            </div>

        </div>
    )
}