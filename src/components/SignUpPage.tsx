"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignupFormData, signupSchema } from "@/validation/schemas";
import { API_URLS } from "@/constants";
import { Loader2, Mail, Lock, AlertCircle, ArrowRight, UserPlus } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<SignupFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field-specific error when user starts typing again
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: undefined, server: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate input using Zod
    const validationResult = signupSchema.safeParse(formData);

    if (!validationResult.success) {
      // Map Zod errors to our local state
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setIsLoading(false);
      return;
    }

    // POST request to API
    try {
      const response = await fetch(API_URLS.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationResult.data),
      });

      const data: { success: boolean; message: string } = await response.json();

      if (data.success) {
        // Redirect on success
        router.push("/signin");
      } else {
        // Handle server-side errors
        setErrors({ server: data.message || "Failed to create account. Please try again." });
      }
    } catch (error) {
      setErrors({ server: "A network error occurred. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-50 p-4 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Ambient Background Glow Effect */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-black/50 border border-zinc-800 p-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-4 shadow-inner shadow-indigo-500/5">
            <UserPlus className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
            Create an account
          </h1>
          <p className="text-zinc-400 text-sm">Start shortening your links today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="group">
            <label className="block text-sm font-semibold text-zinc-300 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3.5 bg-zinc-900/50 backdrop-blur-sm rounded-xl outline-none transition-all duration-300 shadow-inner shadow-black/20 text-zinc-100 placeholder:text-zinc-600 border ${
                  errors.email 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                    : "border-zinc-800 focus:border-indigo-500/50 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10"
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs font-medium text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/> {errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="group">
            <label className="block text-sm font-semibold text-zinc-300 mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3.5 bg-zinc-900/50 backdrop-blur-sm rounded-xl outline-none transition-all duration-300 shadow-inner shadow-black/20 text-zinc-100 placeholder:text-zinc-600 border ${
                  errors.password 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                    : "border-zinc-800 focus:border-indigo-500/50 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10"
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1.5 text-xs font-medium text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/> {errors.password}</p>}
          </div>

          {/* Server Error Message */}
          {errors.server && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.server}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full py-3.5 px-4 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden flex items-center justify-center gap-2"
          >
            {/* Button Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Sign Up
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/signin" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)' }}></div>
    </div>
  );
}