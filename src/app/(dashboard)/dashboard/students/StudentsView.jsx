"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, UserCheck, UserX, Trash2, X } from "lucide-react";
import StudentSearch from "../../../components/students/StudentSearch";
import StudentTable from "../../../components/students/StudentTable";
import ExportButton from "@/app/components/admin/ExportButton";
import { useToast } from "@/app/components/ui/ToastProvider";
import { useConfirm } from "@/app/components/ui/ConfirmProvider";

const STATUS_FILTERS = ["All", "Active", "Inactive"];
const PAGE_SIZE = 10;

export default function StudentsView() {
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bulkBusy, setBulkBusy] = useState(false);
    const [error, setError] = useState("");

    async function loadStudents() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `/api/students?search=${encodeURIComponent(search)}`
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to load students");
                setStudents([]);
                return;
            }

            setStudents(data.result || []);
        } catch (err) {
            setError(err.message);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        const ok = await confirm("Delete this student?", { title: "Delete student" });

        if (!ok) return;

        try {
            const res = await fetch(`/api/students/${id}`, {
                method: "DELETE",
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                showToast(data.message || "Failed to delete student", "error");
                return;
            }

            showToast("Student deleted successfully.", "success");
            await loadStudents();
        } catch (err) {
            showToast(err.message || "Failed to delete student", "error");
        }
    }

    useEffect(() => {
        loadStudents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // Reset paging and selection whenever the visible set changes.
    useEffect(() => {
        setPage(1);
        setSelectedIds([]);
    }, [search, statusFilter]);

    const filtered = useMemo(() => {
        if (statusFilter === "All") return students;
        return students.filter(
            (s) => (s.status || "Active") === statusFilter
        );
    }, [students, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginated = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    function toggleRow(id) {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    function toggleAll(checked) {
        const pageIds = paginated.map((s) => s._id);
        setSelectedIds((prev) => {
            if (checked) {
                return Array.from(new Set([...prev, ...pageIds]));
            }
            return prev.filter((id) => !pageIds.includes(id));
        });
    }

    async function runBulk(action, label) {
        if (selectedIds.length === 0) return;

        if (action === "delete") {
            const ok = await confirm(
                `Delete ${selectedIds.length} selected student(s)? This cannot be undone.`,
                { title: "Delete students", confirmText: "Delete" }
            );
            if (!ok) return;
        }

        setBulkBusy(true);
        try {
            const res = await fetch("/api/students/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds, action }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.message || "Bulk action failed.");
            }
            showToast(data?.message || `${label} done.`, "success");
            setSelectedIds([]);
            await loadStudents();
        } catch (err) {
            showToast(err.message || "Something went wrong.", "error");
        } finally {
            setBulkBusy(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200/70">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                            <h1 className="text-3xl font-semibold text-slate-900">Students</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                Manage student profiles, contact details, and enrollment status from one place.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <div className="flex-1 min-w-0">
                                <StudentSearch search={search} setSearch={setSearch} />
                            </div>

                            <div className="flex flex-col items-end gap-2 ml-4">
                                <div className="flex items-center gap-2">
                                    <ExportButton type="students" />
                                    <Link
                                        href="/dashboard/students/add"
                                        className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-blue-700"
                                    >
                                        + Add Student
                                    </Link>
                                </div>
                                <div className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-900">{filtered.length}</span> students</div>
                            </div>
                        </div>
                    </div>

                    {/* Status filters */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {STATUS_FILTERS.map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setStatusFilter(f)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                    statusFilter === f
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bulk action bar */}
                {selectedIds.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 border-b border-blue-100 bg-blue-50/70 px-6 py-3">
                        <span className="text-sm font-medium text-blue-800">
                            {selectedIds.length} selected
                        </span>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                disabled={bulkBusy}
                                onClick={() => runBulk("activate", "Activated")}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                            >
                                <UserCheck size={14} /> Activate
                            </button>
                            <button
                                type="button"
                                disabled={bulkBusy}
                                onClick={() => runBulk("deactivate", "Deactivated")}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                <UserX size={14} /> Deactivate
                            </button>
                            <button
                                type="button"
                                disabled={bulkBusy}
                                onClick={() => runBulk("delete", "Deleted")}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedIds([])}
                            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                        >
                            <X size={14} /> Clear
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="p-10 text-center text-slate-500">Loading students...</div>
                ) : error ? (
                    <div className="p-10 text-center text-red-600">{error}</div>
                ) : (
                    <>
                        <StudentTable
                            students={paginated}
                            onDelete={handleDelete}
                            selectedIds={selectedIds}
                            onToggleRow={toggleRow}
                            onToggleAll={toggleAll}
                        />

                        {filtered.length > PAGE_SIZE && (
                            <div className="flex items-center justify-between border-t border-slate-200/70 px-6 py-4">
                                <p className="text-sm text-slate-500">
                                    Page{" "}
                                    <span className="font-semibold text-slate-900">
                                        {currentPage}
                                    </span>{" "}
                                    of {totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={currentPage <= 1}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft size={15} /> Prev
                                    </button>
                                    <button
                                        type="button"
                                        disabled={currentPage >= totalPages}
                                        onClick={() =>
                                            setPage((p) => Math.min(totalPages, p + 1))
                                        }
                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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
