"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Search, Trash2, CalendarDays, BookOpen, Inbox, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;
import StatGrid from "@/app/components/admin/StatGrid";
import { useToast } from "@/app/components/ui/ToastProvider";
import { useConfirm } from "@/app/components/ui/ConfirmProvider";

function formatDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function CertificatesClient({ initialCertificates, stats }) {
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    const [certificates, setCertificates] = useState(initialCertificates || []);
    const [search, setSearch] = useState("");
    const [busyId, setBusyId] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => { setPage(1); }, [search]);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return certificates;
        return certificates.filter(
            (c) =>
                c.certificateId?.toLowerCase().includes(term) ||
                c.student?.name?.toLowerCase().includes(term) ||
                c.student?.email?.toLowerCase().includes(term) ||
                c.course?.title?.toLowerCase().includes(term)
        );
    }, [certificates, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    async function handleRevoke(cert) {
        const ok = await confirm(
            `Revoke certificate ${cert.certificateId}? The student will lose this certificate.`,
            { title: "Revoke certificate", confirmText: "Revoke" }
        );
        if (!ok) return;

        setBusyId(cert._id);
        try {
            const res = await fetch(`/api/admin/certificates/${cert._id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || "Failed to revoke certificate.");
            }
            setCertificates((prev) => prev.filter((c) => c._id !== cert._id));
            showToast("Certificate revoked.", "success");
        } catch (err) {
            showToast(err.message || "Something went wrong.", "error");
        } finally {
            setBusyId(null);
        }
    }

    const statItems = [
        { label: "Total issued", value: stats?.total ?? 0, icon: Award, tint: "bg-blue-50 text-blue-600" },
        { label: "This month", value: stats?.thisMonth ?? 0, icon: CalendarDays, tint: "bg-emerald-50 text-emerald-600" },
        { label: "Courses covered", value: stats?.courses ?? 0, icon: BookOpen, tint: "bg-amber-50 text-amber-600" },
    ];

    return (
        <div className="space-y-5">
            <StatGrid items={statItems} columns={3} />

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
                    <div className="relative max-w-md">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by student, course, or certificate ID…"
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="mb-3 rounded-full bg-gray-50 p-4">
                            <Inbox className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                            No certificates found
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Certificates appear here once students complete courses.
                        </p>
                    </div>
                ) : (
                    <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                    <th className="px-6 py-3.5">Certificate ID</th>
                                    <th className="px-6 py-3.5">Student</th>
                                    <th className="px-6 py-3.5">Course</th>
                                    <th className="px-6 py-3.5">Grade</th>
                                    <th className="px-6 py-3.5">Issued</th>
                                    <th className="px-6 py-3.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginated.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/60">
                                        <td className="px-6 py-3.5 font-mono text-xs font-medium text-gray-700">
                                            {c.certificateId}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="font-medium text-gray-900">
                                                {c.student?.name || "Unknown"}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {c.student?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-gray-600">
                                            {c.course?.title || "—"}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                                {c.grade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-gray-500">
                                            {formatDate(c.issueDate)}
                                        </td>
                                        <td className="px-6 py-3.5 text-right">
                                            <button
                                                type="button"
                                                disabled={busyId === c._id}
                                                onClick={() => handleRevoke(c)}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                            >
                                                <Trash2 size={13} /> Revoke
                                            </button>
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
                                <span className="ml-2 text-gray-400">({filtered.length} total)</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button type="button" disabled={currentPage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40">
                                    <ChevronLeft size={15} /> Prev
                                </button>
                                <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40">
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
