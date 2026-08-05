"use client";

import { Trash2, Edit2, Pin } from "lucide-react";
import Link from "next/link";

export default function AnnouncementsList({ announcements = [], onDelete, onEdit }) {
    const getCategoryColor = (category) => {
        const colors = {
            general: "bg-slate-100 text-slate-800",
            assignment: "bg-blue-100 text-blue-800",
            deadline: "bg-red-100 text-red-800",
            important: "bg-amber-100 text-amber-800",
            update: "bg-green-100 text-green-800",
        };
        return colors[category] || colors.general;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Announcements</h2>

            {announcements.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg">
                    <p className="text-slate-600">No announcements yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {announcements.map(announcement => (
                        <div
                            key={announcement._id}
                            className={`bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition ${
                                announcement.pin ? "border-indigo-300 bg-indigo-50" : ""
                            }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {announcement.pin && (
                                            <Pin size={16} className="text-indigo-600" />
                                        )}
                                        <h3 className="font-semibold text-slate-900">{announcement.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(announcement.category)}`}>
                                            {announcement.category}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {formatDate(announcement.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit?.(announcement)}
                                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                                        title="Edit announcement"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(announcement._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Delete announcement"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-slate-700 line-clamp-2">{announcement.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
