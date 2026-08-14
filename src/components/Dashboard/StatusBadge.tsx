// components/BulkJobs/JobStatusBadge.tsx
import { CheckCircle2, Clock, AlertTriangle, HelpCircle } from "lucide-react"
import { BulkJobStatus } from "@/types" 

export default function JobStatusBadge({ status }: { status: BulkJobStatus | string }) {
    // Convert to uppercase safely to match our Enum
    const normalizedStatus = String(status).toUpperCase();
    
    if (normalizedStatus === BulkJobStatus.COMPLETED) {
        return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-semibold uppercase tracking-wider shadow-inner">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
            </span>
        )
    }
    
    if (normalizedStatus === BulkJobStatus.PROCESSING || normalizedStatus === "PENDING") {
        return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-xs font-semibold uppercase tracking-wider shadow-inner">
                <Clock className="w-3.5 h-3.5" />
                Processing
            </span>
        )
    }
    
    if (normalizedStatus === BulkJobStatus.COMPLETED_WITH_ERRORS) {
        return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-xs font-semibold uppercase tracking-wider shadow-inner">
                <AlertTriangle className="w-3.5 h-3.5" />
                Partial Error
            </span>
        )
    }
    
    // Fallback just in case
    return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            {normalizedStatus || "UNKNOWN"}
        </span>
    )
}