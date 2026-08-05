"use client";

import { Download, Upload, FileJson, FileText } from "lucide-react";
import { useState } from "react";

export default function ExportButton({ data, filename = "teacher-dashboard" }) {
    const [open, setOpen] = useState(false);

    const handleExportJSON = () => {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setOpen(false);
    };

    const handleExportCSV = () => {
        // Create CSV from dashboard data
        let csv = "Teacher Dashboard Report\n";
        csv += `Generated: ${new Date().toLocaleString()}\n\n`;

        csv += "SUMMARY\n";
        csv += `Courses: ${data.assignedCourses}\n`;
        csv += `Students: ${data.totalStudents}\n`;
        csv += `Pending Assignments: ${data.pendingAssignments}\n`;
        csv += `Quizzes: ${data.totalQuizzes}\n\n`;

        csv += "COURSES\n";
        csv += "Course Name,Students,Completion %,Lessons,Assignments\n";
        data.allCourses?.forEach(course => {
            csv += `"${course.title}",${course.studentCount},${course.completion},${course.lessonCount},${course.assignmentCount}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
            >
                <Download size={16} />
                Export
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
                    <button
                        onClick={handleExportJSON}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition border-b border-slate-200 text-left"
                    >
                        <FileJson size={18} className="text-blue-600" />
                        <div>
                            <p className="font-medium text-slate-900">Export as JSON</p>
                            <p className="text-xs text-slate-500">Full data backup</p>
                        </div>
                    </button>

                    <button
                        onClick={handleExportCSV}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition text-left"
                    >
                        <FileText size={18} className="text-green-600" />
                        <div>
                            <p className="font-medium text-slate-900">Export as CSV</p>
                            <p className="text-xs text-slate-500">Spreadsheet format</p>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
