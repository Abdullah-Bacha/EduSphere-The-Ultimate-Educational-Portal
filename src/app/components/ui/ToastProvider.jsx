"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        if (timers.current[id]) {
            clearTimeout(timers.current[id]);
            delete timers.current[id];
        }
    }, []);

    const showToast = useCallback(
        (message, type = "info", duration = 4000) => {
            const id = ++idCounter;
            setToasts((prev) => [...prev, { id, message, type }]);
            timers.current[id] = setTimeout(() => dismissToast(id), duration);
        },
        [dismissToast]
    );

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] ${
                            toast.type === "success"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : toast.type === "error"
                                ? "border-red-200 bg-red-50 text-red-800"
                                : "border-slate-200 bg-white text-slate-800"
                        }`}
                    >
                        {toast.type === "success" && (
                            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                        )}
                        {toast.type === "error" && (
                            <XCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                        )}
                        {toast.type === "info" && (
                            <Info size={18} className="mt-0.5 shrink-0 text-slate-500" />
                        )}

                        <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>

                        <button
                            type="button"
                            onClick={() => dismissToast(toast.id)}
                            className="shrink-0 rounded-md p-0.5 text-current/60 transition hover:bg-black/5"
                            aria-label="Dismiss notification"
                        >
                            <X size={15} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// Returns { showToast(message, type, duration) }. type: "success" | "error" | "info".
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return ctx;
}
