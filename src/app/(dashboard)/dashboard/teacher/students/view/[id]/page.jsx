"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, User as UserIcon, BookOpen, ClipboardList, CheckCircle2, Clock } from "lucide-react";

export default function TeacherStudentViewPage({ params }) {
    const { id } = use(params);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchStudent() {
            try {
                const res = await fetch(`/api/teacher/students/${id}`, { cache: "no-store" });
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                } else {
                    setError(json.message || "Failed to load student details");
                }
            } catch (err) {
                console.error("Error loading student:", err);
                setError("Failed to load student details");
            } finally {
                setLoading(false);
            }
        }
        fetchStudent();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6 animate-pulse space-y-6">
                <div className="h-24 bg-slate-200 rounded-xl"></div>
                <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="space-y-6">
                <Link href="/dashboard/teacher/students" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    <ArrowLeft size={16} /> Back to Students
                </Link>
                <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
                    <h4 className="font-semibold text-slate-800">{error || "Student not found"}</h4>
                    <p className="mt-2 text-sm">This student may not be enrolled in any of your courses.</p>
                </div>
            </div>
        );
    }

    const { student, coursesProgress, submissions, stats } = data;

    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
            : "—";

    return (
        <div className="space-y-6">
            <Link href="/dashboard/teacher/students" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                <ArrowLeft size={16} /> Back to Students
            </Link>

            <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                            <UserIcon size={26} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">{student.name}</h1>
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                <span className="inline-flex items-center gap-1.5"><Mail size={14} /> {student.email}</span>
                                {student.phone && <span className="inline-flex items-center gap-1.5"><Phone size={14} /> {student.phone}</span>}
                            </div>
                        </div>
                    </div>
                    <span
                        className={`inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                            student.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                                : "bg-slate-50 text-slate-600 ring-slate-500/10"
                        }`}
                    >
                        {student.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Avg. Completion</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.avgCompletion}%</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Assignment Avg</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.assignmentAvg}%</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pending Submissions</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.pendingSubmissions}</p>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <BookOpen size={18} /> Course Progress
                </h2>
                {coursesProgress.length === 0 ? (
                    <p className="text-sm text-slate-500">No progress data available yet.</p>
                ) : (
                    <div className="space-y-4">
                        {coursesProgress.map((cp) => (
                            <div key={cp.courseId} className="flex items-center gap-4">
                                <div className="w-40 shrink-0 truncate text-sm font-medium text-slate-700">{cp.courseTitle}</div>
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full ${cp.completionPercentage === 100 ? "bg-green-500" : "bg-indigo-500"}`}
                                        style={{ width: `${cp.completionPercentage}%` }}
                                    ></div>
                                </div>
                                <span className="w-10 shrink-0 text-right text-sm font-semibold text-slate-800">{cp.completionPercentage}%</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <ClipboardList size={18} /> Assignment Submissions
                </h2>
                {submissions.length === 0 ? (
                    <p className="text-sm text-slate-500">No submissions yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Assignment</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Submitted</th>
                                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Marks</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((sub) => (
                                    <tr key={sub._id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 font-medium text-slate-900">{sub.assignmentTitle}</td>
                                        <td className="px-4 py-3 text-slate-600">{formatDate(sub.submittedAt)}</td>
                                        <td className="px-4 py-3 text-center text-slate-700">
                                            {sub.marksAwarded != null ? `${sub.marksAwarded}/${sub.totalMarks}` : "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {sub.status === "Graded" ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                    <CheckCircle2 size={14} /> Graded
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                                                    <Clock size={14} /> Submitted
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
