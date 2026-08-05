"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/app/components/ui/ToastProvider";
import { useConfirm } from "@/app/components/ui/ConfirmProvider";

function LessonsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const courseIdParam = searchParams.get("courseId");

    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [lessons, setLessons] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingLessons, setLoadingLessons] = useState(false);
    
    // Modals / Form state
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null); // null means creating
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        videoUrl: "",
        content: "",
        duration: "15 mins",
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch teacher's courses
    async function loadCourses() {
        try {
            const res = await fetch("/api/teacher/courses?limit=100");
            const data = await res.json();
            if (data.success) {
                setCourses(data.result.courses);
                // Set initial course if param is present and matches
                if (courseIdParam) {
                    setSelectedCourseId(courseIdParam);
                } else if (data.result.courses.length > 0) {
                    setSelectedCourseId(data.result.courses[0]._id);
                }
            }
        } catch (err) {
            console.error("Failed to load courses", err);
        } finally {
            setLoadingCourses(false);
        }
    }

    // Fetch lessons for the selected course
    async function loadLessons(cid) {
        if (!cid) return;
        setLoadingLessons(true);
        try {
            const res = await fetch(`/api/teacher/lessons?courseId=${cid}`);
            const data = await res.json();
            if (data.success) {
                setLessons(data.result);
            } else {
                setLessons([]);
            }
        } catch (err) {
            console.error("Failed to load lessons", err);
            setLessons([]);
        } finally {
            setLoadingLessons(false);
        }
    }

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            loadLessons(selectedCourseId);
        }
    }, [selectedCourseId]);

    const handleCourseChange = (e) => {
        const cid = e.target.value;
        setSelectedCourseId(cid);
        // Update URL search params
        router.replace(`/dashboard/teacher/lessons?courseId=${cid}`);
    };

    const openCreateModal = () => {
        setEditingLesson(null);
        setFormData({
            title: "",
            description: "",
            videoUrl: "",
            content: "",
            duration: "15 mins",
        });
        setShowFormModal(true);
    };

    const openEditModal = (lesson) => {
        setEditingLesson(lesson);
        setFormData({
            title: lesson.title || "",
            description: lesson.description || "",
            videoUrl: lesson.videoUrl || "",
            content: lesson.content || "",
            duration: lesson.duration || "15 mins",
        });
        setShowFormModal(true);
    };

    const handleDelete = async (id) => {
        const ok = await confirm("Are you sure you want to delete this lesson?", { title: "Delete lesson" });
        if (!ok) return;
        try {
            const res = await fetch(`/api/teacher/lessons/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                showToast("Lesson deleted successfully.", "success");
                loadLessons(selectedCourseId);
            } else {
                showToast(data.message || "Failed to delete lesson.", "error");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingLesson ? `/api/teacher/lessons/${editingLesson._id}` : "/api/teacher/lessons";
            const method = editingLesson ? "PUT" : "POST";
            
            const payload = editingLesson 
                ? formData 
                : { ...formData, courseId: selectedCourseId };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            
            if (data.success) {
                showToast(editingLesson ? "Lesson updated successfully." : "Lesson created successfully.", "success");
                setShowFormModal(false);
                loadLessons(selectedCourseId);
            } else {
                showToast(data.message || "Failed to save lesson.", "error");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleMoveOrder = async (index, direction) => {
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= lessons.length) return;

        const updatedLessons = [...lessons];
        
        // Swap orders locally
        const temp = updatedLessons[index].order;
        updatedLessons[index].order = updatedLessons[newIndex].order;
        updatedLessons[newIndex].order = temp;

        // Perform swapping in state immediately
        const tempObj = updatedLessons[index];
        updatedLessons[index] = updatedLessons[newIndex];
        updatedLessons[newIndex] = tempObj;
        setLessons(updatedLessons);

        // Call backend APIs to save changes
        try {
            await Promise.all([
                fetch(`/api/teacher/lessons/${updatedLessons[index]._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order: updatedLessons[index].order }),
                }),
                fetch(`/api/teacher/lessons/${updatedLessons[newIndex]._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order: updatedLessons[newIndex].order }),
                }),
            ]);
            // Reload to ensure ordering matches DB completely
            loadLessons(selectedCourseId);
        } catch (err) {
            console.error(err);
        }
    };

    if (loadingCourses) {
        return (
            <div className="p-6 animate-pulse space-y-6">
                <div className="h-10 bg-slate-200 rounded w-1/4"></div>
                <div className="h-20 bg-slate-200 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Lessons Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage lectures, upload video URLs, and order course curriculums.</p>
                </div>
                {selectedCourseId && (
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm text-center shrink-0"
                    >
                        + Add Lesson
                    </button>
                )}
            </div>

            {/* Course Selector Dropdown */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="text-sm font-bold text-slate-600 shrink-0">Select Course:</label>
                {courses.length === 0 ? (
                    <span className="text-slate-500 text-sm">No courses assigned yet. Contact Admin.</span>
                ) : (
                    <select
                        value={selectedCourseId}
                        onChange={handleCourseChange}
                        className="w-full sm:max-w-md border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700 font-medium"
                    >
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.title} ({course.category})
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Curriculum Lessons List */}
            {selectedCourseId && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {loadingLessons ? (
                        <div className="p-12 text-center text-slate-500 animate-pulse">Loading course lessons...</div>
                    ) : lessons.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <div className="text-4xl mb-2">📖</div>
                            <h4 className="font-bold">No lessons created yet</h4>
                            <p className="text-sm max-w-sm mx-auto mt-1 mb-4">
                                Publish video files or text descriptions to start building this course's curriculum.
                            </p>
                            <button
                                onClick={openCreateModal}
                                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm"
                            >
                                Create First Lesson
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {lessons.map((lesson, idx) => (
                                <div key={lesson._id} className="p-5 flex items-center justify-between gap-6 hover:bg-slate-50/20 transition-all">
                                    <div className="flex items-center gap-4 flex-grow">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                disabled={idx === 0}
                                                onClick={() => handleMoveOrder(idx, "up")}
                                                className="text-slate-400 hover:text-slate-800 disabled:opacity-30 text-xs font-black"
                                                title="Move Up"
                                            >
                                                ▲
                                            </button>
                                            <button
                                                disabled={idx === lessons.length - 1}
                                                onClick={() => handleMoveOrder(idx, "down")}
                                                className="text-slate-400 hover:text-slate-800 disabled:opacity-30 text-xs font-black"
                                                title="Move Down"
                                            >
                                                ▼
                                            </button>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                                                Lesson {idx + 1}
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-base">{lesson.title}</h3>
                                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                                ⏱️ {lesson.duration || "15 mins"} {lesson.videoUrl && " &bull; 📹 Video Published"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(lesson)}
                                            className="px-3.5 py-1.5 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 text-slate-700 font-bold rounded-lg text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(lesson._id)}
                                            className="px-3.5 py-1.5 border border-red-200 hover:border-red-500 hover:bg-red-50/30 text-red-600 font-bold rounded-lg text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Form Modal */}
            {showFormModal && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <h3 className="text-lg font-bold text-slate-800">
                                {editingLesson ? "Edit Lesson Details" : "Create New Lesson"}
                            </h3>
                            <button
                                onClick={() => setShowFormModal(false)}
                                className="text-slate-400 hover:text-slate-600 font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Short Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Video Embed URL (e.g. YouTube)</label>
                                    <input
                                        type="text"
                                        placeholder="https://www.youtube.com/embed/..."
                                        value={formData.videoUrl}
                                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Duration (e.g. 20 mins)</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Rich Reading Content (HTML/Markdown)</label>
                                <textarea
                                    rows="6"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Write reading details or copy text for this lecture..."
                                    className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
                                    className="px-5 py-2 border rounded-lg hover:bg-slate-50 font-bold text-slate-600 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : "Save Lesson"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TeacherLessonsPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading Lessons Panel...</div>}>
            <LessonsContent />
        </Suspense>
    );
}
