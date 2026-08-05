"use client";

import { useEffect, useState } from "react";
import { Megaphone, Users, GraduationCap, UsersRound, Send, Loader2 } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";

const AUDIENCE_OPTIONS = [
    { value: "all", label: "Everyone", icon: UsersRound },
    { value: "student", label: "Students", icon: Users },
    { value: "teacher", label: "Teachers", icon: GraduationCap },
];

export default function AnnouncementForm({ counts: propCounts, onSent }) {
    const { showToast } = useToast();

    const [counts, setCounts] = useState(propCounts ?? { all: 0, student: 0, teacher: 0 });
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [audience, setAudience] = useState("all");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (propCounts) { setCounts(propCounts); return; }
        fetch("/api/announcements/counts", { cache: "no-store" })
            .then(r => r.json())
            .then(d => { if (d.success) setCounts(d.result); })
            .catch(() => {});
    }, [propCounts]);

    const reach = counts?.[audience] ?? 0;

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim() || !message.trim()) {
            showToast("Title and message are required.", "error");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    message: message.trim(),
                    audience,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.message || "Failed to send announcement.");
            }

            showToast(
                data?.message || `Announcement sent to ${data?.result?.count} user(s).`,
                "success"
            );
            setTitle("");
            setMessage("");
            onSent?.();
        } catch (err) {
            showToast(err.message || "Something went wrong.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl space-y-6 rounded-xl border bg-white p-6 shadow-sm sm:p-8"
        >
            <div className="flex items-center gap-3 border-b pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Megaphone size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        New announcement
                    </h2>
                    <p className="text-sm text-gray-500">
                        This will appear in each recipient&apos;s notifications.
                    </p>
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Audience
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {AUDIENCE_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const active = audience === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setAudience(opt.value)}
                                className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm font-medium transition ${
                                    active
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <Icon size={18} />
                                {opt.label}
                                <span className="text-xs font-normal text-gray-400">
                                    {counts?.[opt.value] ?? 0}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Scheduled maintenance this weekend"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    required
                />
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Message <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Write the details of your announcement…"
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    required
                />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
                <p className="text-sm text-gray-500">
                    Will reach{" "}
                    <span className="font-semibold text-gray-900">{reach}</span>{" "}
                    recipient(s).
                </p>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {loading ? "Sending…" : "Send announcement"}
                </button>
            </div>
        </form>
    );
}
