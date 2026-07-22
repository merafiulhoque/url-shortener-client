"use client";

import { useState } from 'react';
import { ApiResponse } from '@/types';
import { useToast } from './Toast';

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
  <svg className="w-5 h-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function GetPremium() {
  const { showToast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<number | null>(null);

  const handlePayment = async (price: number) => {
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
          color: "#6366f1", // Indigo-500 to match the dark theme accents
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
    <div className="h-full bg-zinc-950 text-zinc-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Premium</span>
        </h1>
        <p className="text-lg text-zinc-400">
          Unlock advanced analytics, custom aliases, and unlimited links. Choose the plan that works best for you.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
        
        {/* Monthly Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl shadow-xl flex flex-col hover:border-zinc-700 transition-colors duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-zinc-300">Monthly</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              ₹199
              <span className="ml-1 text-xl font-medium text-zinc-500">/mo</span>
            </div>
            <p className="mt-4 text-sm text-zinc-400">Perfect for trying out our premium features.</p>
          </div>
          
          <ul className="mt-4 mb-8 space-y-4 flex-1">
            <li className="flex items-center gap-3"><CheckIcon /> <span className="text-zinc-300">Unlimited Link Creations</span></li>
            <li className="flex items-center gap-3"><CheckIcon /> <span className="text-zinc-300">Basic Analytics</span></li>
            <li className="flex items-center gap-3"><CheckIcon /> <span className="text-zinc-300">Custom Aliases</span></li>
          </ul>
          
          <button 
            onClick={() => handlePayment(199)}
            disabled={loadingPlan === 199}
            className="w-full py-3.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingPlan === 199 ? "Processing..." : "Get Monthly"}
          </button>
        </div>

        {/* Yearly Card (Highlighted) */}
        <div className="relative bg-gradient-to-b from-indigo-900/20 to-zinc-900/50 border border-indigo-500/50 p-8 rounded-3xl shadow-2xl shadow-indigo-500/10 flex flex-col transform md:-translate-y-4">
          
          {/* Popular Badge */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
              Best Value
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-indigo-400">Yearly</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              ₹1999
              <span className="ml-1 text-xl font-medium text-zinc-500">/yr</span>
            </div>
            <p className="mt-4 text-sm text-zinc-400">Save over 15% when you pay annually.</p>
          </div>
          
          <ul className="mt-4 mb-8 space-y-4 flex-1">
            <li className="flex items-center gap-3"><CheckIcon /> <span className="text-zinc-300">Everything in Monthly</span></li>
            <li className="flex items-center gap-3"><CheckIcon /> <span className="text-zinc-300">Advanced Click Analytics</span></li>
            <li className="flex items-center gap-3"><CheckIcon /> <span className="text-zinc-300">QR Code Generation</span></li>
            <li className="flex items-center gap-3"><CheckIcon /> <span className="text-zinc-300">Priority Support</span></li>
          </ul>
          
          <button 
            onClick={() => handlePayment(1999)}
            disabled={loadingPlan === 1999}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingPlan === 1999 ? "Processing..." : "Get Yearly"}
          </button>
        </div>

      </div>
    </div>
  );
}