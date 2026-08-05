"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, Users } from "lucide-react";

export default function CourseEnrollment({ courseId }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [students, setStudents] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchEnrollment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    async function fetchEnrollment() {
        try {
            setLoading(true);
            const res = await fetch(`/api/courses/${courseId}/students`);
            const data = await res.json();

            if (data.success) {
                setStudents(data.result.students);
                setSelected(
                    new Set(
                        data.result.students
                            .filter((s) => s.enrolled)
                            .map((s) => s._id)
                    )
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function toggle(studentId) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(studentId)) {
                next.delete(studentId);
            } else {
                next.add(studentId);
            }
            return next;
        });
    }

    async function handleSave() {
        try {
            setSaving(true);
            setMessage("");

            const res = await fetch(`/api/courses/${courseId}/students`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentIds: Array.from(selected) }),
            });

            const data = await res.json();
            setMessage(data.message || (data.success ? "Saved." : "Something went wrong."));

            if (data.success) {
                setStudents(data.result.students);
            }
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return students;
        return students.filter(
            (s) =>
                s.name?.toLowerCase().includes(term) ||
                s.email?.toLowerCase().includes(term)
        );
    }, [students, search]);

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Users size={18} /> Enrolled Students
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {selected.size}
                    </span>
                </h2>

                <div className="relative">
                    <Search
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-64"
                    />
                </div>
            </div>

            {loading ? (
                <p className="py-6 text-center text-sm text-gray-500">Loading students...</p>
            ) : filtered.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">
                    {students.length === 0 ? "No students found." : "No students match your search."}
                </p>
            ) : (
                <div className="max-h-80 space-y-1 overflow-y-auto rounded-lg border border-gray-100">
                    {filtered.map((student) => (
                        <label
                            key={student._id}
                            className="flex cursor-pointer items-center justify-between gap-3 border-b border-gray-50 px-3 py-2 last:border-b-0 hover:bg-gray-50"
                        >
                            <span className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={selected.has(student._id)}
                                    onChange={() => toggle(student._id)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>
                                    <span className="block text-sm font-medium text-gray-900">
                                        {student.name}
                                    </span>
                                    <span className="block text-xs text-gray-500">
                                        {student.email}
                                    </span>
                                </span>
                            </span>
                        </label>
                    ))}
                </div>
            )}

            <div className="mt-4 flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving && <Loader2 size={16} className="animate-spin" />}
                    {saving ? "Saving..." : "Save Enrollment"}
                </button>
                {message && <span className="text-sm text-gray-600">{message}</span>}
            </div>
        </div>
    );
}
