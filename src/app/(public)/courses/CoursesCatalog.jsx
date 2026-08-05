"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Clock, Users, ArrowRight } from "lucide-react";
import Container from "@/app/components/ui/Container";

export default function CoursesCatalog() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    search,
                    category,
                    level,
                    page,
                    limit: 9,
                }).toString();

                const res = await fetch(`/api/courses?${query}`);
                const data = await res.json();

                if (data.success) {
                    setCourses(data.result.courses);
                    setTotalPages(data.result.totalPages);
                    setTotal(data.result.total);
                    setCategories((prev) => (data.result.categories?.length ? data.result.categories : prev));
                }
            } catch (err) {
                console.error("Failed to load courses:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [search, category, level, page]);

    return (
        <section className="py-16 bg-slate-50">
            <Container>
                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mb-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search courses..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <select
                        value={level}
                        onChange={(e) => {
                            setLevel(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>

                {!loading && (
                    <p className="text-sm text-slate-500 mb-6">{total} course{total !== 1 ? "s" : ""} found</p>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-72 bg-white rounded-xl border border-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="bg-white rounded-xl p-16 text-center border border-slate-100">
                        <p className="text-slate-500">No courses match your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Link href={`/courses/${course._id}`} key={course._id} className="group h-full">
                                <div className="h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col border border-slate-100">
                                    <div className="relative h-40 bg-gradient-to-br from-slate-200 to-slate-300">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <span className="absolute top-2 right-2 bg-white/90 text-blue-600 px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                                            {course.level}
                                        </span>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase w-fit mb-2">
                                            {course.category}
                                        </span>
                                        <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                                            {course.title}
                                        </h3>
                                        <p className="text-slate-600 text-xs mb-3 line-clamp-2 flex-1">
                                            {course.description}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                                            <span className="inline-flex items-center gap-1">
                                                <Clock size={12} /> {course.duration}
                                            </span>
                                            {course.price > 0 ? (
                                                <span className="font-bold text-slate-900">${course.price}</span>
                                            ) : (
                                                <span className="font-bold text-green-600">Free</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center mt-10 gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-slate-600">Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition"
                        >
                            Next
                        </button>
                    </div>
                )}
            </Container>
        </section>
    );
}
