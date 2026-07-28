"use client"

import { ApiResponse, EXPIRY_UNITS, URLS } from "@/types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Zap, ShieldCheck, BarChart3, Clock, ChevronDown } from "lucide-react"
import { useURLStore } from "@/store/urlStore"
import { useToast } from "../Toast"
import UrlInput, { ActionButton, BackButton } from "../ui/Input"


// Main Page Component
export default function CreateShortUrlPage() {
  const [newUrl, setNewUrl] = useState<string>("")
  const [hasExpiry, setHasExpiry] = useState(false)
  const [expiryDuration, setExpiryDuration] = useState<number | "">("")
  const [expiryUnit, setExpiryUnit] = useState<EXPIRY_UNITS>("")
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
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
      showToast({ text: "Please enter a URL", bgColor: "red", duration: 3000 })
      return
    }

    if (!validateUrl(newUrl)) {
      showToast({ text: "Please enter a valid URL (e.g., https://example.com)", bgColor: "red", duration: 3000 })
      return
    }

    if (hasExpiry && (!expiryDuration || expiryDuration <= 0)) {
      showToast({ text: "Please enter a valid expiration duration", bgColor: "red", duration: 3000 })
      return
    }

    setIsLoading(true)

    try {
      const apiRes = await fetch("/api/url/createShortUrl", {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ 
          originalUrl: newUrl,
          expiryDuration: expiryDuration,
          expiryUnit: expiryUnit
        })
      })
      
      const response: ApiResponse<URLS> = await apiRes.json()
      
      if (!apiRes.ok || !response.success || !response.data) {
        showToast({ 
          text: response.message ?? "Failed to shorten URL", 
          bgColor: "red", 
          duration: 3000 
        })
        setIsLoading(false)
        return
      }
      
      addUrl(response.data)
      showToast({ 
        text: response.message ?? "URL shortened successfully! 🎉", 
        bgColor: "green", // Assuming green/default for success based on your structure
        duration: 3000 
      })
      
      setNewUrl("")
      
      setTimeout(() => {
        router.replace("/dashboard")
      }, 2000)
      
    } catch (error) {
      showToast({ 
        text: "Something went wrong. Please try again.", 
        bgColor: "red", 
        duration: 3000 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
            <div className="w-full space-y-4 flex flex-col items-center text-center">
              <UrlInput
                value={newUrl}
                onChange={setNewUrl}
                onEnter={handleShorten}
                disabled={isLoading}
                placeholder="https://example.com/your-long-url"
              />
              
              {/* Expiration Settings */}
              <div className="w-full max-w-2xl flex flex-col items-start bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80">
                <label className="flex items-center gap-3 cursor-pointer select-none text-zinc-300 text-sm font-medium">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={hasExpiry} 
                      onChange={(e) => setHasExpiry(e.target.checked)} 
                    />
                    <div className="w-10 h-5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 shadow-inner"></div>
                  </div>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    Set an expiration date
                  </span>
                </label>

                {hasExpiry && (
                  <div className="flex items-center gap-3 w-full mt-4 animate-in slide-in-from-top-2 fade-in duration-200">
                    <input 
                      type="number" 
                      disabled={isLoading}
                      value={expiryDuration}
                      onChange={(e) => setExpiryDuration(e.target.value ? parseInt(e.target.value) : "")}
                      className="w-1/2 md:w-32 px-4 py-2.5 bg-zinc-900/80 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50"
                      placeholder="e.g. 7"
                    />
                    <div className="relative w-1/2 md:w-40">
                      <select
                        value={expiryUnit}
                        disabled={isLoading}
                        onChange={(e) => setExpiryUnit(e.target.value as EXPIRY_UNITS)}
                        className="w-full px-4 py-2.5 bg-zinc-900/80 border border-zinc-700 rounded-lg text-zinc-100 focus:border-indigo-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="">Select</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-400">
                        <ChevronDown />
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
      </div>
    </div>
  )
}