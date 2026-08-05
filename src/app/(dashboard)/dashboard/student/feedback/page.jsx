"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquareQuote, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function StudentFeedbackPage() {
    const { showToast } = useToast();
    const [existing, setExisting] = useState(undefined); // undefined = loading, null = none yet
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function load() {
        try {
            const res = await fetch("/api/student/testimonials", { cache: "no-store" });
            const data = await res.json();
            if (data.success) {
                setExisting(data.result);
            }
        } catch (err) {
            console.error("Failed to load testimonial status:", err);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!content.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/student/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: content.trim(), rating }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message, "success");
                setExisting(data.result);
            } else {
                showToast(data.message || "Failed to submit feedback", "error");
            }
        } catch (err) {
            showToast("Failed to submit feedback", "error");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquareQuote size={28} /> Share Your Feedback
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Tell us about your experience — approved feedback is featured on our homepage.
                </p>
            </div>

            {existing === undefined ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 animate-pulse h-40"></div>
            ) : existing ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                            existing.isActive ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}
                    >
                        {existing.isActive ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                        {existing.isActive ? "Published on homepage" : "Pending review"}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={18} fill={i < existing.rating ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <p className="text-slate-700 leading-relaxed">{existing.content}</p>
                    <p className="text-xs text-slate-400">
                        Submitted {new Date(existing.createdAt).toLocaleDateString()}. You can only submit one piece of feedback.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Your Rating</label>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setRating(i + 1)}
                                    className="text-amber-500"
                                >
                                    <Star size={26} fill={i < rating ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Your Feedback</label>
                        <textarea
                            required
                            rows={5}
                            maxLength={500}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Tell us what you liked about learning here..."
                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <p className="text-xs text-slate-400 mt-1 text-right">{content.length}/500</p>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || !content.trim()}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                        {submitting ? "Submitting..." : "Submit Feedback"}
                    </button>
                </form>
            )}
        </div>
    );
}
