"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/app/components/ui/ToastProvider";
import { useConfirm } from "@/app/components/ui/ConfirmProvider";

export default function StudentDetailActions({ student }) {
    const router = useRouter();
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        const ok = await confirm(
            `Are you sure you want to delete "${student.name}"? This action cannot be undone.`,
            { title: "Delete student" }
        );

        if (!ok) return;

        setDeleting(true);

        try {
            const res = await fetch(`/api/students/${student._id}`, {
                method: "DELETE",
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                showToast(data.message || "Failed to delete student", "error");
                setDeleting(false);
                return;
            }

            showToast("Student deleted successfully.", "success");
            router.push("/dashboard/students");
            router.refresh();
        } catch (error) {
            showToast(error.message || "Failed to delete student", "error");
            setDeleting(false);
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Link
                href={`/dashboard/students/edit/${student._id}`}
                className="inline-flex items-center justify-center rounded-xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
            >
                Edit
            </Link>

            <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
            >
                {deleting ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
}
