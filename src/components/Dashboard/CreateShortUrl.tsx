"use client"

import { ApiResponse, EXPIRY_UNITS, URLS } from "@/types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Zap, ShieldCheck, BarChart3, Clock, ChevronDown, Calendar, Hourglass, Type, Link as LinkIcon, Lock } from "lucide-react"
import { useURLStore } from "@/store/urlStore"
import { useToast } from "../ui/Toast"
import UrlInput, { ActionButton, BackButton } from "../ui/Input"
import { useAuthStore } from "@/store/authStrore"

// Main Page Component
export default function CreateShortUrlPage() {
  const [newUrl, setNewUrl] = useState<string>("")

  // Expiry states
  const [hasExpiry, setHasExpiry] = useState(false)
  const [expiryMode, setExpiryMode] = useState<"duration" | "date">("duration")
  const [expiryDuration, setExpiryDuration] = useState<number | "">("")
  const [expiryUnit, setExpiryUnit] = useState<EXPIRY_UNITS | "">("")
  const [expiryDate, setExpiryDate] = useState<string>("")

  // Premium states
  const [customAlias, setCustomAlias] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const [isLoading, setIsLoading] = useState(false)

  const { showToast } = useToast()
  const router = useRouter()
  const { addUrl } = useURLStore()
  const { user } = useAuthStore()

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

    // Expiry Validations
    if (hasExpiry) {
      if (expiryMode === "duration" && (!expiryDuration || expiryDuration <= 0 || !expiryUnit)) {
        showToast({ text: "Please enter a valid duration and unit", bgColor: "red", duration: 3000 })
        return
      }

      if (expiryMode === "date") {
        if (!expiryDate) {
          showToast({ text: "Please select an expiration date", bgColor: "red", duration: 3000 })
          return
        }
        if (new Date(expiryDate).getTime() <= Date.now()) {
          showToast({ text: "Expiration date must be in the future", bgColor: "red", duration: 3000 })
          return
        }
      }
    }

    setIsLoading(true)

    // Build Payload
    const payload: any = {
      originalUrl: newUrl,
    }

    // Add Premium fields if applicable
    if (user?.isPremium) {
      if (customAlias.trim()) payload.customAlias = customAlias.trim();
      if (password.trim()) payload.password = password.trim();
    }

    if (hasExpiry) {
      if (expiryMode === "duration") {
        payload.expiryDuration = expiryDuration
        payload.expiryUnit = expiryUnit
      } else {
        // Send ISO string for exact dates
        payload.expiryDate = new Date(expiryDate).toISOString()
      }
    }

    try {
      const apiRes = await fetch("/api/url/createShortUrl", {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(payload)
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
        bgColor: "green",
        duration: 3000
      })

      setNewUrl("")
      setCustomAlias("")
      setPassword("")

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
    <div className="h-full w-full overflow-hidden p-2 sm:p-3 flex flex-col items-center justify-center animate-in fade-in duration-500 relative z-0 selection:bg-emerald-700/30 selection:text-emerald-200">
      
      {/* Deep green ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-2xl h-[400px] bg-emerald-700/[0.04] blur-[150px] rounded-full pointer-events-none z-[-1]" />
      
      <div className="w-full max-w-2xl flex flex-col gap-4 relative z-10">

        {/* Header */}
        <div className="space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <BackButton />
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase shadow-inner shadow-emerald-500/5">
              New URL
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Short URL</span>
            </h1>
            <p className="text-zinc-500 text-xs md:text-sm mt-1">
              Transform your long, complex links into short, shareable URLs.
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#09090A] border border-emerald-900/30 rounded-[24px] p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          {/* Subtle Inner Pattern */}
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>

          <div className="flex flex-col items-center gap-4 relative z-10">

            {/* Input Section */}
            <div className="w-full space-y-4 flex flex-col items-center text-center">
              <UrlInput
                value={newUrl}
                onChange={setNewUrl}
                onEnter={handleShorten}
                disabled={isLoading}
                placeholder="https://example.com/your-long-url"
              />

              {/* Premium Features: Custom Alias & Password */}
              {user?.isPremium && (
                <div className="w-full max-w-2xl bg-[#111113] p-4 rounded-2xl border border-white/5 space-y-4 text-left shadow-inner">

                  {/* Custom Alias */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-zinc-300 text-[13px] font-medium">
                      <Type className="w-4 h-4 text-emerald-500" />
                      Custom Alias <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">Premium</span>
                    </label>
                    <div className="flex items-stretch shadow-inner shadow-black/40 rounded-xl group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                      <div className="flex items-center px-4 bg-[#050505] border border-white/10 border-r-0 rounded-l-xl text-zinc-500 text-[13px] group-focus-within:border-emerald-500/50 group-focus-within:text-emerald-500/70 transition-colors">
                        <LinkIcon className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                        domain.com/
                      </div>
                      <input
                        type="text"
                        value={customAlias}
                        onChange={e => setCustomAlias(e.target.value)}
                        disabled={isLoading}
                        placeholder="my-custom-link"
                        className="w-full px-4 py-2.5 bg-[#09090A] border border-white/10 rounded-r-xl text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:bg-[#0a0a0c] disabled:opacity-50 text-[13px]"
                      />
                    </div>
                  </div>

                  {/* Password Protection */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-zinc-300 text-[13px] font-medium">
                      <Lock className="w-4 h-4 text-emerald-500" />
                      Password Protection <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">Premium</span>
                    </label>
                    <div className="relative group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all rounded-xl shadow-inner shadow-black/40">
                      <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={isLoading}
                        placeholder="Leave blank for no password"
                        className="w-full px-4 py-2.5 bg-[#09090A] border border-white/10 rounded-xl text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:bg-[#0a0a0c] disabled:opacity-50 text-[13px]"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* Expiration Settings */}
              <div className="w-full max-w-2xl flex flex-col items-start bg-[#111113] p-4 rounded-2xl border border-white/5 shadow-inner">
                <label className="flex items-center gap-3 cursor-pointer select-none text-zinc-300 text-[13px] font-medium w-full">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={hasExpiry}
                      onChange={(e) => setHasExpiry(e.target.checked)}
                    />
                    <div className="w-9 h-[18px] bg-[#050505] border border-white/10 rounded-full peer peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-zinc-500 peer-checked:after:bg-white after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-emerald-600 peer-checked:border-emerald-500 shadow-inner"></div>
                  </div>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-400 peer-checked:text-emerald-500 transition-colors" />
                    Set an expiration limit
                  </span>
                </label>

                {hasExpiry && (
                  <div className="w-full mt-3 animate-in slide-in-from-top-2 fade-in duration-200 space-y-3 border-t border-white/5 pt-3">

                    {/* Mode Toggle */}
                    <div className="flex bg-[#050505] p-1 rounded-xl border border-white/5 self-start">
                      <button
                        onClick={() => setExpiryMode("duration")}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          expiryMode === "duration"
                            ? "bg-[#18181B] text-white shadow-sm border border-white/5"
                            : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                        }`}
                      >
                        <Hourglass className="w-3.5 h-3.5" />
                        Duration
                      </button>
                      <button
                        onClick={() => setExpiryMode("date")}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          expiryMode === "date"
                            ? "bg-[#18181B] text-white shadow-sm border border-white/5"
                            : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Specific Date
                      </button>
                    </div>

                    {/* Inputs based on Mode */}
                    {expiryMode === "duration" ? (
                      <div className="flex items-center gap-3 w-full animate-in fade-in zoom-in-95 duration-200">
                        <input
                          type="number"
                          min="1"
                          disabled={isLoading}
                          value={expiryDuration}
                          onChange={(e) => setExpiryDuration(e.target.value ? parseInt(e.target.value) : "")}
                          className="w-1/2 md:w-28 px-4 py-2 bg-[#09090A] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:bg-[#0a0a0c] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all disabled:opacity-50 text-[13px]"
                          placeholder="e.g. 7"
                        />
                        <div className="relative w-1/2 md:w-40">
                          <select
                            value={expiryUnit}
                            disabled={isLoading}
                            onChange={(e) => setExpiryUnit(e.target.value as EXPIRY_UNITS)}
                            className="w-full px-4 py-2 bg-[#09090A] border border-white/10 rounded-xl text-white focus:border-emerald-500/50 focus:bg-[#0a0a0c] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 text-[13px]"
                          >
                            <option value="" disabled hidden>Select Unit</option>
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                            <option value="months">Months</option>
                          </select>
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full md:w-64 animate-in fade-in zoom-in-95 duration-200">
                        <input
                          type="datetime-local"
                          disabled={isLoading}
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          className="w-full px-4 py-2 bg-[#09090A] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:bg-[#0a0a0c] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all disabled:opacity-50 [color-scheme:dark] text-[13px]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-zinc-500 text-[11px] font-medium pt-1">
                Press <kbd className="px-1.5 py-0.5 bg-[#18181B] rounded border border-white/10 text-zinc-300 mx-1 font-sans">Enter</kbd> to shorten instantly
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
            <div className="w-full grid grid-cols-3 gap-3 mt-2 pt-4 border-t border-white/5">
              {[
                { icon: <Zap className="w-4 h-4" />, label: "Lightning Fast", desc: "Instant redirects" },
                { icon: <ShieldCheck className="w-4 h-4" />, label: "Secure Links", desc: "HTTPS encryption" },
                { icon: <BarChart3 className="w-4 h-4" />, label: "Track Metrics", desc: "Monitor clicks" }
              ].map((feature) => (
                <div key={feature.label} className="flex flex-col items-center text-center group">
                  <div className="w-9 h-9 mb-2 bg-[#111113] border border-white/5 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all duration-300 shadow-lg shadow-black/40">
                    {feature.icon}
                  </div>
                  <div className="font-semibold text-zinc-200 text-[11px] mb-0.5 tracking-wide">{feature.label}</div>
                  <div className="text-[10px] text-zinc-500">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}