"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function TeacherStudentsContent() {
    const searchParams = useSearchParams();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    async function loadStudents() {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                search,
                page,
                limit: 10,
            }).toString();

            const res = await fetch(`/api/teacher/students?${query}`);
            const data = await res.json();

            if (data.success) {
                setStudents(data.result.students);
                setTotalPages(data.result.totalPages || 1);
            } else {
                setStudents([]);
            }
        } catch (error) {
            console.error("Failed to load students:", error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadStudents();
    }, [search, page]);

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Students</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Track progress, completion percentages, and contact details of enrolled students.
                    </p>
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="border border-slate-300 rounded-lg px-4 py-2 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-4 animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-40 bg-slate-200 rounded-xl"></div>
                </div>
            ) : students.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4">Enrolled Course Progress</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-650">
                                {students.map((student) => (
                                    <tr key={student._id} className="hover:bg-slate-50/50">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-850">{student.name}</div>
                                            <div className="text-xs text-slate-400">{student.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <div>{student.phone || "—"}</div>
                                            <div className="text-xs text-slate-400 capitalize">{student.gender || "—"}</div>
                                        </td>
                                        <td className="p-4 space-y-2">
                                            {student.coursesProgress?.length === 0 ? (
                                                <span className="text-slate-400 text-xs">No active progress data</span>
                                            ) : (
                                                student.coursesProgress.map((cp, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 max-w-xs">
                                                        <div className="text-xs font-semibold text-slate-700 truncate flex-grow">
                                                            {cp.courseTitle}:
                                                        </div>
                                                        <div className="w-24 bg-slate-100 rounded-full h-1.5 shrink-0">
                                                            <div
                                                                className={`h-1.5 rounded-full ${
                                                                    cp.completionPercentage === 100 ? "bg-green-500" : "bg-blue-600"
                                                                }`}
                                                                style={{ width: `${cp.completionPercentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-800 shrink-0 w-8 text-right">
                                                            {cp.completionPercentage}%
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                                                student.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                                            }`}>
                                                {student.status || "Active"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/dashboard/teacher/students/view/${student._id}`}
                                                className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center p-4 border-t border-slate-100 gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-slate-600">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
                    <div className="text-5xl mb-4">👨‍🎓</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No students found</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        No students are enrolled in your courses matching the search criteria.
                    </p>
                </div>
            )}
        </div>
    );
}

export default function TeacherStudentsPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading students...</div>}>
            <TeacherStudentsContent />
        </Suspense>
    );
}
