"use client"

import { Link2, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"

// Reusable Input Component
export default function UrlInput({ 
  value, 
  onChange, 
  onEnter,
  placeholder = "Enter your link to shorten",
  disabled = false
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  disabled?: boolean;
}){
  return (
    <div className="relative w-full max-w-2xl group bg-[#050505] rounded-xl shadow-inner">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors duration-300">
        <Link2 className="w-5 h-5" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-12 pr-4 py-3.5 bg-[#111113] border border-white/5 rounded-xl text-white placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:bg-[#0a0a0c] focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-[15px] sm:text-[14px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !disabled && onEnter && onEnter()}
      />
    </div>
  )
}

// Reusable Button Component
export const ActionButton = ({ 
  onClick, 
  isLoading = false, 
  children 
}: {
  onClick?: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="group relative px-8 py-3.5 bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 rounded-xl font-bold text-white shadow-[0_4px_15px_rgba(16,185,129,0.2)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[14px] overflow-hidden active:scale-[0.98] disabled:active:scale-100"
    >
      {/* Button Shine Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-0" />
      
      <div className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          children
        )}
      </div>
    </button>
  )
}

// Reusable Back Button Component
export const BackButton = () => {
  const router = useRouter()
  
  return (
    <button
      onClick={() => router.back()}
      className="group flex items-center gap-1.5 text-zinc-400 hover:text-white transition-all duration-200 text-[13px] font-medium bg-[#111113] hover:bg-[#18181B] px-3.5 py-1.5 rounded-lg border border-white/5 active:scale-[0.95]"
    >
      <ArrowLeft className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-500 group-hover:-translate-x-1 transition-all" />
      Back
    </button>
  )
}