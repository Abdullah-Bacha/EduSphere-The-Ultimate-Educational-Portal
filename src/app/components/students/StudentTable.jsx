"use client";
import StudentActions from "./StudentActions";

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
        <div className="w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            {/* Table Header Controls */}
            <div className="px-6 py-5 bg-slate-50/95 border-b border-slate-200/70">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Student table</h2>
                    </div>
                    <p className="text-sm text-slate-500">
                        Total records: <span className="font-semibold text-slate-900">{students.length}</span>
                    </p>
                </div>
            </div>

            {/* Responsive Scroll Container */}
            <div className="w-full overflow-x-auto">
                <table className="w-full table-auto text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/50">
                            {selectable && (
                                <th className="px-6 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={allVisibleSelected}
                                        onChange={(e) => onToggleAll(e.target.checked)}
                                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        aria-label="Select all students on this page"
                                    />
                                </th>
                            )}
                            <th className="px-6 py-4 whitespace-nowrap">Name</th>
                            <th className="px-6 py-4 whitespace-nowrap">Email</th>
                            <th className="px-6 py-4 whitespace-nowrap">Phone</th>
                            <th className="px-6 py-4 whitespace-nowrap">Gender</th>
                            <th className="px-6 py-4 whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 whitespace-nowrap text-center pr-8">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr
                                    key={student._id}
                                    className={`transition-colors ${
                                        selectedSet.has(student._id)
                                            ? "bg-blue-50/50"
                                            : "hover:bg-slate-50/60"
                                    }`}
                                >
                                    {selectable && (
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedSet.has(student._id)}
                                                onChange={() => onToggleRow(student._id)}
                                                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                aria-label={`Select ${student.name}`}
                                            />
                                        </td>
                                    )}
                                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                        {student.email}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                        {student.phone || "—"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap capitalize">
                                        {student.gender || "—"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${student.status === "Active"
                                                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                                                : "bg-slate-50 text-slate-600 ring-slate-500/10"
                                            }`}>
                                            {student.status || "Active"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right pr-6">
                                        <StudentActions
                                            student={student}
                                            onDelete={onDelete}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={selectable ? 7 : 6} className="px-6 py-12 text-center text-slate-400">
                                    No students found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
