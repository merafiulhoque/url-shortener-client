"use client";

import { useState } from 'react';
import { ApiResponse } from '@/types';
import { useToast } from '../ui/Toast';
import { useAuthStore } from '@/store/authStrore';
import { Loader2 } from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Checkmark Icon Component for the features list
const CheckIcon = () => (
  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
    <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

export default function GetPremium() {
  const { showToast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<number | null>(null);
  const { user, upgradeToPremium } = useAuthStore()

  const handlePayment = async (price: number) => {
    if(!user) return
    
    setLoadingPlan(price);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Failed to load Razorpay. Check your internet.");
        setLoadingPlan(null);
        return;
      }

      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price }),
      });
      
      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_TEST_API_KEY!,
        amount: order.amount,
        currency: order.currency,
        name: "URL Shortener",
        description: price === 1999 ? "Yearly Premium Subscription" : "Monthly Premium Subscription",
        order_id: order.id,
        
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/payments/verify-payment", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData: ApiResponse<null> = await verifyResponse.json();

            if(verifyData.success){
              upgradeToPremium(user)
            }
            
            showToast({
              text: verifyData.message,
              bgColor: verifyData.success ? "green":"red",
              duration: 3000
            })
            return
          } catch (error) {
            showToast({
              text: error instanceof Error ? error.message : "Something went wrong",
              bgColor: "red",
              duration: 3000
            });
          }
        },
        theme: {
          color: "#10B981", // Emerald-500 matching the theme
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        showToast({ text: "Payment cancelled or failed", bgColor: "red", duration: 3000 });
      });

      rzp.open();
    } catch (error) {
      showToast({ text: "Error initiating payment", bgColor: "red", duration: 3000 });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-zinc-300 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden selection:bg-emerald-700/30 selection:text-emerald-200 z-0">
      
      {/* Deep green ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-[400px] bg-emerald-700/[0.05] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-900/[0.03] blur-[120px] rounded-full pointer-events-none" />

      {/* Subtle Green Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)' }}></div>

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center p-2 px-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-6 text-sm font-medium text-emerald-400">
          Supercharge your links
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white">
          Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Premium</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light">
          Unlock advanced analytics, custom aliases, and unlimited links. Choose the plan that works best for your workflow.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        
        {/* Monthly Card */}
        <div className="bg-[#09090A] border border-white/5 hover:border-emerald-900/30 p-8 sm:p-10 rounded-[24px] shadow-2xl flex flex-col transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="mb-8 relative z-10">
            <h3 className="text-xl font-medium text-zinc-300">Monthly</h3>
            <div className="mt-4 flex items-baseline text-5xl font-bold text-white">
              ₹199
              <span className="ml-2 text-lg font-medium text-zinc-500">/mo</span>
            </div>
            <p className="mt-4 text-sm text-zinc-500">Perfect for trying out our premium features.</p>
          </div>
          
          <ul className="mt-4 mb-10 space-y-5 flex-1 relative z-10">
            <li className="flex items-center gap-4"><CheckIcon /> <span className="text-zinc-300 text-sm sm:text-base">Unlimited Link Creations</span></li>
            <li className="flex items-center gap-4"><CheckIcon /> <span className="text-zinc-300 text-sm sm:text-base">Basic Analytics</span></li>
            <li className="flex items-center gap-4"><CheckIcon /> <span className="text-zinc-300 text-sm sm:text-base">Custom Aliases</span></li>
          </ul>
          
          <button 
            onClick={() => handlePayment(199)}
            disabled={loadingPlan === 199}
            className="w-full h-14 px-4 bg-[#111113] hover:bg-[#18181B] border border-white/10 text-white rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 relative z-10"
          >
            {loadingPlan === 199 ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : "Get Monthly"}
          </button>
        </div>

        {/* Yearly Card (Highlighted) */}
        <div className="bg-[#09090A] border border-emerald-700/50 p-8 sm:p-10 rounded-[24px] shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col transform md:-translate-y-4 relative overflow-hidden">
          
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] to-transparent pointer-events-none" />

          {/* Popular Badge */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <div className="bg-emerald-500 text-black text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-b-xl shadow-md">
              Best Value
            </div>
          </div>

          <div className="mb-8 mt-2 relative z-10">
            <h3 className="text-xl font-medium text-emerald-500">Yearly</h3>
            <div className="mt-4 flex items-baseline text-5xl font-bold text-white">
              ₹1999
              <span className="ml-2 text-lg font-medium text-emerald-600/60">/yr</span>
            </div>
            <p className="mt-4 text-sm text-zinc-400">Save over 15% when you pay annually.</p>
          </div>
          
          <ul className="mt-4 mb-10 space-y-5 flex-1 relative z-10">
            <li className="flex items-center gap-4"><CheckIcon /> <span className="text-zinc-200 text-sm sm:text-base">Everything in Monthly</span></li>
            <li className="flex items-center gap-4"><CheckIcon /> <span className="text-zinc-200 text-sm sm:text-base">Advanced Click Analytics</span></li>
            <li className="flex items-center gap-4"><CheckIcon /> <span className="text-zinc-200 text-sm sm:text-base">QR Code Generation</span></li>
            <li className="flex items-center gap-4"><CheckIcon /> <span className="text-zinc-200 text-sm sm:text-base">Priority Support</span></li>
          </ul>
          
          <button 
            onClick={() => handlePayment(1999)}
            disabled={loadingPlan === 1999}
            className="group relative w-full h-14 px-4 bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 overflow-hidden shadow-[0_4px_15px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] z-10"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-0" />
            <div className="relative z-10 flex items-center gap-2">
              {loadingPlan === 1999 ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : "Get Yearly"}
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}