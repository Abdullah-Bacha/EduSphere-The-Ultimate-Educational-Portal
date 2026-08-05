"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";
import { BarChart3, Users, BookOpen, Award, TrendingUp, Download } from "lucide-react";

const GRADE_COLORS = ["#f87171", "#fb923c", "#fbbf24", "#60a5fa", "#34d399"];

export default function TeacherAnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/teacher/analytics", { cache: "no-store" });
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                } else {
                    setError(json.message || "Failed to load analytics.");
                }
            } catch (err) {
                console.error("Failed to load analytics:", err);
                setError("Could not reach the server. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    function handleExport() {
        if (!data) return;
        const lines = [
            ["Metric", "Value"],
            ["Total Students", data.totals.totalStudents],
            ["Total Courses", data.totals.totalCourses],
            ["Average Grade %", data.totals.avgGrade],
            ["Average Completion %", data.totals.avgCompletion],
            [],
            ["Grade Distribution"],
            ["Range", "Count"],
            ...data.gradeDistribution.map((g) => [g.range, g.count]),
            [],
            ["Course Completion"],
            ["Course", "Completion %", "Students"],
            ...data.courseCompletion.map((c) => [c.title, c.completion, c.studentCount]),
            [],
            ["Quiz Performance"],
            ["Quiz", "Average Score %", "Attempts"],
            ...data.quizPerformance.map((q) => [q.title, q.avgScore, q.attempts]),
        ];
        const csv = lines
            .map((row) => (Array.isArray(row) ? row.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",") : ""))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "teaching-analytics.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    if (loading) {
        return (
            <div className="p-6 animate-pulse space-y-6">
                <div className="h-24 bg-slate-200 rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
                    ))}
                </div>
                <div className="h-72 bg-slate-200 rounded-xl"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-[28px] border border-red-100 bg-red-50 p-8">
                <p className="font-semibold text-red-700">Failed to load analytics</p>
                <p className="mt-1 text-sm text-red-500">{error}</p>
            </div>
        );
    }

    if (!data || data.totals.totalCourses === 0) {
        return (
            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                    <h1 className="text-3xl font-semibold text-slate-900">Analytics & Reports</h1>
                    <p className="mt-2 text-sm text-slate-500">No courses assigned yet, so there's nothing to report on.</p>
                </div>
            </div>
        );
    }

    const stats = [
        { title: "Total Students", value: data.totals.totalStudents, icon: Users, accent: "from-emerald-500 to-cyan-500" },
        { title: "Active Courses", value: data.totals.totalCourses, icon: BookOpen, accent: "from-sky-500 to-indigo-500" },
        { title: "Average Grade", value: `${data.totals.avgGrade}%`, icon: Award, accent: "from-amber-500 to-orange-500" },
        { title: "Average Completion", value: `${data.totals.avgCompletion}%`, icon: TrendingUp, accent: "from-violet-500 to-fuchsia-500" },
    ];

    return (
        <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900">Analytics & Reports</h1>
                        <p className="mt-2 text-sm text-slate-500">Grade distribution, course completion, and engagement across your courses.</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-white shadow`}>
                                <Icon size={20} />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{item.title}</h3>
                            <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900">{item.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                        <BarChart3 size={18} /> Grade Distribution
                    </h2>
                    {data.gradeDistribution.every((g) => g.count === 0) ? (
                        <p className="text-sm text-slate-500 py-8 text-center">No graded assignments yet.</p>
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.gradeDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="range" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={48}>
                                        {data.gradeDistribution.map((entry, index) => (
                                            <Cell key={entry.range} fill={GRADE_COLORS[index % GRADE_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                        <TrendingUp size={18} /> Weekly Submission Trend
                    </h2>
                    {data.submissionTrend.every((w) => w.submissions === 0) ? (
                        <p className="text-sm text-slate-500 py-8 text-center">No submissions in the last 8 weeks.</p>
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.submissionTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="submissions" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <BookOpen size={18} /> Course Completion Comparison
                </h2>
                {data.courseCompletion.length === 0 ? (
                    <p className="text-sm text-slate-500 py-8 text-center">No course data available.</p>
                ) : (
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.courseCompletion} layout="vertical" margin={{ left: 24 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                <YAxis
                                    type="category"
                                    dataKey="title"
                                    width={160}
                                    tick={{ fontSize: 12, fill: "#334155" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                                <Bar dataKey="completion" fill="#6366f1" radius={[0, 8, 8, 0]} maxBarSize={28} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {data.quizPerformance.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                        <Award size={18} /> Quiz Performance
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.quizPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="title" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                                <Bar dataKey="avgScore" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={48} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
