"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignupFormData, signupSchema } from "@/validation/schemas";
import { API_URLS } from "@/constants";
import { Loader2, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<SignupFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: undefined, server: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

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
      const response = await fetch(API_URLS.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationResult.data),
      });

      const data: { success: boolean; message: string } = await response.json();

      if (data.success) {
        router.push("/signin");
      } else {
        setErrors({ server: data.message || "Failed to create account. Please try again." });
      }
    } catch (error) {
      setErrors({ server: "A network error occurred. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020804] text-emerald-100 p-4 sm:p-8 overflow-hidden relative selection:bg-emerald-600/35 selection:text-emerald-100 z-0">
      {/* Rich deep forest and emerald ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[85%] max-w-[800px] h-[450px] bg-emerald-600/[0.08] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-800/[0.05] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-950/[0.4] blur-[100px] rounded-full pointer-events-none" />

      {/* Main Single-Viewport Wrapper */}
      <div className="w-full max-w-[420px] sm:max-w-xl md:max-w-2xl relative z-10 flex flex-col justify-center h-full max-h-[900px] my-auto">
        
        {/* Back to Home Button (Top Left) */}
        <div className="w-full mb-3 relative z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-emerald-300/80 hover:text-emerald-200 bg-[#041008] border border-emerald-800/40 hover:border-emerald-600/60 px-3.5 py-2 rounded-xl transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)] group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-[#041008] border-2 border-emerald-600/50 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)] ring-1 ring-emerald-800/40">
            <span className="text-4xl font-bold text-emerald-400 font-serif drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">W</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2 drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            Create your account
          </h1>
          <p className="text-emerald-200/70 text-sm sm:text-base font-light">
            Start shortening your links instantly.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#041008] border border-emerald-800/40 rounded-[20px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {/* Enhanced Dark Green Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#059669_1px,transparent_1px),linear-gradient(to_bottom,#059669_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-emerald-300/90 ml-1" htmlFor="email">
                Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/70 group-focus-within:text-emerald-400 transition-colors duration-200">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 h-12 text-[16px] sm:text-sm bg-[#071a0e] hover:bg-[#092213] rounded-xl outline-none transition-all duration-200 text-emerald-100 placeholder:text-emerald-700/50 border ${
                    errors.email 
                      ? "border-red-900/60 focus:border-red-600 focus:ring-2 focus:ring-red-900/30" 
                      : "border-emerald-800/40 focus:border-emerald-500/80 focus:bg-[#092213] focus:ring-2 focus:ring-emerald-600/20"
                  }`}
                  placeholder="Email address"
                />
              </div>
              {errors.email && (
                <p className="text-[13px] text-red-400 flex items-center gap-1.5 ml-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5"/> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-emerald-300/90 ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/70 group-focus-within:text-emerald-400 transition-colors duration-200">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 h-12 text-[16px] sm:text-sm bg-[#071a0e] hover:bg-[#092213] rounded-xl outline-none transition-all duration-200 text-emerald-100 placeholder:text-emerald-700/50 border ${
                    errors.password 
                      ? "border-red-900/60 focus:border-red-600 focus:ring-2 focus:ring-red-900/30" 
                      : "border-emerald-800/40 focus:border-emerald-500/80 focus:bg-[#092213] focus:ring-2 focus:ring-emerald-600/20"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-emerald-600/70 hover:text-emerald-300 rounded-lg transition-colors"
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
                <p className="text-[13px] text-red-400 flex items-center gap-1.5 ml-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5"/> {errors.password}
                </p>
              )}
            </div>

            {/* Server Error Message */}
            {errors.server && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/50 text-[13px] font-medium text-red-400 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{errors.server}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full h-12 mt-3 bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-bold rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 overflow-hidden shadow-[0_4px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_30px_rgba(16,185,129,0.5)] border border-emerald-400/30"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0" />
              
              <div className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-100" />
                    <span className="text-emerald-50">Creating account...</span>
                  </>
                ) : (
                  <>
                    <span className="text-base tracking-wide text-emerald-50">Sign up</span>
                    <ArrowRight className="w-5 h-5 text-emerald-100 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-[15px] text-emerald-200/60 font-light">
          Already have an account?{" "}
          <Link href="/signin" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline underline-offset-4 decoration-emerald-400/40 transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}