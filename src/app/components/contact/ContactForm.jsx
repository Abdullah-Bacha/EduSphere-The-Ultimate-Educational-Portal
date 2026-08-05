"use client";

import { useState } from "react";

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
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-2xl p-8 space-y-5"
        >
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

            <div className="grid sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Subject
                </label>
                <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Message
                </label>
                <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-8 py-3 transition"
            >
                {status === "loading" ? "Sending..." : "Send Message"}
            </button>
        </form>
    );
}
