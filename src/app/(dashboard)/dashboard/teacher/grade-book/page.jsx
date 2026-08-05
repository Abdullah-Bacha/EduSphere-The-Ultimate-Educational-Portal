"use client";

import { useEffect, useState } from "react";
import { BookMarked } from "lucide-react";
import GradeBook from "@/app/components/teacher/GradeBook";

export default function GradeBookPage() {
    const [assignments, setAssignments] = useState([]);
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchGrades() {
        const gradeRes = await fetch("/api/teacher/grades", { cache: "no-store" });
        const gradeData = await gradeRes.json();
        if (gradeData.success) {
            const formattedGrades = gradeData.data.submissions.map(sub => ({
                _id: sub._id,
                studentId: sub.student?.id || sub.student?._id || sub.studentId,
                assignmentId: sub.assignment?.id || sub.assignment?._id || sub.assignmentId,
                grade: sub.marksAwarded ?? 0,
                status: sub.status,
            }));
            setGrades(formattedGrades);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const [assignRes, studentRes] = await Promise.all([
                    fetch("/api/assignments", { cache: "no-store" }),
                    fetch("/api/teacher/students-performance", { cache: "no-store" }),
                ]);

                const assignData = await assignRes.json();
                const studentData = await studentRes.json();

                if (assignData.success) setAssignments(assignData.data || []);
                if (studentData.success) setStudents(studentData.data.students || []);

                await fetchGrades();
            } catch (err) {
                console.error("Error fetching grade book data:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
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
                <div className="h-96 bg-slate-200 rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                        <BookMarked className="text-indigo-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900">Grade Book</h1>
                        <p className="mt-1 text-slate-600">Manage and track student grades for all assignments</p>
                    </div>
                </div>
            </div>

            <GradeBook
                assignments={assignments}
                students={students}
                grades={grades}
                onGraded={fetchGrades}
            />
        </div>
    );
}
