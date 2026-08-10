"use client"

import { ApiResponse, EXPIRY_UNITS, URLS } from "@/types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Zap, ShieldCheck, BarChart3, Clock, ChevronDown, Calendar, Hourglass, Type, Link as LinkIcon, Lock } from "lucide-react"
import { useURLStore } from "@/store/urlStore"
import { useToast } from "../Toast"
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
    <div className="h-full w-full overflow-hidden p-2 sm:p-3 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="w-full max-w-2xl flex flex-col gap-3">

        {/* Header */}
        <div className="space-y-1.5 shrink-0">
          <div className="flex items-center justify-between">
            <BackButton />
            <div className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase shadow-inner shadow-indigo-500/5">
              New URL
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 leading-tight">
              Create Short URL
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
              Transform your long, complex links into short, shareable URLs.
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 md:p-5 shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center gap-3">

            {/* Input Section */}
            <div className="w-full space-y-3 flex flex-col items-center text-center">
              <UrlInput
                value={newUrl}
                onChange={setNewUrl}
                onEnter={handleShorten}
                disabled={isLoading}
                placeholder="https://example.com/your-long-url"
              />

              {/* Premium Features: Custom Alias & Password */}
              {user?.isPremium && (
                <div className="w-full max-w-2xl bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/80 space-y-2.5 text-left">

                  {/* Custom Alias */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-zinc-300 text-xs font-medium">
                      <Type className="w-3.5 h-3.5 text-indigo-400" />
                      Custom Alias <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">Premium</span>
                    </label>
                    <div className="flex items-stretch shadow-inner shadow-black/20 rounded-lg group focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                      <div className="flex items-center px-3 bg-zinc-900 border border-zinc-800 border-r-0 rounded-l-lg text-zinc-500 text-xs group-focus-within:border-indigo-500/50 group-focus-within:text-zinc-400 transition-colors">
                        <LinkIcon className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                        domain.com/
                      </div>
                      <input
                        type="text"
                        value={customAlias}
                        onChange={e => setCustomAlias(e.target.value)}
                        disabled={isLoading}
                        placeholder="my-custom-link"
                        className="w-full px-3 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-r-lg text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-indigo-500/50 focus:bg-zinc-900 disabled:opacity-50 text-sm"
                      />
                    </div>
                  </div>

                  {/* Password Protection */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-zinc-300 text-xs font-medium">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" />
                      Password Protection <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">Premium</span>
                    </label>
                    <div className="relative group focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all rounded-lg shadow-inner shadow-black/20">
                      <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={isLoading}
                        placeholder="Leave blank for no password"
                        className="w-full px-3 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-indigo-500/50 focus:bg-zinc-900 disabled:opacity-50 text-sm"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* Expiration Settings */}
              <div className="w-full max-w-2xl flex flex-col items-start bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/80">
                <label className="flex items-center gap-3 cursor-pointer select-none text-zinc-300 text-xs font-medium w-full">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={hasExpiry}
                      onChange={(e) => setHasExpiry(e.target.checked)}
                    />
                    <div className="w-9 h-[18px] bg-zinc-800 rounded-full peer peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-indigo-500 shadow-inner"></div>
                  </div>
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    Set an expiration limit
                  </span>
                </label>

                {hasExpiry && (
                  <div className="w-full mt-2.5 animate-in slide-in-from-top-2 fade-in duration-200 space-y-2.5 border-t border-zinc-800/50 pt-2.5">

                    {/* Mode Toggle */}
                    <div className="flex bg-zinc-900/80 p-0.5 rounded-lg border border-zinc-800 self-start">
                      <button
                        onClick={() => setExpiryMode("duration")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                          expiryMode === "duration"
                            ? "bg-zinc-800 text-white shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <Hourglass className="w-3 h-3" />
                        Duration
                      </button>
                      <button
                        onClick={() => setExpiryMode("date")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                          expiryMode === "date"
                            ? "bg-zinc-800 text-white shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        Specific Date
                      </button>
                    </div>

                    {/* Inputs based on Mode */}
                    {expiryMode === "duration" ? (
                      <div className="flex items-center gap-2.5 w-full animate-in fade-in zoom-in-95 duration-200">
                        <input
                          type="number"
                          min="1"
                          disabled={isLoading}
                          value={expiryDuration}
                          onChange={(e) => setExpiryDuration(e.target.value ? parseInt(e.target.value) : "")}
                          className="w-1/2 md:w-28 px-3 py-1.5 bg-zinc-900/80 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50 text-sm"
                          placeholder="e.g. 7"
                        />
                        <div className="relative w-1/2 md:w-36">
                          <select
                            value={expiryUnit}
                            disabled={isLoading}
                            onChange={(e) => setExpiryUnit(e.target.value as EXPIRY_UNITS)}
                            className="w-full px-3 py-1.5 bg-zinc-900/80 border border-zinc-700 rounded-lg text-zinc-100 focus:border-indigo-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 text-sm"
                          >
                            <option value="" disabled hidden>Select Unit</option>
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                            <option value="months">Months</option>
                          </select>
                          <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-zinc-400">
                            <ChevronDown className="w-3.5 h-3.5" />
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
                          className="w-full px-3 py-1.5 bg-zinc-900/80 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50 [color-scheme:dark] text-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-zinc-500 text-[11px]">
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
            <div className="w-full grid grid-cols-3 gap-2 mt-1 pt-3 border-t border-zinc-800/80">
              {[
                { icon: <Zap className="w-4 h-4" />, label: "Lightning Fast", desc: "Instant redirects" },
                { icon: <ShieldCheck className="w-4 h-4" />, label: "Secure Links", desc: "HTTPS encryption" },
                { icon: <BarChart3 className="w-4 h-4" />, label: "Track Metrics", desc: "Monitor clicks" }
              ].map((feature) => (
                <div key={feature.label} className="flex flex-col items-center text-center group">
                  <div className="w-8 h-8 mb-1 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-all duration-300 shadow-lg shadow-black/20">
                    {feature.icon}
                  </div>
                  <div className="font-semibold text-zinc-200 text-xs mb-0.5">{feature.label}</div>
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