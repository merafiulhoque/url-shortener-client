// app/bulk-jobs/page.tsx
"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "../ui/Toast" // adjust path
import { Loader2, RefreshCw, FileText, Database } from "lucide-react"

import { getBulkJobs } from "@/actions/getBulkJobs"
import { BULK_JOB } from "@/types" // adjust path
import JobCard from "./JobCard"

export default function GetBulkJobsPage() {
    const { showToast } = useToast()
    const [jobs, setJobs] = useState<BULK_JOB[]>([])

    // Mutation: Fetch all jobs manually
    const fetchJobsMutation = useMutation({
        mutationFn: getBulkJobs,
        onSuccess: (data) => {
            if (data?.success) {
                setJobs(data.data || [])
                showToast({ text: data.message ?? "Jobs fetched successfully!", bgColor: "green", duration: 3000 })
            } else {
                showToast({ text: data?.message ?? "Failed to fetch jobs.", bgColor: "red", duration: 3000 })
            }
        },
        onError: (err: any) => {
            showToast({ text: err.message ?? "Something went wrong", bgColor: "red", duration: 3000 })
        }
    })

    return (
        <div className="relative w-full h-full min-h-0 p-4 sm:p-6 lg:p-8 flex flex-col items-center animate-in fade-in duration-500 overflow-y-auto custom-scrollbar bg-[#000000] selection:bg-emerald-700/30 selection:text-emerald-200 z-0">
            
            {/* Deep green ambient glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[400px] bg-emerald-700/[0.04] blur-[150px] rounded-full pointer-events-none z-0" />

            <div className="w-full max-w-4xl flex flex-col gap-6 relative z-10">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-white/[0.06] pb-6 mt-4 sm:mt-8">
                    <div className="space-y-2 flex items-start gap-4">
                        <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0a0a0a] border-2 border-emerald-700/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                            <Database className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                Bulk <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Jobs</span>
                            </h1>
                            <p className="text-[13px] sm:text-sm text-zinc-500 mt-1 font-medium">
                                View and manage your bulk URL shortening processes.
                            </p>
                        </div>
                    </div>
                    
                    {/* Manual Fetch Button */}
                    <button
                        onClick={() => fetchJobsMutation.mutate()}
                        disabled={fetchJobsMutation.isPending}
                        className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111113] border border-white/5 hover:border-emerald-700/50 hover:bg-[#141417] rounded-xl font-bold text-zinc-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-[0.98]"
                    >
                        {fetchJobsMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        ) : (
                            <RefreshCw className="w-4 h-4 text-emerald-500 group-hover:rotate-180 transition-transform duration-500" />
                        )}
                        <span className="text-[13px] tracking-wide">{jobs.length > 0 ? "Refresh Jobs" : "Fetch Jobs"}</span>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="w-full pb-10">
                    {fetchJobsMutation.isPending && jobs.length === 0 ? (
                        <div className="w-full py-24 flex flex-col items-center justify-center gap-4 text-zinc-500">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                <Loader2 className="w-10 h-10 animate-spin text-emerald-500 relative z-10" />
                            </div>
                            <p className="text-[13px] font-medium animate-pulse text-zinc-400 mt-2">Loading your bulk jobs...</p>
                        </div>
                    ) : jobs.length === 0 && fetchJobsMutation.isSuccess ? (
                        <div className="w-full py-20 flex flex-col items-center justify-center gap-4 bg-[#09090A] border border-white/5 rounded-[24px] border-dashed relative shadow-inner overflow-hidden">
                            {/* Subtle Grid in Empty State */}
                            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>
                            
                            <div className="w-16 h-16 bg-[#050505] rounded-2xl flex items-center justify-center border border-white/5 mb-2 relative z-10 shadow-inner">
                                <FileText className="w-7 h-7 text-emerald-700/50" />
                            </div>
                            <p className="text-[13px] text-zinc-400 font-medium relative z-10">No bulk jobs found.</p>
                        </div>
                    ) : jobs.length === 0 && fetchJobsMutation.isIdle ? (
                        <div className="w-full py-20 flex flex-col items-center justify-center gap-4 bg-[#09090A] border border-white/5 rounded-[24px] border-dashed relative shadow-inner overflow-hidden">
                            <div className="w-16 h-16 bg-[#050505] rounded-2xl flex items-center justify-center border border-white/5 mb-2 relative z-10 shadow-inner">
                                <RefreshCw className="w-7 h-7 text-zinc-700" />
                            </div>
                            <p className="text-[13px] text-zinc-500 font-medium relative z-10">Click the button above to fetch your jobs.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {jobs.map((job) => (
                                <JobCard 
                                    key={job.id} 
                                    job={job} 
                                    onDeleted={() => fetchJobsMutation.mutate()} // Re-fetch list automatically on delete
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}