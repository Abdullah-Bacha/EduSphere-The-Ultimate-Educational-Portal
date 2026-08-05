"use client";

import { BarChart3, TrendingUp } from "lucide-react";

export default function CourseAnalytics({ courses }) {
    const avgCompletion = courses.length > 0
        ? Math.round(courses.reduce((sum, c) => sum + c.completion, 0) / courses.length)
        : 0;

    const totalStudents = courses.reduce((sum, c) => sum + c.studentCount, 0);
    const totalAssignments = courses.reduce((sum, c) => sum + c.assignmentCount, 0);

    const topCourse = courses.length > 0
        ? courses.reduce((top, c) => c.completion > top.completion ? c : top)
        : null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Performance Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-slate-900">Course Performance</h3>
                        <p className="text-sm text-slate-500 mt-1">Overall teaching metrics</p>
                    </div>
                    <BarChart3 className="text-indigo-600" size={20} />
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-700">Avg Completion</span>
                            <span className="text-lg font-bold text-indigo-600">{avgCompletion}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600"
                                style={{ width: `${avgCompletion}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Total Students</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totalStudents}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Assignments</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totalAssignments}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performing Course */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-slate-900">Top Performing Course</h3>
                        <p className="text-sm text-slate-500 mt-1">Highest completion rate</p>
                    </div>
                    <TrendingUp className="text-green-600" size={20} />
                </div>

                {topCourse ? (
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-slate-900 text-lg">{topCourse.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{topCourse.studentCount} students enrolled</p>
                        </div>

                        <div className="pt-3 border-t border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-slate-700">Completion Rate</span>
                                <span className="text-lg font-bold text-green-600">{topCourse.completion}%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-400 to-green-600"
                                    style={{ width: `${topCourse.completion}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-3">
                            <div className="bg-slate-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-slate-600">Lessons</p>
                                <p className="font-bold text-slate-900">{topCourse.lessonCount}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-slate-600">Assignments</p>
                                <p className="font-bold text-slate-900">{topCourse.assignmentCount}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-500">No courses available</p>
                )}
            </div>
        </div>
    );
}
