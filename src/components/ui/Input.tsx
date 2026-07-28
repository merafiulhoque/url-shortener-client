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
    <div className="relative w-full max-w-2xl group bg-zinc-950 rounded-xl">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors duration-300">
        <Link2 className="w-5 h-5" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-indigo-500/50 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-inner shadow-black/20"
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
      className="group relative px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2 text-base overflow-hidden"
    >
      {/* Button Shine Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
      
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  )
}

// Reusable Back Button Component
export const BackButton = () => {
  const router = useRouter()
  
  return (
    <button
      onClick={() => router.back()}
      className="group flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-all duration-200 text-sm font-medium bg-zinc-900/50 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-800/80"
    >
      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
      Back
    </button>
  )
}