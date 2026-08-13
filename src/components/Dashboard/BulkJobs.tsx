"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "../ui/Toast"
import { Loader2, RefreshCw, FileText, ChevronRight, Clock, CheckCircle2, AlertCircle } from "lucide-react"
// Adjust this import path to where your getBulkJobs function is actually located
import { getBulkJobs } from "@/actions/getBulkJobs"

// Assuming this is exported from your types file, defined here for clarity
export type BulkJobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | string;

export interface BULK_JOB {
    status: BulkJobStatus;
    filePath: string;
    id: number;
    userId: number;
}

export default function GetBulkJobsPage() {
    const { showToast } = useToast()
    const [jobs, setJobs] = useState<BULK_JOB[]>([])

    // useMutation for manual fetching via button as requested
    const mutation = useMutation({
        mutationFn: getBulkJobs,
        onSuccess: (data) => {
            if (data?.success) {
                setJobs(data.data || [])
                showToast({
                    text: data.message ?? "Jobs fetched successfully!",
                    bgColor: "green",
                    duration: 3000
                })
            } else {
                showToast({
                    text: data?.message ?? "Failed to fetch jobs.",
                    bgColor: "red",
                    duration: 3000
                })
            }
        },
        onError: (err: any) => {
            showToast({
                text: err.message ?? "Something went wrong",
                bgColor: "red",
                duration: 3000
            })
        }
    })

    const handleFetchDetails = (jobId: number) => {
        // Placeholder for individual detail fetching logic
        // You could route to a details page or open a modal here
        showToast({
            text: `Fetching details for Job #${jobId}...`,
            bgColor: "indigo", // Or whatever default/info color your toast supports
            duration: 2000
        })
    }

    // Helper function to render the correct status badge styling
    const getStatusBadge = (status: BulkJobStatus) => {
        const lowerStatus = status.toLowerCase()
        if (lowerStatus === "completed") {
            return (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-semibold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                </span>
            )
        }
        if (lowerStatus === "processing" || lowerStatus === "pending") {
            return (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-xs font-semibold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    {status}
                </span>
            )
        }
        if (lowerStatus === "failed") {
            return (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-xs font-semibold uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Failed
                </span>
            )
        }
        // Fallback
        return (
            <span className="px-2.5 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md text-xs font-semibold uppercase tracking-wider">
                {status}
            </span>
        )
    }

    return (
        <div className="w-full min-h-full p-4 flex flex-col items-center animate-in fade-in duration-500">
            <div className="w-full max-w-4xl flex flex-col gap-6 mt-10">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            Bulk Jobs
                        </h1>
                        <p className="text-zinc-400 text-sm md:text-base">
                            View and manage your bulk URL shortening processes.
                        </p>
                    </div>
                    
                    <button
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                        className="group flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800 rounded-xl font-semibold text-zinc-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20"
                    >
                        {mutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                        ) : (
                            <RefreshCw className="w-4 h-4 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
                        )}
                        <span>{jobs.length > 0 ? "Refresh Jobs" : "Fetch Jobs"}</span>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="w-full">
                    {mutation.isPending && jobs.length === 0 ? (
                        // Initial Loading State
                        <div className="w-full py-20 flex flex-col items-center justify-center gap-4 text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500/50" />
                            <p className="text-sm font-medium animate-pulse">Loading your bulk jobs...</p>
                        </div>
                    ) : jobs.length === 0 && mutation.isSuccess ? (
                        // Empty State (Fetched but no jobs)
                        <div className="w-full py-20 flex flex-col items-center justify-center gap-4 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-3xl border-dashed">
                            <FileText className="w-12 h-12 text-zinc-600" />
                            <p className="text-zinc-400 font-medium">No bulk jobs found.</p>
                        </div>
                    ) : jobs.length === 0 && mutation.isIdle ? (
                        // Initial Idle State
                        <div className="w-full py-20 flex flex-col items-center justify-center gap-4 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-3xl border-dashed">
                            <RefreshCw className="w-12 h-12 text-zinc-700" />
                            <p className="text-zinc-500 font-medium">Click the button above to fetch your jobs.</p>
                        </div>
                    ) : (
                        // Grid of Job Cards
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {jobs.map((job) => (
                                <div 
                                    key={job.id} 
                                    className="flex flex-col bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300 shadow-xl shadow-black/20 group"
                                >
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between p-5 border-b border-zinc-800/50">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-mono text-zinc-500 uppercase font-semibold tracking-wider">
                                                Job ID #{job.id}
                                            </span>
                                            <span className="text-sm font-medium text-zinc-300 truncate max-w-[200px]" title={job.filePath}>
                                                {job.filePath.split('/').pop() || job.filePath}
                                            </span>
                                        </div>
                                        {getStatusBadge(job.status)}
                                    </div>
                                    
                                    {/* Card Footer / Action */}
                                    <div className="p-4 bg-zinc-950/50 mt-auto">
                                        <button 
                                            onClick={() => handleFetchDetails(job.id)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-sm font-semibold transition-colors border border-indigo-500/10 hover:border-indigo-500/30"
                                        >
                                            View Details
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}