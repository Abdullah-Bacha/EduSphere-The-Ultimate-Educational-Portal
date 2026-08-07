"use client";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";
import StudentActions from "./StudentActions";

const DEFAULT_AVATAR = "/images/abd.jpeg";

export default function StudentTable({
    students,
    onDelete,
    selectedIds = [],
    onToggleRow,
    onToggleAll,
}) {
    const selectable = typeof onToggleRow === "function";
    const selectedSet = new Set(selectedIds);
    const allVisibleSelected =
        selectable &&
        students.length > 0 &&
        students.every((s) => selectedSet.has(s._id));

    return (
        <div className="w-full">
            {/* Table Header Controls */}
            <div className="px-6 py-5 bg-slate-50/95 border-b border-slate-200/70">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Student Cards</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        {selectable && (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={allVisibleSelected}
                                    onChange={(e) => onToggleAll(e.target.checked)}
                                    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    aria-label="Select all students on this page"
                                />
                                <span className="text-sm text-slate-600">Select All</span>
                            </label>
                        )}
                        <p className="text-sm text-slate-500">
                            Total records: <span className="font-semibold text-slate-900">{students.length}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Card Grid Layout */}
            {students.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {students.map((student) => (
                        <div
                            key={student._id}
                            className={`rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-all flex flex-col ${
                                selectedSet.has(student._id)
                                    ? "border-blue-300 bg-blue-50/50"
                                    : "border-slate-100 bg-white"
                            }`}
                        >
                            {/* Avatar Section - Image at top, no centering padding */}
                            <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-50 overflow-hidden flex-shrink-0 relative">
                                {selectable && (
                                    <input
                                        type="checkbox"
                                        checked={selectedSet.has(student._id)}
                                        onChange={() => onToggleRow(student._id)}
                                        className="absolute top-3 left-3 h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 z-10"
                                        aria-label={`Select ${student.name}`}
                                    />
                                )}
                                {student.image ? (
                                    <Image
                                        src={student.image}
                                        alt={student.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                        onError={(e) => {
                                            e.currentTarget.src = DEFAULT_AVATAR;
                                        }}
                                    />
                                ) : (
                                    <Image
                                        src={DEFAULT_AVATAR}
                                        alt="Default avatar"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">
                                    {student.name}
                                </h3>

                                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                    {student.bio || "No bio added"}
                                </p>

                                <div className="space-y-2 text-xs text-slate-500 mb-4 flex-grow">
                                    <div className="truncate">
                                        <span className="font-semibold">Email:</span> {student.email}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Phone:</span> {student.phone || "—"}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Gender:</span> {student.gender || "—"}
                                    </div>
                                    <div>
                                        <span
                                            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset mt-2 ${
                                                student.status === "Active"
                                                    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                                                    : "bg-slate-50 text-slate-600 ring-slate-500/10"
                                            }`}
                                        >
                                            {student.status || "Active"}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="border-t border-slate-100 pt-4">
                                    <StudentActions
                                        student={student}
                                        onDelete={onDelete}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center text-slate-400">
                    No students found
                </div>
            )}
        </div>
    );
}
