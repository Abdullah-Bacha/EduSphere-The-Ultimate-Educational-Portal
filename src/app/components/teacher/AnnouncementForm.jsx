"use client";

import { useState } from "react";
import { Send, Loader } from "lucide-react";

export default function AnnouncementForm({ courses = [], onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        courseId: courses[0]?._id || "",
        category: "general",
        pin: false,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/teacher/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                onSubmit?.(data.data);
                setFormData({
                    title: "",
                    content: "",
                    courseId: courses[0]?._id || "",
                    category: "general",
                    pin: false,
                });
            }
        } catch (err) {
            console.error("Error creating announcement:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Create New Announcement</h2>

            <div className="space-y-4">
                {/* Course Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                    <select
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    >
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter announcement title"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    >
                        <option value="general">General</option>
                        <option value="assignment">Assignment</option>
                        <option value="deadline">Deadline</option>
                        <option value="important">Important</option>
                        <option value="update">Update</option>
                    </select>
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Enter announcement content"
                        rows="5"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
                        required
                    ></textarea>
                </div>

                {/* Pin Option */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="pin"
                        checked={formData.pin}
                        onChange={handleChange}
                        id="pin"
                        className="w-4 h-4 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <label htmlFor="pin" className="text-sm font-medium text-slate-700">
                        Pin to top (important announcements)
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                    >
                        {loading ? (
                            <>
                                <Loader size={16} className="animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Send Announcement
                            </>
                        )}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}
