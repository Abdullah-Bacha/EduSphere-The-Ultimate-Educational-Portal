"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    ChevronRight,
    Users,
    BookOpen,
    Mail,
    Phone,
    ArrowRight,
} from "lucide-react";
import Container from "@/app/components/ui/Container";

const CARD_THEMES = [
    { bar: "from-[#2b7fff] to-[#4f39f6]", avatar: "from-[#2b7fff] to-[#4f39f6]" },
    { bar: "from-[#00bc7d] to-[#009689]", avatar: "from-[#00bc7d] to-[#009689]" },
    { bar: "from-[#8e51ff] to-[#9810fa]", avatar: "from-[#8e51ff] to-[#9810fa]" },
    { bar: "from-[#ff2056] to-[#e60076]", avatar: "from-[#ff2056] to-[#e60076]" },
];

function initials(name) {
    return (name || "T")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function TeacherCard({ teacher, theme }) {
    return (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className={`h-2 w-full bg-gradient-to-r ${theme.bar}`} />

            <div className="p-7 flex flex-col items-center text-center flex-1">
                {teacher.image ? (
                    <img
                        src={teacher.image}
                        alt={teacher.name}
                        className="w-20 h-20 rounded-full object-cover shadow-[0_0_0_4px_white,0_10px_15px_-3px_rgba(0,0,0,0.1)]"
                    />
                ) : (
                    <div
                        className={`w-20 h-20 rounded-full bg-gradient-to-br ${theme.avatar} text-white flex items-center justify-center text-xl font-bold shadow-[0_0_0_4px_white,0_10px_15px_-3px_rgba(0,0,0,0.1)]`}
                    >
                        {initials(teacher.name)}
                    </div>
                )}

                <h3 className="mt-4 text-lg font-extrabold text-gray-900">{teacher.name || "Teacher"}</h3>
                <p className="mt-0.5 text-sm text-gray-400">{teacher.bio ? teacher.bio.split(".")[0] : "Professional Instructor"}</p>

                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${theme.bar}`}>
                    {teacher.isFeatured ? "Expert Teacher" : "Instructor"}
                </span>

                <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                    <div className="bg-gray-50 rounded-[14px] py-3 text-center">
                        <p className="text-sm font-extrabold text-blue-600 inline-flex items-center gap-1 justify-center">
                            <Users size={13} />
                            {teacher.studentCount}+
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">Students</p>
                    </div>
                    <div className="bg-gray-50 rounded-[14px] py-3 text-center">
                        <p className="text-sm font-extrabold text-blue-600 inline-flex items-center gap-1 justify-center">
                            <BookOpen size={13} />
                            {teacher.courseCount}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">Courses</p>
                    </div>
                </div>

                <div className="w-full mt-5 pt-4 border-t border-gray-100 space-y-2">
                    {teacher.email && (
                        <div className="flex items-center gap-2.5 text-xs text-gray-500">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 shrink-0">
                                <Mail size={13} className="text-blue-500" />
                            </span>
                            <span className="truncate">{teacher.email}</span>
                        </div>
                    )}
                    {teacher.phone && (
                        <div className="flex items-center gap-2.5 text-xs text-gray-500">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 shrink-0">
                                <Phone size={13} className="text-blue-500" />
                            </span>
                            <span>{teacher.phone}</span>
                        </div>
                    )}
                </div>

                <Link
                    href={`/teachers/${teacher._id}`}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white hover:shadow-md transition-shadow"
                >
                    View Profile
                    <ArrowRight size={15} />
                </Link>
            </div>
        </div>
    );
}

export default function TeacherDirectory({ teachers }) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return teachers;
        return teachers.filter(
            (t) =>
                t.name?.toLowerCase().includes(q) ||
                t.bio?.toLowerCase().includes(q) ||
                t.email?.toLowerCase().includes(q)
        );
    }, [teachers, search]);

    return (
        <>
            {/* Hero */}
            <section
                className="relative overflow-hidden"
                style={{
                    backgroundImage:
                        "linear-gradient(164deg, #eef2ff 0%, #eef3ff 10%, #eff4ff 30%, #f0f6ff 50%, #eef6fe 62%, #ecf6fe 75%, #eaf5fd 87%, #e8f4fd 100%)",
                }}
            >
                <div className="absolute right-[-80px] -top-20 w-80 h-80 rounded-full bg-indigo-200/40 blur-[64px]" />
                <div className="absolute -left-20 top-[200px] w-72 h-72 rounded-full bg-blue-200/40 blur-[64px]" />
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
                        <span className="text-blue-600 font-semibold">Teachers</span>
                    </nav>

                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold shadow-sm">
                            <Users size={16} />
                            Meet Our Teachers
                        </span>

                        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                            Our{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                Teachers
                            </span>
                        </h1>

                        <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                            Meet our experienced teachers who are dedicated to providing quality education and practical learning.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Intro + search */}
            <section className="bg-white py-16">
                <Container className="max-w-3xl text-center">
                    <span className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold">
                        Our Teachers
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Learn From Expert Teachers
                    </h2>
                    <p className="mt-4 text-gray-500 leading-relaxed">
                        Meet our experienced and dedicated teachers committed to helping students succeed in their learning journey.
                    </p>

                    <div className="relative mt-8 max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search teachers by name or specialty…"
                            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm shadow-[0_1px_3px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </Container>
            </section>

            {/* Grid */}
            <section
                className="py-20"
                style={{
                    backgroundImage:
                        "linear-gradient(152deg, #f9fafb 0%, rgba(247,249,252,0.65) 50%, rgba(239,246,255,0.3) 100%)",
                }}
            >
                <Container>
                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-[24px] p-16 text-center border border-gray-100">
                            <p className="text-gray-500">No teachers match your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                            {filtered.map((teacher, idx) => (
                                <TeacherCard key={teacher._id} teacher={teacher} theme={CARD_THEMES[idx % CARD_THEMES.length]} />
                            ))}
                        </div>
                    )}
                </Container>
            </section>
        </>
    );
}
