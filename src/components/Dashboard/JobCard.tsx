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
        <div className="flex flex-col bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-xl shadow-black/20 overflow-hidden">
            
            {/* Top Section: Job Info */}
            <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800/80 uppercase font-semibold tracking-wider">
                            ID #{job.id}
                        </span>
                        <JobStatusBadge status={job.status} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                        <span className="text-lg font-semibold text-zinc-100 truncate" title={job.filePath}>
                            {job.filePath.split('/').pop() || job.filePath}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500 font-medium mt-1">
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
            <div className="flex flex-wrap items-center justify-end gap-3 p-4 bg-zinc-950/50 border-t border-zinc-800/50">
                
                {showDownloadLog && (
                    <button 
                        onClick={() => downloadMutation.mutate(job.id)}
                        disabled={downloadMutation.isPending}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-sm font-semibold transition-colors border border-amber-500/20 hover:border-amber-500/40 disabled:opacity-50"
                    >
                        {downloadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                        Download Error Log
                    </button>
                )}

                {showImport && (
                    <button 
                        onClick={() => importMutation.mutate(job.id)}
                        disabled={importMutation.isPending}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500"
                    >
                        {importMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                        Import URLs
                    </button>
                )}
                
                <button 
                    onClick={() => deleteMutation.mutate(job.id)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm font-semibold transition-colors border border-rose-500/10 hover:border-rose-500/30 disabled:opacity-50"
                >
                    {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete
                </button>
            </div>

        </div>
    )
}