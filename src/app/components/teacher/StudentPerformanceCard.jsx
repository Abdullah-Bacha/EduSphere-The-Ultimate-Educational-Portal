"use client";

import { TrendingUp, TrendingDown, Award, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function StudentPerformanceCard({ student }) {
    const getPerformanceColor = (score) => {
        if (score >= 90) return "text-green-600 bg-green-50";
        if (score >= 80) return "text-blue-600 bg-blue-50";
        if (score >= 70) return "text-yellow-600 bg-yellow-50";
        return "text-red-600 bg-red-50";
    };

    const getPerformanceBadge = (score) => {
        if (score >= 90) return { text: "Excellent", color: "bg-green-100 text-green-800" };
        if (score >= 80) return { text: "Good", color: "bg-blue-100 text-blue-800" };
        if (score >= 70) return { text: "Average", color: "bg-yellow-100 text-yellow-800" };
        return { text: "Needs Help", color: "bg-red-100 text-red-800" };
    };

    const avgScore = Math.round(
        (student.assignmentAvg + student.quizAvg + student.completionScore) / 3
    );
    const badge = getPerformanceBadge(avgScore);
    const trend = student.trend >= 0 ? "up" : "down";

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-slate-900">{student.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">ID: {student.id}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                    {badge.text}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-600">Assignments</p>
                    <p className="font-bold text-slate-900">{student.assignmentAvg}%</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-600">Quizzes</p>
                    <p className="font-bold text-slate-900">{student.quizAvg}%</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-600">Completion</p>
                    <p className="font-bold text-slate-900">{student.completionScore}%</p>
                </div>
                <div className={`rounded-lg p-2 ${getPerformanceColor(avgScore)}`}>
                    <p className="text-xs">Average</p>
                    <p className="font-bold">{avgScore}%</p>
                </div>
            </div>

            <div className="mb-3 flex items-center gap-1">
                {trend === "up" ? (
                    <TrendingUp size={14} className="text-green-600" />
                ) : (
                    <TrendingDown size={14} className="text-red-600" />
                )}
                <span className={`text-xs font-semibold ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(student.trend)}% {trend === "up" ? "improvement" : "decline"}
                </span>
            </div>

            {student.alerts && student.alerts.length > 0 && (
                <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    {student.alerts.map((alert, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-amber-700">
                            <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                            <span>{alert}</span>
                        </div>
                    ))}
                </div>
            )}

            <Link
                href={`/dashboard/teacher/students/view/${student.id}`}
                className="block w-full px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm text-center"
            >
                View Details
            </Link>
        </div>
    );
}
