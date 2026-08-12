"use client";

import { useState } from "react";
import { Send, ShieldCheck } from "lucide-react";

const initialForm = {
    name: "",
    email: "",
    subject: "",
    message: "",
};

export default function ContactForm() {
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [error, setError] = useState("");

    function handleChange(e) {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("loading");
        setError("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setStatus("error");
                setError(data.message || "Something went wrong. Please try again.");
                return;
            }

            setStatus("success");
            setForm(initialForm);
        } catch (err) {
            setStatus("error");
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="bg-white border border-gray-100 rounded-[24px] shadow-[0_20px_12px_rgba(219,234,254,0.3),0_8px_5px_rgba(219,234,254,0.3)] p-10">
            <h2 className="text-2xl font-extrabold text-gray-900">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                {status === "success" && (
                    <div className="rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm">
                        Thanks for reaching out! We&apos;ll get back to you soon.
                    </div>
                )}

                {status === "error" && (
                    <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full rounded-[14px] border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-[14px] border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Subject
                    </label>
                    <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="w-full rounded-[14px] border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Message
                    </label>
                    <textarea
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Write your message..."
                        className="w-full rounded-[14px] border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-60 text-white font-semibold py-3.5 transition-shadow hover:shadow-lg"
                >
                    <Send size={16} />
                    {status === "loading" ? "Sending..." : "Send Message"}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    We usually respond within 1 business day.
                </p>
            </form>
        </div>
    );
}
