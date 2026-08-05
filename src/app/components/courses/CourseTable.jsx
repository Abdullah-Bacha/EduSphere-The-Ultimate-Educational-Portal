"use client";

import { useMemo, useState } from "react";
import { Search, BookOpen } from "lucide-react";
import CourseActions from "@/app/components/courses/CourseActions";

const LEVEL_STYLES = {
    Beginner: "bg-emerald-100 text-emerald-700",
    Intermediate: "bg-blue-100 text-blue-700",
    Advanced: "bg-purple-100 text-purple-700",
};

function LevelBadge({ level }) {
    const style = LEVEL_STYLES[level] || "bg-slate-100 text-slate-700";
    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
            {level || "N/A"}
        </span>
    );
}

function StatusBadge({ isPublished }) {
    return isPublished ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
            Published
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            Draft
        </span>
    );
}

export default function CourseTable({ courses }) {
    const [query, setQuery] = useState("");
    const courseList = Array.isArray(courses) ? courses : [];

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return courseList;

        return courseList.filter((course) =>
            [course.title, course.instructor, course.category, course.level]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(q))
        );
    }, [courseList, query]);

    return (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">
                        {filtered.length}
                    </span>{" "}
                    of {courseList.length} course{courseList.length === 1 ? "" : "s"}
                </p>

                <div className="relative w-full sm:w-72">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by title, instructor, category..."
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[860px]">
                    <thead className="bg-gray-50">
                        <tr className="border-b text-xs font-semibold uppercase tracking-wide text-gray-500">
                            <th className="p-4 text-left">Course</th>
                            <th className="p-4 text-left">Instructor</th>
                            <th className="p-4 text-left">Category</th>
                            <th className="p-4 text-left">Level</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-center w-40">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-16 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <BookOpen size={28} className="text-gray-300" />
                                        <span>
                                            {courseList.length === 0
                                                ? "No courses found."
                                                : "No courses match your search."}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((course) => (
                                <tr key={course._id} className="transition hover:bg-gray-50/80">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-semibold text-gray-900 leading-tight">
                                                    {course.title}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {course.duration}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4 text-gray-700">{course.instructor}</td>
                                    <td className="p-4 text-gray-700">{course.category}</td>
                                    <td className="p-4"><LevelBadge level={course.level} /></td>
                                    <td className="p-4"><StatusBadge isPublished={course.isPublished} /></td>

                                    <td className="p-4 font-semibold text-gray-900">
                                        {course.price > 0 ? `$${course.price}` : "Free"}
                                    </td>

                                    <td className="p-4 text-center">
                                        <CourseActions id={course._id} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}