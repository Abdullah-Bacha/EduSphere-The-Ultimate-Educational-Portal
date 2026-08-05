"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CategoryActions from "./CategoryActions";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { Inbox, AlertCircle } from "lucide-react";

export default function CategoryTable({ categories }) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);
    const [targetCategory, setTargetCategory] = useState(null); // for modal

    async function handleConfirmDelete() {
        if (!targetCategory) return;
        const id = targetCategory._id;

        setError(null);
        setDeletingId(id);

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete category. Please try again.");
            }

            router.refresh();
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setDeletingId(null);
            setTargetCategory(null);
        }
    }

    if (!categories?.length) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Inbox className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">No categories yet</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Create your first category to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-6 py-3 border-b border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100">
                            <th className="text-left font-medium text-gray-500 uppercase tracking-wide text-xs py-3.5 px-6">
                                Name
                            </th>
                            <th className="text-left font-medium text-gray-500 uppercase tracking-wide text-xs py-3.5 px-6">
                                Created
                            </th>
                            <th className="text-right font-medium text-gray-500 uppercase tracking-wide text-xs py-3.5 px-6">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {categories.map((category) => (
                            <tr
                                key={category._id}
                                className="hover:bg-gray-50/60 transition-colors"
                            >
                                <td className="py-3.5 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-semibold shrink-0">
                                            {category.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {category.name}
                                        </span>
                                    </div>
                                </td>

                                <td className="py-3.5 px-6 text-gray-500">
                                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </td>

                                <td className="py-3.5 px-6">
                                    <div className="flex justify-end">
                                        <CategoryActions
                                            id={category._id}
                                            onDeleteClick={() => setTargetCategory(category)}
                                            isDeleting={deletingId === category._id}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <DeleteConfirmDialog
                open={!!targetCategory}
                categoryName={targetCategory?.name}
                isDeleting={!!deletingId}
                onCancel={() => setTargetCategory(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}