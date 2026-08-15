// components/BulkJobs/JobStatusBadge.tsx
import { CheckCircle2, Clock, AlertTriangle, HelpCircle } from "lucide-react"
import { BulkJobStatus } from "@/types" 

export default function JobStatusBadge({ status }: { status: BulkJobStatus | string }) {
    // Convert to uppercase safely to match our Enum
    const normalizedStatus = String(status).toUpperCase();
    
    if (normalizedStatus === BulkJobStatus.COMPLETED) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.1)] backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
            </span>
        )
    }
    
    if (normalizedStatus === BulkJobStatus.PROCESSING || normalizedStatus === "PENDING") {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(45,212,191,0.1)] backdrop-blur-md">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                Processing
            </span>
        )
    }
    
    if (normalizedStatus === BulkJobStatus.COMPLETED_WITH_ERRORS) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.1)] backdrop-blur-md">
                <AlertTriangle className="w-3.5 h-3.5" />
                Partial Error
            </span>
        )
    }
    
    // Fallback just in case
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111113] text-zinc-400 border border-white/10 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-inner backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5" />
            {normalizedStatus || "UNKNOWN"}
        </span>
    )
}