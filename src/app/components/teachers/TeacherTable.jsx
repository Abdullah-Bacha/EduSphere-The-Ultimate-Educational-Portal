"use client";

import TeacherActions from "./TeacherActions";

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
}

export default function TeacherTable({ teachers, onDelete }) {
    return (
        <div className="w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="px-6 py-5 bg-slate-50/95 border-b border-slate-200/70">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Teacher table</h2>
                    <p className="text-sm text-slate-500">
                        Total records: <span className="font-semibold text-slate-900">{teachers.length}</span>
                    </p>
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full table-auto text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/50">
                            <th className="px-6 py-4 whitespace-nowrap">Name</th>
                            <th className="px-6 py-4 whitespace-nowrap">Email</th>
                            <th className="px-6 py-4 whitespace-nowrap">Phone</th>
                            <th className="px-6 py-4 whitespace-nowrap">Status</th>
                            {/* <th className="px-6 py-4 whitespace-nowrap">Featured</th> */}
                            {/* <th className="px-6 py-4 whitespace-nowrap">Created</th> */}
                            <th className="px-6 py-4 whitespace-nowrap text-center pr-8">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {teachers.length > 0 ? (
                            teachers.map((teacher) => (
                                <tr key={teacher._id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                                        {teacher.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                        {teacher.email}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                        {teacher.phone || "—"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
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

                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                        {teacher.isFeatured ? (
                                            <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10">
                                                Featured
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">—</span>
                                        )}
                                    </td> */}
                                    {/* <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                        {formatDate(teacher.createdAt)}
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right pr-6">
                                        <TeacherActions
                                            teacher={teacher}
                                            onDelete={onDelete}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                                    No teachers found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
