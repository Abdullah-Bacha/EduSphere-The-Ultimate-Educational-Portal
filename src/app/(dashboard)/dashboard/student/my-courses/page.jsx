"use client";

import { useEffect, useState } from "react";
import StudentCourseCard from "@/app/components/students/StudentCourseCard";

export default function MyCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    async function loadCourses() {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                search,
                category,
                level,
                page,
                limit: 8,
            }).toString();

            const response = await fetch(`/api/student/my-courses?${query}`);
            const data = await response.json();

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
        (async () => {
            await loadCourses();
        })();
    }, [search, category, level, page]);

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold text-slate-800">My Courses</h1>

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
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-slate-200 h-80 rounded-xl"></div>
                    ))}
                </div>
            ) : courses.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course) => (
                            <StudentCourseCard key={course._id} course={course} />
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
                        No courses found
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        {search || level
                            ? "We couldn't find any courses matching your filters. Try adjusting them."
                            : "You haven't enrolled in any courses yet. Explore our catalog to start learning."}
                    </p>
                </div>
            )}
        </div>
    );
}