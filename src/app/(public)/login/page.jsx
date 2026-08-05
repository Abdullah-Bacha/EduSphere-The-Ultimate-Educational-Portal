"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, GraduationCap, Lock, Mail } from "lucide-react";

export default function LoginPage() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setStatus(null);

        try {

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus({ type: "error", message: data.message || "Login failed" });
                return;
            }

            switch (data.user.role) {

                case "admin":
                    router.push("/dashboard/admin");
                    break;

                case "teacher":
                    router.push("/dashboard/teacher");
                    break;

                case "student":
                    router.push("/dashboard/student");
                    break;

                default:
                    router.push("/");
            }

            router.refresh();

        } catch (error) {

            setStatus({ type: "error", message: error.message || "Something went wrong" });

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#f1f5f9_100%)] px-4 py-16">
            <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_20px_80px_-24px_rgba(15,23,42,0.35)] lg:flex-row">
                <div className="flex flex-1 flex-col justify-between bg-slate-950 p-8 text-white lg:p-10">
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                            <GraduationCap size={24} />
                        </div>
                        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">Welcome back to your learning hub.</h1>
                        <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">Access your courses, assignments, and progress in a calm, premium workspace built for modern learning teams.</p>
                    </div>
                    <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                        <p className="font-medium text-white">Secure and fast</p>
                        <p className="mt-2">Sign in to continue with your existing account and pick up right where you left off.</p>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-center p-8 lg:p-10">
                    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Log in</p>
                            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900">Sign in to continue</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="block">
                                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><Mail size={16} /> Email</span>
                                <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required className="ds-input h-11" />
                            </label>

                            <label className="block">
                                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><Lock size={16} /> Password</span>
                                <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required className="ds-input h-11" />
                            </label>
                        </div>

                        {status && (
                            <p
                                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                                    status.type === "success"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-red-50 text-red-700"
                                }`}
                            >
                                {status.message}
                            </p>
                        )}

                        <button type="submit" disabled={loading} className="ds-btn ds-btn-primary h-11 w-full rounded-2xl">
                            {loading ? "Signing in..." : "Sign in"}
                            <ArrowRight size={16} />
                        </button>

                        <p className="text-center text-sm text-slate-500">
                            New here?{' '}
                            <Link href="/register" className="font-semibold text-indigo-600 transition hover:text-indigo-700">Create an account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}