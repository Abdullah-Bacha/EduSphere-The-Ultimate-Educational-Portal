"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProgressPage() {
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchOverallProgress() {
            try {
                const res = await fetch("/api/student/progress");
                const data = await res.json();

                if (data.success) {
                    setProgressData(data.result);
                } else {
                    setError(data.message || "Failed to load progress data");
                }
            } catch (err) {
                setError("An error occurred while fetching progress data.");
            } finally {
                setLoading(false);
            }
        }

        fetchOverallProgress();
    }, []);

    if (loading) {
        return (
            <div className="p-6 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                    ))}
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    const { stats, progressList } = progressData;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">My Progress</h1>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                    <div className="text-sm text-slate-500 font-semibold mb-1">Average Progress</div>
                    <div className="text-4xl font-bold text-blue-600">{stats.averageProgress}%</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                    <div className="text-sm text-slate-500 font-semibold mb-1">Total Enrolled</div>
                    <div className="text-4xl font-bold text-slate-800">{stats.totalEnrolled}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                    <div className="text-sm text-slate-500 font-semibold mb-1">Completed Courses</div>
                    <div className="text-4xl font-bold text-green-500">{stats.totalCompleted}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                    <div className="text-sm text-slate-500 font-semibold mb-1">In Progress</div>
                    <div className="text-4xl font-bold text-amber-500">{stats.totalIncomplete}</div>
                </div>
            </div>

            {/* Detailed Course Progress */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">Course Breakdown</h2>

                {progressList.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-slate-100">
                        <div className="text-4xl mb-4">📈</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No progress data yet</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                            You haven't started any courses. Enroll in a course and complete lessons to see your progress here.
                        </p>
                        <Link href="/dashboard/student/my-courses" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                            Go to My Courses
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {progressList.map((progress) => (
                            <div key={progress._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
                                
                                {progress.course?.thumbnail && (
                                    <div className="w-full md:w-48 h-32 md:h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                        <img src={progress.course.thumbnail} alt="Course" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="flex-grow w-full">
                                    <h3 className="font-bold text-lg text-slate-800 mb-1">
                                        {progress.course ? progress.course.title : "Unknown Course"}
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-4">
                                        Last accessed: {progress.lastAccessed ? new Date(progress.lastAccessed).toLocaleDateString() : "Never"}
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${progress.completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-600'}`} 
                                                style={{ width: `${progress.completionPercentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold w-12 text-right">
                                            {progress.completionPercentage}%
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto shrink-0 flex gap-3">
                                    <Link 
                                        href={`/dashboard/student/lessons?courseId=${progress.course?._id}`}
                                        className="w-full md:w-auto px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium rounded-lg text-center"
                                    >
                                        {progress.completionPercentage === 100 ? "Review" : "Continue"}
                                    </Link>
                                    {progress.completionPercentage === 100 && (
                                        <Link 
                                            href={`/dashboard/student/certificates?courseId=${progress.course?._id}`}
                                            className="w-full md:w-auto px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-lg text-center"
                                        >
                                            Get Certificate
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
