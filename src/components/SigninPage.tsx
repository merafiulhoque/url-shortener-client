"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";

import { signupSchema } from "@/validation/schemas";
import { SignupFormData } from "@/validation/schemas";
import { API_URLS } from "@/constants";


export default function SigninPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<SignupFormData>({ email: "john@gmail.com", password: "John@123" });
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

    // 2. POST request to API_URLS.SIGNIN
    try {
      const response = await fetch(API_URLS.SIGNIN, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationResult.data),
      });

      const data: { success: boolean; message: string } = await response.json();

      if (data.success) {
        // 3. Redirect on success (e.g., to a dashboard)
        router.push("/dashboard"); 
      } else {
        // Handle server-side errors (e.g., "Invalid credentials")
        setErrors({ server: data.message || "Failed to sign in. Please check your credentials." });
      }
    } catch (error) {
      setErrors({ server: "A network error occurred. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500">Sign in to manage your links.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                errors.email 
                  ? "border-red-300 focus:ring-red-200 focus:border-red-400" 
                  : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-400"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              {/* Optional: Add a forgot password link if needed */}
              <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                errors.password 
                  ? "border-red-300 focus:ring-red-200 focus:border-red-400" 
                  : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-400"
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          {/* Server Error Message */}
          {errors.server && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 text-center">
              {errors.server}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}