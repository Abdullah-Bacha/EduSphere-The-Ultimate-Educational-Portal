"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
    const [dialog, setDialog] = useState(null); // { message, title, confirmText, cancelText, danger }
    const resolverRef = useRef(null);

    const confirm = useCallback((message, options = {}) => {
        return new Promise((resolve) => {
            resolverRef.current = resolve;
            setDialog({
                message,
                title: options.title || "Please confirm",
                confirmText: options.confirmText || "Delete",
                cancelText: options.cancelText || "Cancel",
                danger: options.danger !== false,
            });
        });
    }, []);

    function handleChoice(result) {
        setDialog(null);
        if (resolverRef.current) {
            resolverRef.current(result);
            resolverRef.current = null;
        }
    }

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {dialog && (
                <div
                    className="fixed inset-0 z-[9998] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => handleChoice(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl animate-[fadeIn_0.15s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                    dialog.danger ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                                }`}
                            >
                                <AlertTriangle size={19} />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">{dialog.title}</h3>
                                <p className="mt-1 text-sm text-slate-600">{dialog.message}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => handleChoice(false)}
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                            >
                                {dialog.cancelText}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleChoice(true)}
                                autoFocus
                                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                                    dialog.danger
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                {dialog.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}

// Returns { confirm(message, options) } — confirm() resolves to true/false,
// replacing native window.confirm() with a styled, on-brand dialog.
// options: { title, confirmText, cancelText, danger (default true) }
export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) {
        throw new Error("useConfirm must be used within a ConfirmProvider");
    }
    return ctx;
}
