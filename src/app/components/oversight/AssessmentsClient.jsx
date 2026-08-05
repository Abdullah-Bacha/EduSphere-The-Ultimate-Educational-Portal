"use client";

import {
    Brain,
    ClipboardList,
    CheckCircle2,
    Clock,
    Inbox,
    Target,
} from "lucide-react";
import StatGrid from "@/app/components/admin/StatGrid";

function formatDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function scoreColor(pct) {
    if (pct >= 70) return "bg-emerald-50 text-emerald-700";
    if (pct >= 40) return "bg-amber-50 text-amber-700";
    return "bg-red-50 text-red-700";
}

export default function AssessmentsClient({ data }) {
    const quiz = data?.quiz || {};
    const assignment = data?.assignment || {};
    const recentAttempts = data?.recentAttempts || [];
    const recentSubmissions = data?.recentSubmissions || [];

    const statItems = [
        { label: "Total quizzes", value: quiz.total ?? 0, icon: Brain, tint: "bg-blue-50 text-blue-600" },
        { label: "Quiz attempts", value: quiz.attempts ?? 0, icon: Target, tint: "bg-indigo-50 text-indigo-600" },
        { label: "Avg. quiz score", value: `${quiz.avgScore ?? 0}%`, icon: Target, tint: "bg-emerald-50 text-emerald-600" },
        { label: "Assignments", value: assignment.total ?? 0, icon: ClipboardList, tint: "bg-amber-50 text-amber-600" },
        { label: "Submissions", value: assignment.submissions ?? 0, icon: ClipboardList, tint: "bg-slate-100 text-slate-600" },
        { label: "Graded", value: assignment.graded ?? 0, icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-600" },
        { label: "Pending grading", value: assignment.pending ?? 0, icon: Clock, tint: "bg-red-50 text-red-600" },
    ];

    return (
        <div className="space-y-5">
            <StatGrid items={statItems} columns={4} />

            <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
                        <Brain size={16} className="text-gray-400" />
                        <h2 className="text-sm font-semibold text-gray-900">
                            Recent quiz attempts
                        </h2>
                    </div>
                    {recentAttempts.length === 0 ? (
                        <EmptyBlock label="No quiz attempts yet" />
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {recentAttempts.map((a) => (
                                <li
                                    key={a._id}
                                    className="flex items-center justify-between gap-3 px-5 py-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">
                                            {a.quiz}
                                        </p>
                                        <p className="truncate text-xs text-gray-400">
                                            {a.student} · {formatDate(a.date)}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${scoreColor(a.percentage)}`}
                                    >
                                        {a.score}/{a.total} · {a.percentage}%
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
                        <ClipboardList size={16} className="text-gray-400" />
                        <h2 className="text-sm font-semibold text-gray-900">
                            Recent submissions
                        </h2>
                    </div>
                    {recentSubmissions.length === 0 ? (
                        <EmptyBlock label="No submissions yet" />
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {recentSubmissions.map((s) => (
                                <li
                                    key={s._id}
                                    className="flex items-center justify-between gap-3 px-5 py-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">
                                            {s.assignment}
                                        </p>
                                        <p className="truncate text-xs text-gray-400">
                                            {s.student} · {formatDate(s.date)}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${
                                            s.status === "Graded"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-amber-50 text-amber-700"
                                        }`}
                                    >
                                        {s.status === "Graded" && s.marks != null
                                            ? `${s.marks}${s.totalMarks ? `/${s.totalMarks}` : ""}`
                                            : s.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

function EmptyBlock({ label }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox className="mb-2 h-6 w-6 text-gray-300" />
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    );
}
