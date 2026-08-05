"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, AlertTriangle, Search } from "lucide-react";
import StudentPerformanceCard from "./StudentPerformanceCard";
import SearchBar from "./SearchBar";

export default function StudentPerformanceDashboard({ students = [] }) {
    const [filteredStudents, setFilteredStudents] = useState(students);
    const [sortBy, setSortBy] = useState("average");
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        let filtered = students;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.id.includes(searchQuery)
            );
        }

        // Status filter
        if (filterStatus !== "all") {
            filtered = filtered.filter(s => {
                const avg = (s.assignmentAvg + s.quizAvg + s.completionScore) / 3;
                if (filterStatus === "excellent") return avg >= 90;
                if (filterStatus === "good") return avg >= 80 && avg < 90;
                if (filterStatus === "average") return avg >= 70 && avg < 80;
                if (filterStatus === "needsHelp") return avg < 70;
                return true;
            });
        }

        // Sorting
        filtered.sort((a, b) => {
            if (sortBy === "average") {
                const avgA = (a.assignmentAvg + a.quizAvg + a.completionScore) / 3;
                const avgB = (b.assignmentAvg + b.quizAvg + b.completionScore) / 3;
                return avgB - avgA;
            } else if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortBy === "trend") {
                return b.trend - a.trend;
            }
            return 0;
        });

        setFilteredStudents(filtered);
    }, [students, searchQuery, sortBy, filterStatus]);

    const excellentCount = students.filter(s =>
        (s.assignmentAvg + s.quizAvg + s.completionScore) / 3 >= 90
    ).length;
    const needsHelpCount = students.filter(s =>
        (s.assignmentAvg + s.quizAvg + s.completionScore) / 3 < 70
    ).length;
    const avgClassScore = students.length > 0
        ? Math.round(
            students.reduce((sum, s) => sum + (s.assignmentAvg + s.quizAvg + s.completionScore) / 3, 0) / students.length
        )
        : 0;

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 mb-1">Total Students</p>
                    <p className="text-2xl font-bold text-slate-900">{students.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 mb-1">Class Average</p>
                    <p className="text-2xl font-bold text-indigo-600">{avgClassScore}%</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={16} className="text-green-600" />
                        <p className="text-sm text-slate-600">Excellent</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{excellentCount}</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={16} className="text-red-600" />
                        <p className="text-sm text-slate-600">Needs Help</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{needsHelpCount}</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <SearchBar
                        onSearch={setSearchQuery}
                        placeholder="Search by name or student ID..."
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:outline-none"
                    >
                        <option value="average">Sort by Average</option>
                        <option value="name">Sort by Name</option>
                        <option value="trend">Sort by Trend</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:outline-none"
                    >
                        <option value="all">All Students</option>
                        <option value="excellent">Excellent (90+)</option>
                        <option value="good">Good (80-89)</option>
                        <option value="average">Average (70-79)</option>
                        <option value="needsHelp">Needs Help (&lt;70)</option>
                    </select>
                </div>
            </div>

            {/* Student Cards */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Student Performance
                    {filteredStudents.length !== students.length && (
                        <span className="text-sm font-normal text-slate-600 ml-2">
                            ({filteredStudents.length} of {students.length})
                        </span>
                    )}
                </h2>

                {filteredStudents.length === 0 ? (
                    <div className="text-center py-12">
                        <Users size={48} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-600">No students found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStudents.map(student => (
                            <StudentPerformanceCard
                                key={student.id}
                                student={student}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
