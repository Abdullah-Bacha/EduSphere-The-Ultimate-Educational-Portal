"use client";

import Link from "next/link";
import { Pencil, Trash2, Loader2 } from "lucide-react";

export default function CategoryActions({ id, onDeleteClick, isDeleting }) {
    return (
        <div className="flex items-center gap-1.5">
            <Link
                href={`/dashboard/admin/categories/edit/${id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
            >
                <Pencil className="w-3.5 h-3.5" />
                Edit
            </Link>

            <button
                onClick={onDeleteClick}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                )}
                {isDeleting ? "Deleting" : "Delete"}
            </button>
        </div>
    );
}