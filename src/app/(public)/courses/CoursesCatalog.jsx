"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    Clock,
    ArrowRight,
    ChevronRight,
    SlidersHorizontal,
    BookOpen,
    Monitor,
    Zap,
    GraduationCap,
} from "lucide-react";
import Container from "@/app/components/ui/Container";

const CARD_THEMES = [
    { icon: BookOpen, gradient: "linear-gradient(153deg, #ff6467 0%, #ec003f 100%)" },
    { icon: Monitor, gradient: "linear-gradient(153deg, #00d3f3 0%, #155dfc 100%)" },
    { icon: Zap, gradient: "linear-gradient(153deg, #fdc700 0%, #ff6900 100%)" },
    { icon: GraduationCap, gradient: "linear-gradient(153deg, #c27aff 0%, #7c3aed 100%)" },
];

function CourseCard({ course, theme }) {
    const Icon = theme.icon;

    return (
        <Link href={`/courses/${course._id}`} className="group h-full">
            <div className="h-full bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div
                    className="relative h-48 flex items-center justify-center overflow-hidden shrink-0"
                    style={{ backgroundImage: theme.gradient }}
                >
                    <div className="absolute -top-8 right-[70px] w-32 h-32 rounded-full bg-white/15" />
                    <div className="absolute top-20 -left-8 w-36 h-36 rounded-full bg-white/10" />
                    <Icon className="text-white" size={40} strokeWidth={1.75} />
                    <span className="absolute top-3 left-3 bg-white/90 text-slate-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {course.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-black/30 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                        {course.level}
                    </span>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-extrabold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                        {course.description}
                    </p>

                    <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
                        <span className="inline-block w-7 h-7 rounded-full bg-blue-50 ring-2 ring-blue-100" />
                        <span className="text-xs font-medium text-gray-500">{course.instructor}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
                        <Clock size={14} />
                        {course.duration}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        {course.price > 0 ? (
                            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                ${course.price}
                            </span>
                        ) : (
                            <span className="text-2xl font-extrabold text-emerald-600">Free</span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-[14px] bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white group-hover:shadow-md transition-shadow">
                            View Course
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function CoursesCatalog() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [sort, setSort] = useState("popular");
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

    const sortedCourses = useMemo(() => {
        const list = [...courses];
        if (sort === "price-asc") return list.sort((a, b) => a.price - b.price);
        if (sort === "price-desc") return list.sort((a, b) => b.price - a.price);
        if (sort === "newest") return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return list;
    }, [courses, sort]);

    return (
        <>
            {/* Hero */}
            <section
                className="relative overflow-hidden"
                style={{
                    backgroundImage:
                        "linear-gradient(161deg, #eef2ff 0%, #eef3ff 10%, #eff4ff 30%, #f0f6ff 50%, #eef6fe 62%, #ecf6fe 75%, #eaf5fd 87%, #e8f4fd 100%)",
                }}
            >
                <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-200/40 blur-[64px]" />
                <div className="absolute right-[-72px] top-[260px] w-72 h-72 rounded-full bg-indigo-200/40 blur-[64px]" />
                <div
                    className="absolute right-8 top-8 w-40 h-40 opacity-40 hidden md:block"
                    style={{
                        backgroundImage: "radial-gradient(circle, #93c5fd 1.5px, transparent 1.5px)",
                        backgroundSize: "16px 16px",
                    }}
                />

                <Container className="relative py-20">
                    <nav className="flex items-center gap-2 text-sm mb-6">
                        <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
                            Home
                        </Link>
                        <ChevronRight size={14} className="text-gray-400" />
                        <span className="text-blue-600 font-semibold">Courses</span>
                    </nav>

                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold shadow-sm">
                            <BookOpen size={16} />
                            Browse Courses
                        </span>

                        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                            Our{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                Courses
                            </span>
                        </h1>

                        <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-2xl">
                            Explore our professional courses designed to help you build real-world skills and achieve your career goals.
                        </p>

                        <p className="mt-4 text-sm font-semibold text-blue-600 tracking-wide">
                            Learn. Practice. Build your future.
                        </p>

                        <div className="relative mt-8 max-w-xl">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search for courses…"
                                className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </Container>
            </section>

            {/* Filters */}
            <section className="bg-white border-b border-gray-100 shadow-[0_1px_1.5px_rgba(0,0,0,0.1)]">
                <Container className="py-5">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 pr-1">
                            <SlidersHorizontal size={16} />
                            Filters
                        </span>

                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-[14px] border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="rounded-[14px] border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="rounded-[14px] border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="popular">Most Popular</option>
                            <option value="newest">Newest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>

                        <div className="flex-1 flex justify-end">
                            {!loading && (
                                <p className="text-sm">
                                    <span className="font-extrabold text-blue-600">{total}</span>{" "}
                                    <span className="font-semibold text-gray-500">Course{total !== 1 ? "s" : ""} Found</span>
                                </p>
                            )}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Grid */}
            <section className="py-20 bg-white">
                <Container>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-[493px] bg-gray-50 rounded-[24px] border border-gray-100 animate-pulse" />
                            ))}
                        </div>
                    ) : sortedCourses.length === 0 ? (
                        <div className="bg-gray-50 rounded-[24px] p-16 text-center border border-gray-100">
                            <p className="text-gray-500">No courses match your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sortedCourses.map((course, idx) => (
                                <CourseCard key={course._id} course={course} theme={CARD_THEMES[idx % CARD_THEMES.length]} />
                            ))}
                        </div>
                    )}

                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center mt-14 gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50 transition"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-gray-600">Page {page} of {totalPages}</span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50 transition inline-flex items-center gap-1"
                            >
                                Next
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    )}
                </Container>
            </section>
        </>
    );
}
