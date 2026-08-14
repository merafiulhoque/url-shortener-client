// app/bulk-jobs/page.tsx (or wherever your page is located)
"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "../ui/Toast" // adjust path
import { Loader2, RefreshCw, FileText } from "lucide-react"

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
        <div className="w-full min-h-full p-4 flex flex-col items-center animate-in fade-in duration-500">
            <div className="w-full max-w-4xl flex flex-col gap-6 mt-10">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
                            Bulk Jobs
                        </h1>
                        <p className="text-zinc-400 text-sm md:text-base">
                            View and manage your bulk URL shortening processes.
                        </p>
                    </div>
                    
                    {/* Manual Fetch Button */}
                    <button
                        onClick={() => fetchJobsMutation.mutate()}
                        disabled={fetchJobsMutation.isPending}
                        className="group flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800 rounded-xl font-semibold text-zinc-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20"
                    >
                        {fetchJobsMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                        ) : (
                            <RefreshCw className="w-4 h-4 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
                        )}
                        <span>{jobs.length > 0 ? "Refresh Jobs" : "Fetch Jobs"}</span>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="w-full">
                    {fetchJobsMutation.isPending && jobs.length === 0 ? (
                        <div className="w-full py-20 flex flex-col items-center justify-center gap-4 text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500/50" />
                            <p className="text-sm font-medium animate-pulse">Loading your bulk jobs...</p>
                        </div>
                    ) : jobs.length === 0 && fetchJobsMutation.isSuccess ? (
                        <div className="w-full py-20 flex flex-col items-center justify-center gap-4 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-3xl border-dashed">
                            <FileText className="w-12 h-12 text-zinc-600" />
                            <p className="text-zinc-400 font-medium">No bulk jobs found.</p>
                        </div>
                    ) : jobs.length === 0 && fetchJobsMutation.isIdle ? (
                        <div className="w-full py-20 flex flex-col items-center justify-center gap-4 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-3xl border-dashed">
                            <RefreshCw className="w-12 h-12 text-zinc-700" />
                            <p className="text-zinc-500 font-medium">Click the button above to fetch your jobs.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
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