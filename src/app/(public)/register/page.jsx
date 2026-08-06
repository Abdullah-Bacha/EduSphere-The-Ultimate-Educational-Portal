"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, GraduationCap, Lock, Mail, UserCircle2 } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: "success" | "error", message }

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus({ type: "error", message: data.message || "Registration failed" });
                return;
            }

            setStatus({ type: "success", message: "Registration successful! Redirecting to sign in..." });
            setTimeout(() => router.push("/login"), 1200);
        } catch (error) {
            setStatus({ type: "error", message: error.message || "Something went wrong" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.08),_transparent_30%),linear-gradient(135deg,_var(--bg-main)_0%,_var(--surface)_100%)] px-4 py-16">
            <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-card lg:flex-row">
                <div className="flex flex-1 flex-col justify-between bg-[var(--text-primary)] p-8 text-white lg:p-10">
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-white/10">
                            <GraduationCap size={24} />
                        </div>
                        <h1 className="mt-6 text-3xl lg:text-4xl font-semibold leading-tight">Create your account and launch your learning journey.</h1>
                        <p className="mt-3 max-w-md text-sm leading-7 text-white/70">Join as a student and experience a polished learning workspace from day one. Teacher and admin accounts are created by your institution's administrator.</p>
                    </div>
                    <div className="mt-8 rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                        <p className="font-medium text-white">Designed for modern learning teams</p>
                        <p className="mt-2">Every interaction is tuned for clarity, trust, and premium product feel.</p>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-center p-8 lg:p-10">
                    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Register</p>
                            <h2 className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">Create your account</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="block">
                                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]"><UserCircle2 size={16} /> Full name</span>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="ds-input h-11" />
                            </label>

                            <label className="block">
                                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]"><Mail size={16} /> Email</span>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="ds-input h-11" />
                            </label>

                            <label className="block">
                                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]"><Lock size={16} /> Password</span>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="ds-input h-11" />
                            </label>
                        </div>

                        {status && (
                            <p
                                className={`rounded-[var(--radius-md)] px-4 py-3 text-sm font-medium ${
                                    status.type === "success"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-red-50 text-red-700"
                                }`}
                            >
                                {status.message}
                            </p>
                        )}

                        <button type="submit" disabled={loading} className="ds-btn ds-btn-primary h-11 w-full rounded-[var(--radius-md)]">
                            {loading ? "Creating account..." : "Create account"}
                            <ArrowRight size={16} />
                        </button>

                        <p className="text-center text-sm text-[var(--text-secondary)]">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-[var(--accent)] transition hover:text-[var(--accent-hover)]">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}