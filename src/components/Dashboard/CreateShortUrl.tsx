"use client"

import { API_URLS } from "@/constants"
import { ApiResponse, URLS } from "@/types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2, Link2, CheckCircle2, AlertCircle, ArrowLeft, Zap, ShieldCheck, BarChart3 } from "lucide-react"
import { useURLStore } from "@/store/urlStore"

// Reusable Toast Component
const Toast = ({ 
  message, 
  type = "success", 
  onClose 
}: { 
  message: string; 
  type?: "success" | "error"; 
  onClose?: () => void;
}) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />
  }

  const colors = {
    success: "bg-zinc-900/95 border-emerald-500/30 shadow-emerald-500/10",
    error: "bg-zinc-900/95 border-red-500/30 shadow-red-500/10"
  }

  return (
    <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl text-zinc-200 font-medium ${colors[type]} animate-in slide-in-from-bottom-5 duration-300`}>
      {icons[type]}
      <span className="text-sm">{message}</span>
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-3 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
        >
          ✕
        </button>
      )}
    </div>
  )
}

// Reusable Input Component
const UrlInput = ({ 
  value, 
  onChange, 
  placeholder = "Enter your link to shorten",
  disabled = false
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) => {
  return (
    <div className="relative w-full max-w-2xl group bg-zinc-950">
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
        onKeyDown={(e) => e.key === "Enter" && !disabled && onChange(value)}
      />
    </div>
  )
}

// Reusable Button Component
const ActionButton = ({ 
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
const BackButton = () => {
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

// Main Page Component
export default function CreateShortUrlPage() {
  const [newUrl, setNewUrl] = useState<string>("")
  const [error, setError] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { addUrl } = useURLStore()

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleShorten = async () => {
    if (!newUrl.trim()) {
      setError("Please enter a URL")
      setToastType("error")
      return
    }

    if (!validateUrl(newUrl)) {
      setError("Please enter a valid URL (e.g., https://example.com)")
      setToastType("error")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const ApiResponse = await fetch("/api/url/createShortUrl", {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ originalUrl: newUrl })
      })
      
      const response: ApiResponse<URLS> = await ApiResponse.json()
      if (!ApiResponse.ok || !response.success || !response.data) {
        setError(response.message ?? "Failed to shorten URL")
        setToastType("error")
        setIsLoading(false)
        return
      }
      addUrl(response.data)
      setError(response.message ?? "URL shortened successfully! 🎉")
      setToastType("success")
      setNewUrl("")
      
      setTimeout(() => {
        setError("")
        router.replace("/dashboard")
      }, 2000)
      
    } catch (error) {
      setError("Something went wrong. Please try again.")
      setToastType("error")
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // h-full and overflow-hidden ensure the page does not spawn a scrollbar
    <div className="min-h-full w-full p-4 flex flex-col items-center animate-in fade-in duration-500">
        <div className="w-full max-w-3xl flex flex-col gap-6 my-auto">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <BackButton />
            <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase shadow-inner shadow-indigo-500/5">
              New URL
            </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Create Short URL
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Transform your long, complex links into short, shareable URLs.
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center gap-6">
            
            {/* Input Section */}
            <div className="w-full space-y-2 flex flex-col items-center text-center">
              <UrlInput
                value={newUrl}
                onChange={setNewUrl}
                disabled={isLoading}
                placeholder="https://example.com/your-long-url"
              />
              <p className="text-zinc-500 text-xs mt-1">
                Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300 mx-1 font-sans">Enter</kbd> to shorten instantly
              </p>
            </div>

            {/* Action Button */}
            <ActionButton 
              onClick={handleShorten} 
              isLoading={isLoading}
            >
              <span>Shorten URL</span>
              <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
            </ActionButton>

            {/* Features Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-6 border-t border-zinc-800/80">
              {[
                { icon: <Zap className="w-5 h-5" />, label: "Lightning Fast", desc: "Instant redirects" },
                { icon: <ShieldCheck className="w-5 h-5" />, label: "Secure Links", desc: "HTTPS encryption" },
                { icon: <BarChart3 className="w-5 h-5" />, label: "Track Metrics", desc: "Monitor clicks" }
              ].map((feature) => (
                <div key={feature.label} className="flex flex-col items-center text-center group">
                  <div className="w-10 h-10 mb-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-all duration-300 shadow-lg shadow-black/20">
                    {feature.icon}
                  </div>
                  <div className="font-semibold text-zinc-200 text-sm mb-0.5">{feature.label}</div>
                  <div className="text-xs text-zinc-500">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {error && (
          <Toast 
            message={error} 
            type={toastType}
            onClose={() => setError("")}
          />
        )}
      </div>
    </div>
  )
}