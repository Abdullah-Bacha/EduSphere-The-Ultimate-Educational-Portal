"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, BookOpen, GraduationCap, Search, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import StatGrid from "@/app/components/admin/StatGrid";

const PAGE_SIZE = 10;

export default function EnrollmentsClient({ data }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const rows = useMemo(() => data?.rows || [], [data]);

    useEffect(() => { setPage(1); }, [search]);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        const list = term
            ? rows.filter(
                  (r) =>
                      r.title?.toLowerCase().includes(term) ||
                      r.instructor?.toLowerCase().includes(term) ||
                      r.category?.toLowerCase().includes(term)
              )
            : rows;
        return [...list].sort((a, b) => b.enrolled - a.enrolled);
    }, [rows, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const maxEnrolled = Math.max(1, ...rows.map((r) => r.enrolled));

    const statItems = [
        { label: "Total enrollments", value: data?.totalEnrollments ?? 0, icon: Users, tint: "bg-blue-50 text-blue-600" },
        { label: "Students enrolled", value: data?.studentsEnrolled ?? 0, icon: GraduationCap, tint: "bg-emerald-50 text-emerald-600" },
        { label: "Active courses", value: data?.activeCourses ?? 0, icon: BookOpen, tint: "bg-amber-50 text-amber-600" },
        { label: "Total courses", value: data?.totalCourses ?? 0, icon: BookOpen, tint: "bg-slate-100 text-slate-600" },
    ];

    return (
        <div className="space-y-5">
            <StatGrid items={statItems} columns={4} />

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                    <div className="relative max-w-md">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search courses…"
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="mb-3 rounded-full bg-gray-50 p-4">
                            <Inbox className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">No courses found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                        <th className="px-6 py-3.5">Course</th>
                                        <th className="px-6 py-3.5">Instructor</th>
                                        <th className="px-6 py-3.5">Category</th>
                                        <th className="px-6 py-3.5 w-56">Enrolled</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginated.map((r) => (
                                        <tr key={r._id} className="hover:bg-gray-50/60">
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-2 font-medium text-gray-900">
                                                    {r.title}
                                                    {!r.isPublished && (
                                                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                                                            Draft
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-gray-600">{r.instructor}</td>
                                            <td className="px-6 py-3.5">
                                                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                    {r.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                                                        <div
                                                            className="h-full rounded-full bg-blue-500"
                                                            style={{ width: `${(r.enrolled / maxEnrolled) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="w-8 text-right text-xs font-semibold text-gray-700">
                                                        {r.enrolled}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                                <p className="text-sm text-gray-500">
                                    Page <span className="font-semibold text-gray-900">{currentPage}</span> of {totalPages}
                                    <span className="ml-2 text-gray-400">({filtered.length} courses)</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={currentPage <= 1}
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                                    >
                                        <ChevronLeft size={15} /> Prev
                                    </button>
                                    <button
                                        type="button"
                                        disabled={currentPage >= totalPages}
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                                    >
                                        Next <ChevronRight size={15} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
