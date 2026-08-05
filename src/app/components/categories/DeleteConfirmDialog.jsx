"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";

export default function DeleteConfirmDialog({
    open,
    categoryName,
    isDeleting,
    onCancel,
    onConfirm,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={!isDeleting ? onCancel : undefined}
            />

            {/* modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
                <button
                    onClick={onCancel}
                    disabled={isDeleting}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>

                <h3 className="text-base font-semibold text-gray-900">
                    Delete category?
                </h3>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-gray-700">
                        {categoryName ? `"${categoryName}"` : "this category"}
                    </span>
                    ? This action cannot be undone.
                </p>

                <div className="flex gap-2.5 mt-6">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-70"
                    >
                        {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}