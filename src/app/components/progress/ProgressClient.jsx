"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, TrendingUp, CheckCircle2, AlertTriangle, Search, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import StatGrid from "@/app/components/admin/StatGrid";

const PAGE_SIZE = 10;
const FILTERS = ["All", "At risk", "In progress", "Completed"];

function formatDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function barColor(pct) {
    if (pct >= 100) return "bg-emerald-500";
    if (pct >= 30) return "bg-blue-500";
    return "bg-red-500";
}

export default function ProgressClient({ data }) {
    const rows = useMemo(() => data?.rows || [], [data]);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => { setPage(1); }, [search, filter]);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return rows.filter((r) => {
            if (filter === "At risk" && r.completion >= 30) return false;
            if (filter === "Completed" && r.completion < 100) return false;
            if (filter === "In progress" && (r.completion < 30 || r.completion >= 100)) return false;
            if (!term) return true;
            return (
                r.student?.toLowerCase().includes(term) ||
                r.email?.toLowerCase().includes(term) ||
                r.course?.toLowerCase().includes(term)
            );
        });
    }, [rows, filter, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const statItems = [
        { label: "Tracked records", value: data?.total ?? 0, icon: Users, tint: "bg-blue-50 text-blue-600" },
        { label: "Avg. completion", value: `${data?.avg ?? 0}%`, icon: TrendingUp, tint: "bg-indigo-50 text-indigo-600" },
        { label: "Completed", value: data?.completed ?? 0, icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-600" },
        { label: "At risk (<30%)", value: data?.atRisk ?? 0, icon: AlertTriangle, tint: "bg-red-50 text-red-600" },
    ];

    return (
        <div className="space-y-5">
            <StatGrid items={statItems} columns={4} />

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFilter(f)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                    filter === f
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative sm:w-64">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search student or course…"
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="mb-3 rounded-full bg-gray-50 p-4">
                            <Inbox className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">No progress records found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                        <th className="px-6 py-3.5">Student</th>
                                        <th className="px-6 py-3.5">Course</th>
                                        <th className="px-6 py-3.5 w-56">Completion</th>
                                        <th className="px-6 py-3.5">Last active</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginated.map((r) => (
                                        <tr key={r._id} className="hover:bg-gray-50/60">
                                            <td className="px-6 py-3.5">
                                                <div className="font-medium text-gray-900">{r.student}</div>
                                                <div className="text-xs text-gray-400">{r.email}</div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="text-gray-700">{r.course}</div>
                                                <div className="text-xs text-gray-400">{r.category}</div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                                                        <div
                                                            className={`h-full rounded-full ${barColor(r.completion)}`}
                                                            style={{ width: `${r.completion}%` }}
                                                        />
                                                    </div>
                                                    <span className="w-10 text-right text-xs font-semibold text-gray-700">
                                                        {r.completion}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-gray-500">{formatDate(r.lastAccessed)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                                <p className="text-sm text-gray-500">
                                    Page <span className="font-semibold text-gray-900">{currentPage}</span> of {totalPages}
                                    <span className="ml-2 text-gray-400">({filtered.length} records)</span>
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
