"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { SignupFormData, signupSchema } from "@/validation/schemas";
import { API_URLS } from "@/constants";



// Infer the type from the schema for our state


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

    // 2. Validate input using Zod
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

    // 3. POST request to API_URLS.SIGNUP
    try {
      const response = await fetch(API_URLS.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationResult.data),
      });

      const data: { success: boolean; message: string } = await response.json();

      if (data.success) {
        // 4. Redirect on success
        router.push("/signin");
      } else {
        // Handle server-side validation/business logic errors (e.g., "Email already in use")
        setErrors({ server: data.message || "Failed to create account. Please try again." });
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create an account</h1>
          <p className="text-slate-500">Start shortening your links today.</p>
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
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
              Password
            </label>
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
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/signin" className="text-indigo-600 font-semibold hover:text-indigo-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}