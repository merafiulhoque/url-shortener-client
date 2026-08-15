// components/BulkJobs/JobDetailModal.tsx
"use client"

import { useMutation } from "@tanstack/react-query"
import { X, DownloadCloud, Database, CalendarDays, FileText, Loader2 } from "lucide-react"
import { useToast } from "../ui/Toast" // adjust path
import JobStatusBadge from "./StatusBadge"
import { BULK_JOB, BulkJobStatus } from "@/types" // adjust path

// MOCK IMPORT - Replace these with your actual server actions
import { downloadErrorLog } from "@/actions/downloadErrorLog"
import { importJobUrls } from "@/actions/importJobUrls"

interface JobDetailModalProps {
    job: BULK_JOB | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
    const { showToast } = useToast()

    const downloadMutation = useMutation({
        mutationFn: (id: number) => downloadErrorLog(id),
        onSuccess: (data: any) => {
            showToast({ text: data?.message ?? "Error log downloaded!", bgColor: "green", duration: 3000 })
        },
        onError: (err: any) => {
            showToast({ text: err.message ?? "Failed to download error log.", bgColor: "red", duration: 3000 })
        }
    })

    const importMutation = useMutation({
        mutationFn: (id: number) => importJobUrls(id),
        onSuccess: (data: any) => {
            showToast({ text: data?.message ?? "URLs imported to dashboard successfully!", bgColor: "green", duration: 3000 })
        },
        onError: (err: any) => {
            showToast({ text: err.message ?? "Failed to import URLs.", bgColor: "red", duration: 3000 })
        }
    })

    if (!isOpen || !job) return null;

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
        })
    }

    // Determine if we can import URLs (Allow on absolute success or partial error)
    const canImport = job.status === BulkJobStatus.COMPLETED || job.status === BulkJobStatus.COMPLETED_WITH_ERRORS;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 selection:bg-emerald-700/30 selection:text-emerald-200">
            <div className="w-full max-w-lg bg-[#09090A] border border-emerald-900/30 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 relative">
                
                {/* Subtle Inner Pattern & Glow */}
                <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[150px] bg-emerald-500/[0.04] blur-[80px] rounded-full pointer-events-none z-0" />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/[0.06]">
                    <h2 className="text-[20px] font-bold text-white tracking-tight">Job Details</h2>
                    <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-[0.95]">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body (Details) */}
                <div className="relative z-10 p-6 space-y-6">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-mono text-zinc-500 uppercase font-bold tracking-widest">Job ID #{job.id}</span>
                            <div className="flex items-center gap-2.5 text-zinc-200">
                                <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 shadow-inner">
                                    <FileText className="w-4 h-4 text-emerald-500" />
                                </div>
                                <span className="font-medium text-[14px] break-all">{job.filePath.split('/').pop() || job.filePath}</span>
                            </div>
                        </div>
                        <JobStatusBadge status={job.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-[#111113] rounded-2xl border border-white/5 shadow-inner">
                        <div className="space-y-1.5 text-[13px]">
                            <span className="text-zinc-500 flex items-center gap-1.5 font-medium"><CalendarDays className="w-3.5 h-3.5"/> Created</span>
                            <p className="text-zinc-300 font-medium">{formatDate(job.createdAt)}</p>
                        </div>
                        <div className="space-y-1.5 text-[13px]">
                            <span className="text-zinc-500 flex items-center gap-1.5 font-medium"><CalendarDays className="w-3.5 h-3.5"/> Updated</span>
                            <p className="text-zinc-300 font-medium">{formatDate(job.updatedAt)}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-2">
                        <button 
                            onClick={() => importMutation.mutate(job.id)}
                            disabled={importMutation.isPending || !canImport}
                            className="w-full h-12 flex items-center justify-center gap-2 px-4 bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 disabled:from-[#111113] disabled:to-[#111113] disabled:border disabled:border-white/5 disabled:text-zinc-500 rounded-xl font-bold text-white shadow-[0_4px_15px_rgba(16,185,129,0.2)] disabled:shadow-none transition-all duration-300 disabled:cursor-not-allowed active:scale-[0.98] disabled:active:scale-100"
                        >
                            {importMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                            Import URLs to Dashboard
                        </button>
                        
                        <button 
                            onClick={() => downloadMutation.mutate(job.id)}
                            disabled={downloadMutation.isPending}
                            className="w-full h-12 flex items-center justify-center gap-2 px-4 bg-[#111113] hover:bg-[#18181B] border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-zinc-300 transition-all duration-300 active:scale-[0.98] disabled:active:scale-100"
                        >
                            {downloadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4 text-red-400" />}
                            Download Error Log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}