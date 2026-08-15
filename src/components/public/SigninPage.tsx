"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupSchema } from "@/validation/schemas";
import { SignupFormData } from "@/validation/schemas";
import { useAuthStore } from "@/store/authStrore";
import { LoginResponseData } from "@/types";
import { Loader2, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, Info } from "lucide-react";

export default function SigninPage() {
  const router = useRouter();
  
  // Form state (left default values as in your original code for testing)
  const [formData, setFormData] = useState<SignupFormData>({ email: "john@gmail.com", password: "abcdef" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Password eye state
  
  const signin = useAuthStore(state => state.signin);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field-specific error when user starts typing again
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: undefined, server: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("HANDLE SUBMIT FIRED")
    setIsLoading(true);
    setErrors({});

    // 1. Validate input using your reusable Zod schema
    const validationResult = signupSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(validationResult.data)
      });
      const data: Omit<LoginResponseData, "token"> = await response.json();

      if (!response.ok || !data.success || !data.user) {
        // Handle server-side errors
        setErrors({ server: data.message || "Failed to sign in. Please check your credentials." });
        return;
      }
      signin(data.user);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);      
    } catch (error) {
      setErrors({ server: "A network error occurred. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#000000] text-zinc-300 p-4 sm:p-8 relative selection:bg-emerald-700/30 selection:text-emerald-200 z-0">
      {/* Deep green ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[300px] bg-emerald-700/[0.05] blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[420px] relative z-10 my-8">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-[#0a0a0a] border-2 border-emerald-700/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)] ring-1 ring-emerald-900/30">
            <span className="text-4xl font-bold text-emerald-500 font-serif">W</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-emerald-500 mb-2">
            Welcome back
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base">
            Sign in to manage your links and track analytics.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#09090A] border border-emerald-900/30 rounded-[20px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {/* Subtle Green Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-emerald-600/90 ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors duration-200">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 h-12 text-[16px] sm:text-sm bg-[#111113] hover:bg-[#141417] rounded-xl outline-none transition-all duration-200 text-zinc-200 placeholder:text-zinc-700 border ${
                    errors.email 
                      ? "border-red-900/50 focus:border-red-700 focus:ring-2 focus:ring-red-900/20" 
                      : "border-emerald-900/30 focus:border-emerald-700/60 focus:bg-[#141417] focus:ring-2 focus:ring-emerald-700/10"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-[13px] text-red-500/90 flex items-center gap-1.5 ml-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5"/> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[13px] font-medium text-emerald-600/90" htmlFor="password">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[12px] font-medium text-zinc-500 hover:text-emerald-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors duration-200">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 h-12 text-[16px] sm:text-sm bg-[#111113] hover:bg-[#141417] rounded-xl outline-none transition-all duration-200 text-zinc-200 placeholder:text-zinc-700 border ${
                    errors.password 
                      ? "border-red-900/50 focus:border-red-700 focus:ring-2 focus:ring-red-900/20" 
                      : "border-emerald-900/30 focus:border-emerald-700/60 focus:bg-[#141417] focus:ring-2 focus:ring-emerald-700/10"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-600 hover:text-emerald-500 rounded-lg transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[13px] text-red-500/90 flex items-center gap-1.5 ml-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5"/> {errors.password}
                </p>
              )}
            </div>

            {/* Server Error Message */}
            {errors.server && (
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-900/50 text-[13px] font-medium text-red-500 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{errors.server}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full h-12 mt-4 bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 overflow-hidden shadow-[0_4px_15px_rgba(16,185,129,0.15)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.25)]"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-0" />
              
              <div className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="text-base tracking-wide">Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* System Notices */}
          <div className="mt-7 pt-5 border-t border-white/[0.06] relative z-10">
            <div className="flex items-start gap-3 bg-emerald-500/[0.02] border border-emerald-500/10 p-3.5 rounded-xl shadow-inner">
              <Info className="w-4 h-4 shrink-0 text-emerald-500/70 mt-0.5" />
              <div className="space-y-2.5 text-[11.5px] text-zinc-400 leading-relaxed">
                <p>
                  <strong className="text-zinc-300 font-medium">Server Wake-up:</strong> Our backend runs on a free instance that sleeps during inactivity. We choose to respect our provider's resources rather than artificially keeping it awake, so your initial request may take a few extra seconds to process.
                </p>
                <p>
                  <strong className="text-zinc-300 font-medium">Test Access:</strong> Credentials have been pre-filled for your convenience. Please note that all platform activity is actively monitored by administrators for quality and security.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Link */}
        <p className="mt-10 text-center text-[15px] text-zinc-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-emerald-500 font-semibold hover:text-emerald-400 hover:underline underline-offset-4 decoration-emerald-500/40 transition-all">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}