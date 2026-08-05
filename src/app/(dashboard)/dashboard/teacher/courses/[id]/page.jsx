"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Archive, ArchiveRestore, Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";
import { useConfirm } from "@/app/components/ui/ConfirmProvider";

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("info"); // info / students

    // Edit Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        level: "",
        duration: "",
        thumbnail: "",
        isPublished: true,
    });
    const [saving, setSaving] = useState(false);
    const [courseActionLoading, setCourseActionLoading] = useState(false);
    const [enrollEmail, setEnrollEmail] = useState("");
    const [enrolling, setEnrolling] = useState(false);
    const [removingStudentId, setRemovingStudentId] = useState(null);

    async function loadCourseDetails() {
        try {
            const res = await fetch(`/api/teacher/courses/${params.id}`);
            const data = await res.json();

            if (data.success) {
                setCourse(data.result);
                setFormData({
                    title: data.result.title || "",
                    description: data.result.description || "",
                    level: data.result.level || "",
                    duration: data.result.duration || "",
                    thumbnail: data.result.thumbnail || "",
                    isPublished: data.result.isPublished ?? true,
                });
            } else {
                setError(data.message || "Failed to load course details");
            }
        } catch (err) {
            setError("An error occurred while fetching details.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (params.id) {
            loadCourseDetails();
        }
    }, [params.id]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/teacher/courses/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setCourse(prev => ({ ...prev, ...formData }));
                showToast("Course details updated successfully!", "success");
            } else {
                showToast(data.message || "Failed to update details.", "error");
            }
        } catch (err) {
            console.error("Error updating course details:", err);
        } finally {
            setSaving(false);
        }
    };

    async function handleToggleArchive() {
        const nextArchived = !course.archived;
        const ok = await confirm(
            nextArchived
                ? `Archive "${course.title}"? It will be hidden from your active courses.`
                : `Restore "${course.title}" back to your active courses?`,
            { title: nextArchived ? "Archive course" : "Restore course" }
        );
        if (!ok) return;

        setCourseActionLoading(true);
        try {
            const res = await fetch(`/api/teacher/courses/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ archived: nextArchived }),
            });
            const data = await res.json();
            if (data.success) {
                setCourse((prev) => ({ ...prev, archived: nextArchived }));
                showToast(nextArchived ? "Course archived" : "Course restored", "success");
            } else {
                showToast(data.message || "Failed to update course", "error");
            }
        } catch (err) {
            showToast("Failed to update course", "error");
        } finally {
            setCourseActionLoading(false);
        }
    }

    async function handleDuplicate() {
        setCourseActionLoading(true);
        try {
            const res = await fetch(`/api/teacher/courses/${params.id}/duplicate`, { method: "POST" });
            const data = await res.json();
            if (data.success) {
                showToast("Course duplicated as a draft", "success");
                router.push(`/dashboard/teacher/courses/${data.result._id}`);
            } else {
                showToast(data.message || "Failed to duplicate course", "error");
            }
        } catch (err) {
            showToast("Failed to duplicate course", "error");
        } finally {
            setCourseActionLoading(false);
        }
    }

    async function handleDelete() {
        const ok = await confirm(
            `Permanently delete "${course.title}"? This cannot be undone.`,
            { title: "Delete course" }
        );
        if (!ok) return;

        setCourseActionLoading(true);
        try {
            const res = await fetch(`/api/teacher/courses/${params.id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                showToast("Course deleted", "success");
                router.push("/dashboard/teacher/courses");
            } else {
                showToast(data.message || "Failed to delete course", "error");
            }
        } catch (err) {
            showToast("Failed to delete course", "error");
        } finally {
            setCourseActionLoading(false);
        }
    }

    async function handleEnrollStudent(e) {
        e.preventDefault();
        if (!enrollEmail.trim()) return;

        setEnrolling(true);
        try {
            const res = await fetch(`/api/teacher/courses/${params.id}/students`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: enrollEmail.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setCourse((prev) => ({ ...prev, students: [...(prev.students || []), data.result] }));
                showToast(data.message || "Student enrolled", "success");
                setEnrollEmail("");
            } else {
                showToast(data.message || "Failed to enroll student", "error");
            }
        } catch (err) {
            showToast("Failed to enroll student", "error");
        } finally {
            setEnrolling(false);
        }
    }

    async function handleRemoveStudent(student) {
        const ok = await confirm(`Remove "${student.name}" from this course?`, { title: "Remove student" });
        if (!ok) return;

        setRemovingStudentId(student._id);
        try {
            const res = await fetch(`/api/teacher/courses/${params.id}/students`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId: student._id }),
            });
            const data = await res.json();
            if (data.success) {
                setCourse((prev) => ({
                    ...prev,
                    students: prev.students.filter((s) => s._id !== student._id),
                }));
                showToast("Student removed from course", "success");
            } else {
                showToast(data.message || "Failed to remove student", "error");
            }
        } catch (err) {
            showToast("Failed to remove student", "error");
        } finally {
            setRemovingStudentId(null);
        }
    }

    if (loading) {
        return (
            <div className="p-6 animate-pulse space-y-6">
                <div className="h-20 bg-slate-200 rounded-xl"></div>
                <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>
                <Link href="/dashboard/teacher/courses" className="text-blue-600 hover:underline">
                    &larr; Back to My Courses
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col gap-4 pb-4 border-b sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-black text-slate-800">{course.title}</h1>
                        {course.archived && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 text-slate-600">ARCHIVED</span>
                        )}
                    </div>
                    <p className="text-xs text-slate-400">Course Administration Panel &bull; Instructor Taught</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        disabled={courseActionLoading}
                        onClick={handleDuplicate}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg hover:bg-slate-50 font-bold text-slate-600 text-xs transition-colors disabled:opacity-50"
                    >
                        <Copy size={14} /> Duplicate
                    </button>
                    <button
                        disabled={courseActionLoading}
                        onClick={handleToggleArchive}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg hover:bg-slate-50 font-bold text-slate-600 text-xs transition-colors disabled:opacity-50"
                    >
                        {course.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                        {course.archived ? "Restore" : "Archive"}
                    </button>
                    <button
                        disabled={courseActionLoading}
                        onClick={handleDelete}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-rose-200 rounded-lg hover:bg-rose-50 font-bold text-rose-600 text-xs transition-colors disabled:opacity-50"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                    <Link
                        href="/dashboard/teacher/courses"
                        className="px-4 py-2 border rounded-lg hover:bg-slate-50 font-bold text-slate-600 text-sm transition-colors"
                    >
                        &larr; Back to Courses
                    </Link>
                </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-4 border-b">
                <button
                    onClick={() => setActiveTab("info")}
                    className={`py-2 px-4 font-bold border-b-2 transition-colors text-sm ${
                        activeTab === "info" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Course Info
                </button>
                <button
                    onClick={() => setActiveTab("students")}
                    className={`py-2 px-4 font-bold border-b-2 transition-colors text-sm ${
                        activeTab === "students" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Enrolled Students ({course.students?.length || 0})
                </button>
            </div>

            {/* Content Tabs */}
            {activeTab === "info" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Course Edit Form */}
                    <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Course Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Description</label>
                                <textarea
                                    required
                                    rows="6"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Level</label>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Duration</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Thumbnail URL</label>
                                <input
                                    type="text"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isPublished" className="text-sm font-semibold text-slate-700">
                                    Publish Course (visible to students)
                                </label>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {saving ? "Saving Changes..." : "Save Course Details"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Quick Course Actions Sidebar */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 h-fit">
                        <h3 className="font-bold text-slate-800 text-lg">Curriculum Controls</h3>
                        <p className="text-xs text-slate-400">Jump directly to manage the lessons, assignments, and quizzes for this course.</p>
                        
                        <div className="flex flex-col gap-3">
                            <Link
                                href={`/dashboard/teacher/lessons?courseId=${course._id}`}
                                className="w-full py-2.5 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 text-slate-700 font-bold rounded-lg transition-colors text-center text-sm"
                            >
                                📖 Manage Lessons
                            </Link>
                            <Link
                                href={`/dashboard/teacher/assignments?courseId=${course._id}`}
                                className="w-full py-2.5 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 text-slate-700 font-bold rounded-lg transition-colors text-center text-sm"
                            >
                                📝 Manage Assignments
                            </Link>
                            <Link
                                href={`/dashboard/teacher/quizzes?courseId=${course._id}`}
                                className="w-full py-2.5 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 text-slate-700 font-bold rounded-lg transition-colors text-center text-sm"
                            >
                                🧪 Manage Quizzes
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                /* Enrolled Students Table */
                <div className="space-y-4">
                    <form
                        onSubmit={handleEnrollStudent}
                        className="flex flex-col gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:flex-row sm:items-center"
                    >
                        <input
                            type="email"
                            required
                            value={enrollEmail}
                            onChange={(e) => setEnrollEmail(e.target.value)}
                            placeholder="Enter student's email to enroll..."
                            className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={enrolling}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                            <UserPlus size={16} />
                            {enrolling ? "Enrolling..." : "Enroll Student"}
                        </button>
                    </form>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {course.students?.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <div className="text-4xl mb-2">👨‍🎓</div>
                            <h4 className="font-bold">No students enrolled yet</h4>
                            <p className="text-sm">When students enroll in this course, they will appear in this directory.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Phone</th>
                                        <th className="p-4">Gender</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm text-slate-650">
                                    {course.students.map((student) => (
                                        <tr key={student._id} className="hover:bg-slate-50/50">
                                            <td className="p-4 font-bold text-slate-800">{student.name}</td>
                                            <td className="p-4">{student.email}</td>
                                            <td className="p-4">{student.phone || "—"}</td>
                                            <td className="p-4">{student.gender || "—"}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                                                    student.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                                                }`}>
                                                    {student.status || "Active"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    disabled={removingStudentId === student._id}
                                                    onClick={() => handleRemoveStudent(student)}
                                                    className="px-3 py-1.5 border border-rose-200 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                </div>
            )}
        </div>
    );
}
