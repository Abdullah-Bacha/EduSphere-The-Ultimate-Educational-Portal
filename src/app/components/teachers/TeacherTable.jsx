"use client";

import { User as UserIcon } from "lucide-react";
import TeacherActions from "./TeacherActions";

const DEFAULT_AVATAR = "/images/abd.jpeg";

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
}

export default function TeacherTable({ teachers, onDelete }) {
    return (
        <div className="w-full">
            <div className="px-6 py-5 bg-slate-50/95 border-b border-slate-200/70">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Teacher Cards</h2>
                    <p className="text-sm text-slate-500">
                        Total records: <span className="font-semibold text-slate-900">{teachers.length}</span>
                    </p>
                </div>
            </div>

            {teachers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {teachers.map((teacher) => (
                        <div
                            key={teacher._id}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                        >
                            {/* Avatar Section - Image at top, no centering padding */}
                            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden flex-shrink-0">
                                {teacher.image ? (
                                    <img
                                        src={teacher.image}
                                        alt={teacher.name}
                                        className="h-full w-full object-cover"
                                        style={{ objectPosition: "center top" }}
                                        onError={(e) => {
                                            e.currentTarget.src = DEFAULT_AVATAR;
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={DEFAULT_AVATAR}
                                        alt="Default avatar"
                                        className="h-full w-full object-cover"
                                        style={{ objectPosition: "center top" }}
                                    />
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">
                                    {teacher.name}
                                </h3>

                                <p className="text-sm text-slate-600 mb-3">
                                    {teacher.bio || "No bio added"}
                                </p>

                                <div className="space-y-2 text-xs text-slate-500 mb-4 flex-grow">
                                    <div className="truncate">
                                        <span className="font-semibold">Email:</span> {teacher.email}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Phone:</span> {teacher.phone || "—"}
                                    </div>
                                    <div>
                                        <span
                                            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset mt-2 ${
                                                teacher.status === "Active"
                                                    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                                                    : "bg-slate-50 text-slate-600 ring-slate-500/10"
                                            }`}
                                        >
                                            {teacher.status || "Active"}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="border-t border-slate-100 pt-4">
                                    <TeacherActions
                                        teacher={teacher}
                                        onDelete={onDelete}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center text-slate-400">
                    No teachers found
                </div>
            )}
        </div>
    );
}
