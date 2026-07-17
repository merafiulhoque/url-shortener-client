"use client"

import { API_URLS } from "@/constants"
import { ApiResponse, URLS } from "@/types"
import { useRouter } from "next/navigation"
import { useState, FormEvent } from "react"
import { Loader2, Link2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
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
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />
  }

  const colors = {
    success: "bg-emerald-500/90 border-emerald-400",
    error: "bg-red-500/90 border-red-400"
  }

  return (
    <div className={`fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-sm shadow-2xl text-white font-medium ${colors[type]} animate-in slide-in-from-bottom-5 duration-300`}>
      {icons[type]}
      <span>{message}</span>
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-2 hover:opacity-70 transition-opacity"
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
    <div className="relative w-full max-w-2xl">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black">
        <Link2 className="w-5 h-5" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-black placeholder:text-black/50 outline-none transition-all duration-200 focus:border-white/50 focus:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
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
      className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-2xl font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 text-lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
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
      className="group flex items-center gap-2 text-black/70 hover:text-black/50 transition-all duration-200 font-medium"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
    // Validate URL
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
      setNewUrl("") // Clear input on success
      
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
    <div className="h-full bg-gradient-to-br from-zinc-200 via-zinc-200 to-zinc-200 p-1 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <BackButton />
            <div className="text-black/80 text-sm font-mono">
              New URL
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-3">
            Create Short URL
          </h1>
          <p className="text-black/60 text-lg">
            Transform your long links into short, shareable URLs
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col items-center gap-8">
            {/* Input Section */}
            <div className="w-full space-y-2">
              <UrlInput
                value={newUrl}
                onChange={setNewUrl}
                disabled={isLoading}
                placeholder="https://example.com/your-long-url"
              />
              <p className="text-black/80 text-sm px-2">
                Enter any URL to create a shortened link
              </p>
            </div>

            {/* Action Button */}
            <ActionButton 
              onClick={handleShorten} 
              isLoading={isLoading}
            >
              <span>Shorten URL</span>
              <span className="text-xl">→</span>
            </ActionButton>

            {/* Features */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
              {[
                { icon: "⚡", label: "Fast", desc: "Instant shortening" },
                { icon: "🔒", label: "Secure", desc: "Your data is safe" },
                { icon: "📊", label: "Track", desc: "Monitor your links" }
              ].map((feature) => (
                <div key={feature.label} className="text-center text-black/70">
                  <div className="text-2xl mb-1">{feature.icon}</div>
                  <div className="font-medium">{feature.label}</div>
                  <div className="text-sm text-white/40">{feature.desc}</div>
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