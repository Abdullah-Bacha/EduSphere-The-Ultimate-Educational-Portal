"use client";

import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

export default function SettingsForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [userId, setUserId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState(null); // { type: "success" | "error", message: string }

    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();

                if (data.success) {
                    setUserId(data.result.id || data.result._id);
                    setFormData((prev) => ({
                        ...prev,
                        name: data.result.name || "",
                        email: data.result.email || "",
                    }));
                } else {
                    setStatus({ type: "error", message: "Unable to load your profile." });
                }
            } catch (error) {
                setStatus({ type: "error", message: "Unable to load your profile." });
            } finally {
                setLoadingUser(false);
            }
        }

        fetchCurrentUser();
    }, []);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!userId) {
            setStatus({ type: "error", message: "Unable to determine your account. Please refresh and try again." });
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            const payload = { name: formData.name, email: formData.email };
            if (formData.password) {
                payload.password = formData.password;
            }

            const res = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus({ type: "error", message: data.message || "Update failed" });
                return;
            }

            setStatus({ type: "success", message: "Settings updated successfully" });
            setFormData((prev) => ({ ...prev, password: "" }));
        } catch (error) {
            setStatus({ type: "error", message: error.message || "Something went wrong" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="px-7 py-6 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">
                        Profile Settings
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Update your personal information and password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-7 space-y-6">
                    {/* Status banner */}
                    {status && (
                        <div
                            className={`flex items-start gap-2.5 text-sm px-4 py-3 rounded-xl border ${status.type === "success"
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                    : "bg-red-50 border-red-100 text-red-600"
                                }`}
                        >
                            {status.type === "success" ? (
                                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                            ) : (
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            )}
                            {status.message}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="pt-1 pb-1">
                        <div className="h-px bg-gray-100" />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current password"
                                className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                            Minimum 8 characters recommended
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading || loadingUser}
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}