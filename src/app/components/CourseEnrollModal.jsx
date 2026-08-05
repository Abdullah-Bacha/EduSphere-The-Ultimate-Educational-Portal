"use client";

import { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";

export default function CourseEnrollModal({ courseId, courseName, onClose, onEnrollSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleRegister(e) {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Sabhi fields required hain");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords match nahi ho rahe");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password kam se kam 6 characters ka hona chahiye");
            return;
        }

        setLoading(true);

        try {
            const registerRes = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: "student",
                }),
            });

            const registerData = await registerRes.json();

            if (!registerRes.ok) {
                setError(registerData.message || "Registration fail ho gayi");
                setLoading(false);
                return;
            }

            // Auto enroll after registration
            const enrollRes = await fetch(`/api/students/${courseId}/enroll`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const enrollData = await enrollRes.json();

            if (enrollData.success) {
                onEnrollSuccess();
            } else {
                setError(enrollData.message || "Enrollment fail ho gayi");
            }
        } catch (err) {
            setError("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Email aur password required hain");
            return;
        }

        setLoading(true);

        try {
            const loginRes = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const loginData = await loginRes.json();

            if (!loginRes.ok) {
                setError(loginData.message || "Login fail ho gayi");
                setLoading(false);
                return;
            }

            // Auto enroll after login
            const enrollRes = await fetch(`/api/students/${courseId}/enroll`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const enrollData = await enrollRes.json();

            if (enrollData.success) {
                onEnrollSuccess();
            } else {
                setError(enrollData.message || "Enrollment fail ho gayi");
            }
        } catch (err) {
            setError("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {isLogin ? "Login" : "Register"}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {courseName} course ke liye
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <X size={24} className="text-slate-600" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <User size={16} className="inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Apka naam"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Mail size={16} className="inline mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="aapka@email.com"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Lock size={16} className="inline mr-2" />
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Password dobara likhen"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-600 text-sm">
                            {isLogin ? "Account nahi hai?" : "Pehle se account hai?"}
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError("");
                                    setFormData({
                                        email: "",
                                        password: "",
                                        name: "",
                                        confirmPassword: "",
                                    });
                                }}
                                className="ml-2 text-blue-600 hover:underline font-semibold"
                            >
                                {isLogin ? "Register" : "Login"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
