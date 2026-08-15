"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

// ---------- Types ----------

interface ToastOptions {
  text: string;
  bgColor?: string;
  /** ms before auto-dismiss. Pass 0 to disable auto-dismiss. Default: 3000 */
  duration?: number;
}

interface ToastItem extends Required<Omit<ToastOptions, "duration">> {
  id: number;
  duration: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

// ---------- Context ----------

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}

// ---------- Provider ----------

let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    ({ text, bgColor = "default", duration = 3000 }: ToastOptions) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, text, bgColor, duration }]);

      if (duration > 0) {
        const timer = setTimeout(() => removeToast(id), duration);
        timers.current.set(id, timer);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Container */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 flex flex-col items-end gap-3 z-[10000] pointer-events-none">
        {toasts.map((toast) => (
          <ToastItemView key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ---------- Single toast ----------

function ToastItemView({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: (id: number) => void;
}) {
  // Map legacy color strings to our premium dark greenery theme classes
  const isGreen = toast.bgColor === "green" || toast.bgColor.includes("emerald");
  const isRed = toast.bgColor === "red";

  const themeClasses = isGreen
    ? "bg-[#09090A] border-emerald-900/50 shadow-[0_10px_30px_rgba(16,185,129,0.15)]"
    : isRed
    ? "bg-[#09090A] border-red-900/50 shadow-[0_10px_30px_rgba(220,38,38,0.15)]"
    : "bg-[#09090A] border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]";

  const Icon = isGreen ? CheckCircle2 : isRed ? AlertCircle : Info;
  const iconColor = isGreen ? "text-emerald-500" : isRed ? "text-red-500" : "text-zinc-400";

  return (
    <div
      role="status"
      onClick={() => onClose(toast.id)}
      className={`flex items-start gap-3 w-fit max-w-[320px] sm:max-w-[380px] px-5 py-4 rounded-2xl border backdrop-blur-xl cursor-pointer pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300 relative overflow-hidden group ${themeClasses}`}
    >
      {/* Subtle Inner Glow */}
      {isGreen && <div className="absolute top-0 left-0 w-full h-[50px] bg-emerald-500/[0.03] blur-[20px] pointer-events-none z-0" />}
      {isRed && <div className="absolute top-0 left-0 w-full h-[50px] bg-red-500/[0.03] blur-[20px] pointer-events-none z-0" />}
      
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 relative z-10 ${iconColor}`} />
      
      <p className="text-[13px] font-medium text-zinc-200 leading-relaxed break-words relative z-10">
        {toast.text}
      </p>
    </div>
  );
}