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
    const canImport = job.status === BulkJobStatus.COMPLETED || job.status === BulkJobStatus.COMPLETED_WITH_ERROR;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-900/50">
                    <h2 className="text-xl font-bold text-zinc-100">Job Details</h2>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body (Details) */}
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                            <span className="text-xs font-mono text-zinc-500 uppercase font-bold tracking-wider">Job ID #{job.id}</span>
                            <div className="flex items-center gap-2 text-zinc-200">
                                <FileText className="w-4 h-4 text-indigo-400" />
                                <span className="font-medium break-all">{job.filePath.split('/').pop() || job.filePath}</span>
                            </div>
                        </div>
                        <JobStatusBadge status={job.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                        <div className="space-y-1 text-sm">
                            <span className="text-zinc-500 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5"/> Created</span>
                            <p className="text-zinc-200 font-medium">{formatDate(job.createdAt)}</p>
                        </div>
                        <div className="space-y-1 text-sm">
                            <span className="text-zinc-500 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5"/> Updated</span>
                            <p className="text-zinc-200 font-medium">{formatDate(job.updatedAt)}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-2">
                        <button 
                            onClick={() => importMutation.mutate(job.id)}
                            disabled={importMutation.isPending || !canImport}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 disabled:shadow-none disabled:cursor-not-allowed"
                        >
                            {importMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                            Import URLs to Dashboard
                        </button>
                        
                        <button 
                            onClick={() => downloadMutation.mutate(job.id)}
                            disabled={downloadMutation.isPending}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-zinc-300 transition-all duration-300"
                        >
                            {downloadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4 text-rose-400" />}
                            Download Error Log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}