"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StudentSearch from "../../../components/students/StudentSearch";
import TeacherTable from "../../../components/teachers/TeacherTable";
import ExportButton from "@/app/components/admin/ExportButton";
import { useToast } from "@/app/components/ui/ToastProvider";
import { useConfirm } from "@/app/components/ui/ConfirmProvider";

export default function TeachersView() {
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadTeachers() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `/api/teachers?search=${encodeURIComponent(search)}`
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to load teachers");
                setTeachers([]);
                return;
            }

            setTeachers(data.result || []);
        } catch (err) {
            setError(err.message || "Failed to load teachers");
            setTeachers([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        const ok = await confirm("Delete this teacher?", { title: "Delete teacher" });

        if (!ok) return;

        try {
            const res = await fetch(`/api/teachers/${id}`, {
                method: "DELETE",
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                showToast(data.message || "Failed to delete teacher", "error");
                return;
            }

            showToast("Teacher deleted successfully.", "success");
            await loadTeachers();
        } catch (err) {
            showToast(err.message || "Failed to delete teacher", "error");
        }
    }

    useEffect(() => {
        loadTeachers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200/70">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                            <h1 className="text-3xl font-semibold text-slate-900">Teachers</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                Manage teacher profiles, contact details, and featured status from one place.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <div className="flex-1 min-w-0">
                                <StudentSearch
                                    search={search}
                                    setSearch={setSearch}
                                    placeholder="Search teachers..."
                                />
                            </div>

                            <div className="flex flex-col items-end gap-2 ml-4">
                                <div className="flex items-center gap-2">
                                    <ExportButton type="teachers" />
                                    <Link
                                        href="/dashboard/teachers/add"
                                        className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-blue-700"
                                    >
                                        + Add Teacher
                                    </Link>
                                </div>
                                <div className="text-sm text-slate-500">
                                    Showing <span className="font-semibold text-slate-900">{teachers.length}</span> teachers
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-slate-500">Loading teachers...</div>
                ) : error ? (
                    <div className="p-10 text-center text-red-600">{error}</div>
                ) : (
                    <TeacherTable
                        teachers={teachers}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}
