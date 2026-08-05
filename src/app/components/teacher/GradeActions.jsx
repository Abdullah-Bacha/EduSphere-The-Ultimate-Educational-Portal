"use client";

import { Eye, MessageCircle, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function GradeActions({ submissionId, assignmentId, studentId, totalMarks = 100, onGraded }) {
    const { showToast } = useToast();
    const [gradeOpen, setGradeOpen] = useState(false);
    const [marks, setMarks] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitGrade = async () => {
        if (marks === "" || Number(marks) < 0 || Number(marks) > totalMarks) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/teacher/assignments/${assignmentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ submissionId, marksAwarded: Number(marks) }),
            });
            const data = await res.json();
            if (data.success) {
                showToast("Submission graded", "success");
                setGradeOpen(false);
                setMarks("");
                onGraded?.();
            } else {
                showToast(data.message || "Failed to grade submission", "error");
            }
        } catch (err) {
            showToast("Failed to grade submission", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* View Submission */}
            <Link
                href={assignmentId ? `/dashboard/teacher/assignments?assignmentId=${assignmentId}` : "/dashboard/teacher/assignments"}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition text-sm"
                title="View submission"
            >
                <Eye size={16} />
                View
            </Link>

            {/* Quick Grade */}
            <div className="relative">
                <button
                    onClick={() => setGradeOpen(!gradeOpen)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-md hover:bg-indigo-100 transition text-sm"
                    title="Grade assignment"
                >
                    <Check size={16} />
                    Grade
                </button>

                {gradeOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-3">
                        <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Marks (out of {totalMarks})
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="number"
                                min="0"
                                max={totalMarks}
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                                placeholder="e.g. 85"
                                className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm focus:border-indigo-500 focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSubmitGrade}
                            disabled={marks === "" || submitting}
                            className="w-full px-2 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {submitting ? "Saving..." : "Submit Grade"}
                        </button>
                    </div>
                )}
            </div>

            {/* Send Message */}
            <Link
                href={studentId ? `/dashboard/teacher/messages?student=${studentId}` : "/dashboard/teacher/messages"}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition text-sm"
                title="Message student"
            >
                <MessageCircle size={16} />
                Message
            </Link>
        </div>
    );
}
