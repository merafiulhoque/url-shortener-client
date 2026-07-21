"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

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
    ({ text, bgColor = "#333333", duration = 3000 }: ToastOptions) => {
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
      <div style={containerStyle}>
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
  return (
    <div
      role="status"
      style={{
        ...toastStyle,
        backgroundColor: toast.bgColor,
      }}
      onClick={() => onClose(toast.id)}
    >
      {toast.text}
    </div>
  );
}

// ---------- Styles ----------

const containerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "24px",
  right: "24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "10px",
  zIndex: 9999,
  pointerEvents: "none",
};

const toastStyle: React.CSSProperties = {
  display: "inline-block",
  width: "fit-content",
  maxWidth: "360px",
  padding: "10px 16px",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "14px",
  lineHeight: 1.4,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  cursor: "pointer",
  pointerEvents: "auto",
  animation: "toast-slide-in 0.25s ease-out",
  wordBreak: "break-word",
};

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("toast-keyframes")) {
  const style = document.createElement("style");
  style.id = "toast-keyframes";
  style.textContent = `
    @keyframes toast-slide-in {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}