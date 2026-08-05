"use client";

import { useState } from "react";
import { Download, BarChart3 } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function GradeBook({ assignments = [], students = [], grades = [], onGraded }) {
    const { showToast } = useToast();
    const [selectedAssignment, setSelectedAssignment] = useState(assignments[0]?._id || "");
    const [editingGrades, setEditingGrades] = useState({});
    const [localGrades, setLocalGrades] = useState(grades);

    // keep localGrades in sync when parent refreshes
    const gradeKey = JSON.stringify(grades);
    const [lastKey, setLastKey] = useState(gradeKey);
    if (gradeKey !== lastKey) {
        setLocalGrades(grades);
        setLastKey(gradeKey);
    }

    const sid = (student) => student.id || student._id;

    const handleGradeChange = (studentId, grade) => {
        setEditingGrades(prev => ({ ...prev, [studentId]: grade }));
    };

    const handleSaveGrade = async (studentId, assignmentId) => {
        const grade = editingGrades[studentId];
        if (grade === undefined || grade === "") return;

        try {
            const res = await fetch("/api/teacher/grades", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId, assignmentId, grade: parseFloat(grade) }),
            });
            const data = await res.json();

            if (data.success) {
                // optimistic update — reflect the new grade immediately
                setLocalGrades(prev => {
                    const filtered = prev.filter(
                        g => !(g.studentId === studentId && g.assignmentId === assignmentId)
                    );
                    return [...filtered, {
                        studentId,
                        assignmentId,
                        grade: parseFloat(grade),
                        status: "Graded",
                    }];
                });
                setEditingGrades(prev => {
                    const next = { ...prev };
                    delete next[studentId];
                    return next;
                });
                showToast("Grade saved successfully", "success");
                onGraded?.();
            } else {
                showToast(data.message || "Failed to save grade", "error");
            }
        } catch (err) {
            console.error("Error saving grade:", err);
            showToast("Failed to save grade", "error");
        }
    };

    const handleExportCSV = () => {
        const rows = [["Student", "Email", "Assignment", "Grade", "Status"]];
        students.forEach(student => {
            assignments.forEach(assignment => {
                const g = localGrades.find(
                    x => x.studentId === sid(student) && x.assignmentId === assignment._id
                );
                rows.push([
                    student.name,
                    student.email,
                    assignment.title,
                    g ? g.grade : "",
                    g ? "Graded" : "Pending",
                ]);
            });
        });
        const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "grade-book.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const filteredGrades = selectedAssignment
        ? localGrades.filter(g => g.assignmentId === selectedAssignment)
        : localGrades;

    const avgGrade = filteredGrades.length > 0
        ? Math.round(filteredGrades.reduce((sum, g) => sum + g.grade, 0) / filteredGrades.length)
        : 0;

    const highestGrade = filteredGrades.length > 0
        ? Math.max(...filteredGrades.map(g => g.grade))
        : 0;

    const lowestGrade = filteredGrades.length > 0
        ? Math.min(...filteredGrades.map(g => g.grade))
        : 0;

    return (
        <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 mb-1">Total Assignments</p>
                    <p className="text-2xl font-bold text-slate-900">{assignments.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 mb-1">Average Grade</p>
                    <p className="text-2xl font-bold text-indigo-600">{avgGrade}%</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 mb-1">Highest Grade</p>
                    <p className="text-2xl font-bold text-green-600">{highestGrade}%</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 mb-1">Lowest Grade</p>
                    <p className="text-2xl font-bold text-red-600">{lowestGrade}%</p>
                </div>
            </div>

            {/* Grade Book Table */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <BarChart3 size={20} />
                        Grade Book
                    </h2>
                    <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>

                {/* Assignment Filter */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Assignment</label>
                    <select
                        value={selectedAssignment}
                        onChange={(e) => setSelectedAssignment(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    >
                        <option value="">All Assignments</option>
                        {assignments.map(a => (
                            <option key={a._id} value={a._id}>{a.title}</option>
                        ))}
                    </select>
                </div>

                {/* Grade Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="px-4 py-3 text-left font-semibold text-slate-700">Student Name</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-700">Grade</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-700">Status</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                                        No students enrolled in your courses yet.
                                    </td>
                                </tr>
                            ) : (
                                students.map(student => {
                                    const studentId = sid(student);
                                    const grade = filteredGrades.find(g => g.studentId === studentId);
                                    const isEditing = editingGrades[studentId] !== undefined;
                                    const currentGrade = isEditing ? editingGrades[studentId] : (grade?.grade ?? "");

                                    return (
                                        <tr key={studentId} className="border-b border-slate-200 hover:bg-slate-50 transition">
                                            <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                                            <td className="px-4 py-3 text-slate-600">{student.email}</td>
                                            <td className="px-4 py-3 text-center">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={currentGrade}
                                                        onChange={(e) => handleGradeChange(studentId, e.target.value)}
                                                        className="w-16 px-2 py-1 border border-indigo-500 rounded text-center focus:outline-none"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span className="font-semibold text-slate-900">
                                                        {currentGrade !== "" ? currentGrade : "-"}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {grade ? (
                                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                                        Graded
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {isEditing ? (
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleSaveGrade(studentId, selectedAssignment)}
                                                            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const next = { ...editingGrades };
                                                                delete next[studentId];
                                                                setEditingGrades(next);
                                                            }}
                                                            className="px-2 py-1 bg-slate-300 text-slate-700 rounded text-xs hover:bg-slate-400 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleGradeChange(studentId, currentGrade)}
                                                        disabled={!selectedAssignment}
                                                        className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                                        title={!selectedAssignment ? "Select an assignment first" : ""}
                                                    >
                                                        Grade
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
