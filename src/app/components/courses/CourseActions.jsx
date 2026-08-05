"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";
import { useConfirm } from "@/app/components/ui/ConfirmProvider";

export default function CourseActions({ id }) {
    const router = useRouter();
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const [loading, setLoading] = useState(false);
    const courseId = String(id ?? "");

    async function handleDelete() {
        if (!courseId) {
            showToast("Course ID is missing.", "error");
            return;
        }

        const ok = await confirm("Delete this course? This cannot be undone.", {
            title: "Delete course",
        });
        if (!ok) return;

        setLoading(true);

        try {
            const res = await fetch(`/api/courses/${courseId}`, {
                method: "DELETE",
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.message || "Failed to delete course.");
            }

            showToast("Course deleted successfully.", "success");
            router.refresh();
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
            <Link
                href={`/dashboard/courses/view/${id}`}
                title="View course"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
            >
                <Eye size={17} />
            </Link>

            <Link
                href={`/dashboard/courses/edit/${id}`}
                title="Edit course"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50 transition"
            >
                <Pencil size={16} />
            </Link>

            <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                title="Delete course"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition disabled:opacity-50"
            >
                {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Trash2 size={16} />
                )}
            </button>
        </div>
    );
}