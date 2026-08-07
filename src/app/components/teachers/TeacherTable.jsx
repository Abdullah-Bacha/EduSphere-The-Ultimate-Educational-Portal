"use client";

import { User as UserIcon } from "lucide-react";
import TeacherActions from "./TeacherActions";

const DEFAULT_AVATAR = "/images/abd.jpeg";

export default function TeacherTable({ teachers, onDelete }) {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-200/70 bg-slate-50/95">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Phone</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.length > 0 ? (
                        teachers.map((teacher) => (
                            <tr
                                key={teacher._id}
                                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {teacher.image ? (
                                                <img
                                                    src={teacher.image}
                                                    alt={teacher.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = DEFAULT_AVATAR;
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={DEFAULT_AVATAR}
                                                    alt="Default avatar"
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900">{teacher.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 truncate">{teacher.email}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{teacher.phone || "—"}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                                            teacher.status === "Active"
                                                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                                                : "bg-slate-50 text-slate-600 ring-slate-500/10"
                                        }`}
                                    >
                                        {teacher.status || "Active"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <TeacherActions
                                        teacher={teacher}
                                        onDelete={onDelete}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                No teachers found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
