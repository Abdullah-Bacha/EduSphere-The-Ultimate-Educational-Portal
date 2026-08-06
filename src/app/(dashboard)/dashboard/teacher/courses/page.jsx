"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Copy, Archive, ArchiveRestore, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";
import { useConfirm } from "@/app/components/ui/ConfirmProvider";

const DEFAULT_COURSE_THUMBNAIL = "/images/course-placeholder.svg";

function TeacherCoursesContent() {
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [level, setLevel] = useState("");
    const [showArchived, setShowArchived] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [actioningId, setActioningId] = useState(null);

    async function loadCourses() {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                search,
                level,
                page,
                limit: 6,
                archived: showArchived,
            }).toString();

            const res = await fetch(`/api/teacher/courses?${query}`);
            const data = await res.json();

            if (data.success) {
                setCourses(data.result.courses);
                setTotalPages(data.result.totalPages || 1);
            } else {
                setCourses([]);
            }
        } catch (error) {
            console.error("Failed to load courses:", error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCourses();
    }, [search, level, page, showArchived]);

    async function handleTogglePublish(course) {
        setActioningId(course._id);
        try {
            const res = await fetch(`/api/teacher/courses/${course._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !course.isPublished }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(!course.isPublished ? "Course published" : "Course unpublished", "success");
                loadCourses();
            } else {
                showToast(data.message || "Failed to update course", "error");
            }
        } catch (err) {
            showToast("Failed to update course", "error");
        } finally {
            setActioningId(null);
        }
    }

    async function handleToggleArchive(course) {
        const nextArchived = !course.archived;
        const ok = await confirm(
            nextArchived
                ? `Archive "${course.title}"? It will be hidden from your active courses.`
                : `Restore "${course.title}" back to your active courses?`,
            { title: nextArchived ? "Archive course" : "Restore course" }
        );
        if (!ok) return;

        setActioningId(course._id);
        try {
            const res = await fetch(`/api/teacher/courses/${course._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ archived: nextArchived }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(nextArchived ? "Course archived" : "Course restored", "success");
                loadCourses();
            } else {
                showToast(data.message || "Failed to update course", "error");
            }
        } catch (err) {
            showToast("Failed to update course", "error");
        } finally {
            setActioningId(null);
        }
    }

    async function handleDuplicate(course) {
        setActioningId(course._id);
        try {
            const res = await fetch(`/api/teacher/courses/${course._id}/duplicate`, {
                method: "POST",
            });
            const data = await res.json();
            if (data.success) {
                showToast("Course duplicated as a draft", "success");
                loadCourses();
            } else {
                showToast(data.message || "Failed to duplicate course", "error");
            }
        } catch (err) {
            showToast("Failed to duplicate course", "error");
        } finally {
            setActioningId(null);
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Courses</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage and edit your assigned course details and curriculums.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="border border-slate-300 rounded-lg px-4 py-2 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={level}
                        onChange={(e) => {
                            setLevel(e.target.value);
                            setPage(1);
                        }}
                        className="border border-slate-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                    <button
                        onClick={() => {
                            setShowArchived(!showArchived);
                            setPage(1);
                        }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition ${
                            showArchived
                                ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                        <Archive size={16} />
                        {showArchived ? "Viewing Archived" : "Show Archived"}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-slate-200 h-64 rounded-xl"></div>
                    ))}
                </div>
            ) : courses.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course._id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 shrink-0 overflow-hidden">
                                    <img
                                        src={course.thumbnail || DEFAULT_COURSE_THUMBNAIL}
                                        alt={course.title}
                                        className="object-cover w-full h-full"
                                        onError={(e) => {
                                            e.currentTarget.src = DEFAULT_COURSE_THUMBNAIL;
                                        }}
                                    />
                                    <div className="absolute top-3 right-3 bg-white px-2 py-1 text-xs font-semibold rounded text-blue-600 shadow">
                                        {course.category}
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded shadow ${
                                            course.isPublished ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                                        }`}>
                                            {course.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-slate-800 line-clamp-1 leading-snug mb-2">{course.title}</h3>
                                    <p className="text-slate-500 text-xs line-clamp-2 mb-4">{course.description}</p>

                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                        <span>👥 {course.studentCount} Students</span>
                                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{course.level}</span>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Link
                                            href={`/dashboard/teacher/courses/${course._id}`}
                                            className="w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors"
                                        >
                                            Manage Course
                                        </Link>
                                    </div>

                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        <button
                                            disabled={actioningId === course._id}
                                            onClick={() => handleTogglePublish(course)}
                                            title={course.isPublished ? "Unpublish" : "Publish"}
                                            className="inline-flex items-center justify-center gap-1.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                                        >
                                            {course.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                                            {course.isPublished ? "Unpublish" : "Publish"}
                                        </button>
                                        <button
                                            disabled={actioningId === course._id}
                                            onClick={() => handleDuplicate(course)}
                                            title="Duplicate course"
                                            className="inline-flex items-center justify-center gap-1.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                                        >
                                            <Copy size={14} />
                                            Duplicate
                                        </button>
                                        <button
                                            disabled={actioningId === course._id}
                                            onClick={() => handleToggleArchive(course)}
                                            title={course.archived ? "Restore course" : "Archive course"}
                                            className="inline-flex items-center justify-center gap-1.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                                        >
                                            {course.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                                            {course.archived ? "Restore" : "Archive"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-10 gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-slate-600">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
                    <div className="text-5xl mb-4">📚</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {showArchived ? "No archived courses" : "No courses assigned"}
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        {showArchived
                            ? "Courses you archive will show up here."
                            : "You have not been assigned to any courses as an instructor yet."}
                    </p>
                </div>
            )}
        </div>
    );
}

export default function TeacherCoursesPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading courses...</div>}>
            <TeacherCoursesContent />
        </Suspense>
    );
}
