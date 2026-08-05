"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, Clock, BookOpen, Inbox } from "lucide-react";
import StatGrid from "@/app/components/admin/StatGrid";
import { useToast } from "@/app/components/ui/ToastProvider";

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

const STATUS_BADGE = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
};

function money(n) {
    return n > 0 ? `$${Number(n).toLocaleString("en-US")}` : "Free";
}

export default function ApprovalsClient({ initialData }) {
    const { showToast } = useToast();
    const [rows, setRows] = useState(initialData?.rows || []);
    const [counts, setCounts] = useState(initialData?.counts || {});
    const [filter, setFilter] = useState("All");
    const [busyId, setBusyId] = useState(null);

    const filtered = useMemo(() => {
        if (filter === "All") return rows;
        return rows.filter((r) => r.approvalStatus === filter);
    }, [rows, filter]);

    function recount(list) {
        setCounts({
            total: list.length,
            pending: list.filter((r) => r.approvalStatus === "Pending").length,
            approved: list.filter((r) => r.approvalStatus === "Approved").length,
            rejected: list.filter((r) => r.approvalStatus === "Rejected").length,
        });
    }

    async function updateStatus(course, status) {
        if (course.approvalStatus === status) return;
        setBusyId(course._id);
        try {
            const res = await fetch(`/api/admin/course-approvals/${course._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.message || "Failed to update course.");
            }
            const next = rows.map((r) =>
                r._id === course._id
                    ? {
                          ...r,
                          approvalStatus: status,
                          isPublished: data?.result?.isPublished ?? r.isPublished,
                      }
                    : r
            );
            setRows(next);
            recount(next);
            showToast(`Course ${status.toLowerCase()}.`, "success");
        } catch (err) {
            showToast(err.message || "Something went wrong.", "error");
        } finally {
            setBusyId(null);
        }
    }

    const statItems = [
        { label: "Total courses", value: counts.total ?? 0, icon: BookOpen, tint: "bg-slate-100 text-slate-600" },
        { label: "Pending", value: counts.pending ?? 0, icon: Clock, tint: "bg-amber-50 text-amber-600" },
        { label: "Approved", value: counts.approved ?? 0, icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-600" },
        { label: "Rejected", value: counts.rejected ?? 0, icon: XCircle, tint: "bg-red-50 text-red-600" },
    ];

    return (
        <div className="space-y-5">
            <StatGrid items={statItems} columns={4} />

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-4">
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
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="mb-3 rounded-full bg-gray-50 p-4">
                            <Inbox className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                            No courses in this view
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                    <th className="px-6 py-3.5">Course</th>
                                    <th className="px-6 py-3.5">Instructor</th>
                                    <th className="px-6 py-3.5">Price</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/60">
                                        <td className="px-6 py-3.5">
                                            <div className="font-medium text-gray-900">
                                                {c.title}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {c.category}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-gray-600">
                                            {c.instructor}
                                        </td>
                                        <td className="px-6 py-3.5 text-gray-600">
                                            {money(c.price)}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span
                                                className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[c.approvalStatus]}`}
                                            >
                                                {c.approvalStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex justify-end gap-2">
                                                {c.approvalStatus !== "Approved" && (
                                                    <button
                                                        type="button"
                                                        disabled={busyId === c._id}
                                                        onClick={() => updateStatus(c, "Approved")}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                                                    >
                                                        <CheckCircle2 size={13} /> Approve
                                                    </button>
                                                )}
                                                {c.approvalStatus !== "Rejected" && (
                                                    <button
                                                        type="button"
                                                        disabled={busyId === c._id}
                                                        onClick={() => updateStatus(c, "Rejected")}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        <XCircle size={13} /> Reject
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
