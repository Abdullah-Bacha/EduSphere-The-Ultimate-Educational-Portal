"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ClipboardList, Brain, Plus, Sparkles, Users, BarChart3, Play, CheckCircle2, Clock, LogOut } from "lucide-react";
import SearchBar from "@/app/components/teacher/SearchBar";
import NotificationsDropdown from "@/app/components/teacher/NotificationsDropdown";
import CourseAnalytics from "@/app/components/teacher/CourseAnalytics";
import ExportButton from "@/app/components/teacher/ExportButton";
import FilterBar from "@/app/components/teacher/FilterBar";
import ActivityIcon from "@/app/components/teacher/ActivityIcon";
import GradeActions from "@/app/components/teacher/GradeActions";

export default function TeacherDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({});
    const [filteredCourses, setFilteredCourses] = useState([]);

    async function getDashboard() {
        try {
            const res = await fetch("/api/teacher/dashboard", {
                cache: "no-store",
                headers: {
                    "Cache-Control": "no-cache",
                },
            });

            if (!res.ok) {
                console.error(`API error: ${res.status} ${res.statusText}`);
                setDashboard(null);
                setLoading(false);
                return;
            }

            const data = await res.json();
            if (data.success) {
                setDashboard(data.data);
                setFilteredCourses(data.data.allCourses || []);
            } else {
                console.error("API returned failure:", data.message);
                setDashboard(null);
            }
        } catch (err) {
            console.error("Error loading dashboard data:", err);
            setDashboard(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getDashboard();
    }, []);

    // Search and filter courses
    useEffect(() => {
        if (!dashboard) return;

        let filtered = dashboard.allCourses || [];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (filters.status) {
            filtered = filtered.filter(course => {
                if (filters.status === "active") return course.completion > 0;
                if (filters.status === "draft") return course.completion === 0;
                return true;
            });
        }

        // Completion filter
        if (filters.completion) {
            filtered = filtered.filter(course => {
                const [min, max] = filters.completion.split("-").map(Number);
                return course.completion >= min && course.completion <= max;
            });
        }

        // Sorting
        if (filters.sortBy) {
            const [field, order] = filters.sortBy.split("-");
            filtered.sort((a, b) => {
                let aVal, bVal;
                if (field === "name") {
                    aVal = a.title;
                    bVal = b.title;
                } else if (field === "students") {
                    aVal = a.studentCount;
                    bVal = b.studentCount;
                } else if (field === "completion") {
                    aVal = a.completion;
                    bVal = b.completion;
                }
                return order === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
            });
        }

        setFilteredCourses(filtered);
    }, [searchQuery, filters, dashboard]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

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
            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-600">
                                <Sparkles size={12} />
                                Getting Started
                            </div>
                            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-900">Welcome to Your Dashboard!</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">You don't have any courses assigned yet. Let's get you started by creating your first course.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow mb-4">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Create a Course</h3>
                        <p className="text-sm text-slate-600 mb-4">Start by creating your first course and adding lessons, assignments, and quizzes.</p>
                        <Link href="/dashboard/teacher/courses" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                            Create Course →
                        </Link>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow mb-4">
                            <Users size={24} />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Manage Students</h3>
                        <p className="text-sm text-slate-600 mb-4">View and manage your students, track their progress, and send announcements.</p>
                        <Link href="/dashboard/teacher/students" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                            View Students →
                        </Link>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow mb-4">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">View Analytics</h3>
                        <p className="text-sm text-slate-600 mb-4">Check student performance, grades, and course analytics in real-time.</p>
                        <Link href="/dashboard/teacher/students-performance" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                            View Analytics →
                        </Link>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                    <p className="text-sm text-blue-800">Once you create a course, it will appear in your dashboard. You can then add students, create assignments, and monitor their progress.</p>
                </div>
            </div>
        );
    }

    const stats = [
        { title: "Assigned Courses", value: dashboard.assignedCourses, icon: BookOpen, href: "/dashboard/teacher/courses", accent: "from-sky-500 to-indigo-500" },
        { title: "Total Students", value: dashboard.totalStudents, icon: Users, href: "/dashboard/teacher/students", accent: "from-emerald-500 to-cyan-500" },
        { title: "Ungraded Assignments", value: dashboard.pendingAssignments, icon: ClipboardList, href: "/dashboard/teacher/assignments", accent: "from-amber-500 to-orange-500" },
        { title: "Quizzes Created", value: dashboard.totalQuizzes, icon: Brain, href: "/dashboard/teacher/quizzes", accent: "from-violet-500 to-fuchsia-500" },
    ];

    const quickActions = [
        { name: "Create Lesson", href: "/dashboard/teacher/lessons", icon: Play },
        { name: "Create Assignment", href: "/dashboard/teacher/assignments", icon: ClipboardList },
        { name: "Create Quiz", href: "/dashboard/teacher/quizzes", icon: Brain },
    ];

    return (
        <div className="space-y-6">
            {/* Enhanced Header with Search & Notifications */}
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-600">
                            <Sparkles size={12} />
                            Teaching workspace
                        </div>
                        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-900">Welcome back, {dashboard?.name}.</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Overview of your active courses, assignments to grade, and teaching metrics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationsDropdown />
                        <ExportButton data={dashboard} filename="teacher-dashboard" />
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar
                    onSearch={setSearchQuery}
                    placeholder="Search courses, assignments..."
                />
                <FilterBar onFilterChange={setFilters} />
            </div>

            {/* Stats Grid */}
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

            {/* Course Analytics */}
            {dashboard && <CourseAnalytics courses={dashboard.allCourses || []} />}

            {/* My Courses & Quick Actions */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.8fr]">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold tracking-[-0.01em] text-slate-900">My Courses</h2>
                            <p className="mt-1 text-sm text-slate-500">{filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} found</p>
                        </div>
                        <Link href="/dashboard/teacher/courses" className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700">View all →</Link>
                    </div>

                    {filteredCourses.length === 0 ? (
                        <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm">
                                <BookOpen size={20} />
                            </div>
                            <h4 className="font-semibold text-slate-800">No courses assigned yet</h4>
                            <p className="mt-2 text-sm">You are not assigned as an instructor to any course yet. Contact the system administrator.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredCourses.slice(0, 5).map((course) => (
                                <div key={course._id} className="flex flex-col gap-4 rounded-[20px] border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-4">
                                        {course.thumbnail && (
                                            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
                                                <img src={course.thumbnail} alt="Course" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{course.title}</h3>
                                            <p className="mt-1 text-sm text-slate-500">{course.lessonCount} Lessons • {course.studentCount} Students</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600"
                                                        style={{ width: `${course.completion}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-semibold text-slate-600">{course.completion}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-slate-900">{course.assignmentCount}</div>
                                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Assignments</div>
                                        </div>
                                        <Link href={`/dashboard/teacher/courses/${course._id}`} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                                            Manage
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold tracking-[-0.01em] text-slate-900">Quick Actions</h2>
                    <p className="mt-1 text-sm text-slate-500">Move quickly between teaching tasks.</p>
                    <div className="mt-6 space-y-3">
                        {quickActions.map((action, idx) => {
                            const Icon = action.icon;
                            return (
                                <Link href={action.href} key={idx} className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50/70 p-3.5 transition hover:border-indigo-200 hover:bg-indigo-50/50">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                                        <Icon size={16} />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">{action.name}</span>
                                    <Plus size={14} className="ml-auto text-slate-400" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Pending Submissions Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold tracking-[-0.01em] text-slate-900">Pending Submissions</h2>
                        <p className="mt-1 text-sm text-slate-500">Assignments waiting for your review.</p>
                    </div>
                    <Link href="/dashboard/teacher/assignments" className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700">View all →</Link>
                </div>

                {dashboard.pendingSubmissions && dashboard.pendingSubmissions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Assignment</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Course</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Due Date</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Student</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboard?.pendingSubmissions?.slice(0, 5).map((submission) => (
                                    <tr key={submission._id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            <div className="flex items-center gap-2">
                                                <ActivityIcon type="pending" />
                                                {submission.assignmentTitle}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{submission.courseName}</td>
                                        <td className="px-4 py-3 text-slate-600">{formatDate(submission.dueDate)}</td>
                                        <td className="px-4 py-3 text-slate-600 font-medium">
                                            {submission.studentName || "Student"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                <CheckCircle2 size={14} /> Active
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <GradeActions
                                                submissionId={submission._id}
                                                assignmentId={submission.assignment?._id}
                                                studentId={submission.student?._id}
                                                totalMarks={submission.assignment?.totalMarks || 100}
                                                onGraded={getDashboard}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm">
                            <CheckCircle2 size={20} />
                        </div>
                        <h4 className="font-semibold text-slate-800">No pending submissions</h4>
                        <p className="mt-2 text-sm">All assignments have been reviewed!</p>
                    </div>
                )}
            </div>

            {/* Recent Activities Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold tracking-[-0.01em] text-slate-900">Recent Activities</h2>
                        <p className="mt-1 text-sm text-slate-500">Latest updates from your courses.</p>
                    </div>
                </div>

                {dashboard.recentActivities && dashboard.recentActivities.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Activity</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Course</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboard?.recentActivities?.slice(0, 5).map((activity) => (
                                    <tr key={activity._id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            <div className="flex items-center gap-2">
                                                <ActivityIcon type={activity.type || "submission"} />
                                                {activity.activity}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{activity.courseName}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {formatDate(activity.timestamp)}, {formatTime(activity.timestamp)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm">
                            <Clock size={20} />
                        </div>
                        <h4 className="font-semibold text-slate-800">No recent activities</h4>
                        <p className="mt-2 text-sm">Activities will appear here as students submit assignments.</p>
                    </div>
                )}
            </div>
        </div>
    );
}