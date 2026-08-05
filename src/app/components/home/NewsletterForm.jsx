"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (data.success) {
                setStatus("success");
                setMessage(data.message);
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.message || "Something went wrong.");
            }
        } catch (err) {
            setStatus("error");
            setMessage("Something went wrong. Please try again.");
        }
    }

    return (
        <div>
            <h3 className="text-xl font-semibold mb-3">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
                Get new courses and updates delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 min-w-0 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
                    aria-label="Subscribe"
                >
                    <Send size={16} />
                </button>
            </form>
            {message && (
                <p className={`text-xs mt-2 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
