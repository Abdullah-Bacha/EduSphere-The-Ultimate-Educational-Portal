"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tag, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function CategoryForm({
    initialData = null,
    isEdit = false,
}) {
    const router = useRouter();

    const [name, setName] = useState(
        initialData?.name || ""
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim()) {
            setError("Category name is required.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const url = isEdit
                ? `/api/categories/${initialData._id}`
                : "/api/categories";

            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name.trim() }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message || "Unable to save category.");
                return;
            }

            setSuccess(
                isEdit
                    ? "Category updated successfully."
                    : "Category added successfully."
            );

            router.push("/dashboard/admin/categories");
            router.refresh();
        } catch (err) {
            setError(err.message || "Unable to save category.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl space-y-5 rounded-xl border bg-white p-6 shadow-sm sm:p-8"
        >
            <div className="flex items-center gap-3 border-b pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Tag size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEdit ? "Edit Category" : "Create Category"}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {isEdit
                            ? "Update the name of this category."
                            : "Add a new category for organizing courses."}
                    </p>
                </div>
            </div>

            {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3.5 text-sm text-green-700">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="e.g. Web Development"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    required
                />
            </div>

            <div className="flex flex-wrap gap-3 border-t pt-5">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading
                        ? "Saving..."
                        : isEdit
                            ? "Update Category"
                            : "Save Category"}
                </button>

                <Link
                    href="/dashboard/admin/categories"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}