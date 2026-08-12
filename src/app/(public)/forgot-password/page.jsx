"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, KeyRound, Mail, ShieldCheck } from "lucide-react";
import AuthLeftPanel from "@/app/components/auth/AuthLeftPanel";

const BULLETS = [
    { icon: ShieldCheck, text: "Secure identity verification" },
    { icon: KeyRound, text: "Quick account recovery" },
    { icon: Mail, text: "Instructions sent straight to your inbox" },
];

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus({ type: "error", message: data.message || "Something went wrong" });
                return;
            }

            setStatus({ type: "success", message: data.message });
        } catch (error) {
            setStatus({ type: "error", message: error.message || "Something went wrong" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-[rgba(249,250,251,0.8)] p-3 sm:p-6">
            <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-2xl lg:h-[calc(100vh-4rem-3rem)] lg:max-h-[680px] lg:flex-row lg:rounded-[28px]">
                <AuthLeftPanel
                    heading1="Reset Your"
                    heading2="Password Securely"
                    description="No worries — enter your email and we'll help you get back into your account quickly and securely."
                    bullets={BULLETS}
                />

                {/* RightPanel */}
                <div className="flex w-full flex-1 items-center justify-center overflow-y-auto p-5 sm:p-7 lg:p-8">
                    <div className="w-full max-w-[400px]">
                        <div className="flex items-center gap-2">
                            <div
                                className="flex shrink-0 items-center justify-center rounded-[12px] p-[5px] drop-shadow-[0px_4px_3px_#bedbff]"
                                style={{ backgroundImage: "linear-gradient(135deg, rgb(43,127,255) 0%, rgb(79,57,246) 100%)" }}
                            >
                                <GraduationCap size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-[14px] font-extrabold leading-[14px] tracking-[-0.4px] text-[#101828]">LMS University</p>
                                <p className="mt-[5px] text-[9px] font-medium uppercase leading-[9px] tracking-[0.5px] text-[#99a1af]">
                                    Learning Management System
                                </p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <p className="text-[11px] font-bold uppercase leading-4 tracking-[1.2px] text-[#155dfc]">Forgot Password</p>
                            <h1 className="mt-0.5 text-[22px] font-extrabold leading-7 tracking-[-0.5px] text-[#101828]">
                                Reset your password
                            </h1>
                            <p className="mt-1 text-[12.5px] leading-5 text-[#6a7282]">
                                Enter the email linked to your account and we&rsquo;ll send you instructions to reset your password.
                            </p>
                        </div>

                        <div className="mt-4 w-full rounded-2xl border border-[#f3f4f6] bg-white p-4 shadow-[0px_10px_7.5px_rgba(229,231,235,0.4),0px_4px_3px_rgba(229,231,235,0.4)] sm:p-5">
                            <form onSubmit={handleSubmit} className="w-full">
                                <label className="block">
                                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.6px] text-[#4a5565]">
                                        Email Address
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-[42px] w-full rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-3.5 text-[13.5px] text-[#101828] placeholder:text-[#99a1af] outline-none transition focus:border-[#155dfc] focus:bg-white focus:ring-2 focus:ring-[#155dfc]/20"
                                    />
                                </label>

                                {status && (
                                    <div
                                        className={`mt-3 flex items-start gap-2 rounded-[12px] border px-3.5 py-2.5 text-[12.5px] font-medium leading-4 ${
                                            status.type === "success"
                                                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                                : "border-red-100 bg-red-50 text-red-700"
                                        }`}
                                    >
                                        {status.type === "success" ? (
                                            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                                        ) : (
                                            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                                        )}
                                        <p>{status.message}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-3.5 flex h-[44px] w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#155dfc] to-[#4f39f6] text-[14px] font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                    <ArrowRight size={15} />
                                </button>
                            </form>
                        </div>

                        <p className="mt-3.5 flex items-center justify-center gap-1.5 text-center text-[12.5px] text-[#6a7282]">
                            <Link href="/login" className="flex items-center gap-1.5 font-semibold text-[#155dfc] transition hover:text-[#4f39f6]">
                                <ArrowLeft size={13} />
                                Back to sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
