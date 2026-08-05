"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ClipboardList, Brain, Sparkles, Play, BarChart3, Award } from "lucide-react";

export default function StudentDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getDashboard() {
            try {
                const res = await fetch("/api/student/dashboard");
                const data = await res.json();
                if (data.success) {
                    setDashboard(data.data);
                }
            } catch (err) {
                console.error("Error loading dashboard data", err);
            } finally {
                setLoading(false);
            }
        }
        getDashboard();
    }, []);

    if (loading) {
        return (
            <div className="p-6 animate-pulse space-y-6">
                <div className="h-24 bg-slate-200 rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                    ))}
                </div>
                <div className="h-48 bg-slate-200 rounded-xl"></div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="p-6 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                    Failed to load dashboard data. Please try again.
                </div>
            </div>
        );
    }

    const stats = [
        { title: "Enrolled Courses", value: dashboard.enrolledCourses, icon: BookOpen, href: "/dashboard/student/my-courses", accent: "from-sky-500 to-indigo-500" },
        { title: "Completed Lessons", value: dashboard.completedLessons, icon: BarChart3, href: "/dashboard/student/progress", accent: "from-emerald-500 to-cyan-500" },
        { title: "Pending Assignments", value: dashboard.pendingAssignments, icon: ClipboardList, href: "/dashboard/student/assignments", accent: "from-amber-500 to-orange-500" },
        { title: "Pending Quizzes", value: dashboard.pendingQuizzes, icon: Brain, href: "/dashboard/student/quizzes", accent: "from-violet-500 to-fuchsia-500" },
    ];

    return (
        <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-600">
                            <Sparkles size={12} />
                            Learning dashboard
                        </div>
                        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-900">Welcome back, {dashboard.name}.</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Ready to jump back into your studies? Review your progress and continue where you left off.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <Link href={item.href} key={index} className="group block">
                            <div className="bg-white rounded-xl p-6 shadow-sm transition transform hover:-translate-y-1 hover:shadow-md">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-white shadow`}>
                                    <Icon size={20} />
                                </div>
                                <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{item.title}</h3>
                                <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900">{item.value}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold tracking-[-0.01em] text-slate-900">Continue Learning</h2>
                        <p className="mt-1 text-sm text-slate-500">Pick up where you left off and keep momentum.</p>
                    </div>
                </div>

                {dashboard.continueCourse ? (
                    <div className="flex flex-col gap-6 rounded-[24px] border border-slate-200 bg-slate-50/70 p-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            {dashboard.continueCourse.thumbnail && (
                                <div className="h-28 w-full overflow-hidden rounded-[18px] bg-white shadow-sm md:w-36">
                                    <img src={dashboard.continueCourse.thumbnail} alt="Course" className="h-full w-full object-cover" />
                                </div>
                            )}
                            <div className="flex-grow">
                                <div className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-600">{dashboard.continueCourse.category}</div>
                                <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-slate-900">{dashboard.continueCourse.title}</h3>
                                <p className="mt-1 text-sm text-slate-500">Instructor: {dashboard.continueCourse.instructor}</p>
                                <div className="mt-4 w-full max-w-md">
                                    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                                        <span>Progress</span>
                                        <span>{dashboard.continueCourse.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-200">
                                        <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: `${dashboard.continueCourse.progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href={`/dashboard/student/lessons?courseId=${dashboard.continueCourse._id}`} className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                            Resume course
                        </Link>
                    </div>
                ) : (
                    <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm">
                            <BookOpen size={20} />
                        </div>
                        <h4 className="font-semibold text-slate-800">Start your learning journey</h4>
                        <p className="mt-2 text-sm">You aren’t enrolled in any courses yet. Visit the catalog to enroll in courses.</p>
                    </div>
                )}
            </div>
        </div>
    );
}