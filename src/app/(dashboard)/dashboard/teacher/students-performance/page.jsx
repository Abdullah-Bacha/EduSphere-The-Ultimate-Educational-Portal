"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import StudentPerformanceDashboard from "@/app/components/teacher/StudentPerformanceDashboard";

export default function StudentPerformancePage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPerformance() {
            try {
                const res = await fetch("/api/teacher/students-performance", {
                    cache: "no-store",
                });

                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                if (data.success) {
                    setStudents(data.data.students);
                }
            } catch (err) {
                console.error("Error loading student performance:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchPerformance();
    }, []);

    if (loading) {
        return (
            <div className="p-6 animate-pulse space-y-6">
                <div className="h-24 bg-slate-200 rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-slate-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                        <BarChart3 className="text-indigo-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900">Student Performance Dashboard</h1>
                        <p className="mt-1 text-slate-600">Monitor and track individual student progress and performance</p>
                    </div>
                </div>
            </div>

            <StudentPerformanceDashboard students={students} />
        </div>
    );
}
