import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import Progress from "@/models/Progress";
import Course from "@/models/Course";
import dbConnect from "@/lib/dbConnect";

export async function GET(request) {
    try {
        const student = await requireStudent();
        await dbConnect();

        // Fetch all progress records for the student, populating course data
        const progressList = await Progress.find({ student: student.id })
            .populate({
                path: "course",
                select: "title thumbnail category duration instructor",
            })
            .lean();

        // Serialize output securely
        const serialized = progressList.map((p) => ({
            ...p,
            _id: p._id.toString(),
            id: p._id.toString(),
            student: p.student.toString(),
            course: p.course
                ? {
                      ...p.course,
                      _id: p.course._id.toString(),
                      id: p.course._id.toString(),
                  }
                : null,
            completedLessons: p.completedLessons.map((id) => id.toString()),
            completedQuizzes: p.completedQuizzes.map((id) => id.toString()),
            lastAccessed: p.lastAccessed ? p.lastAccessed.toISOString() : null,
        }));

        // Compute overall statistics
        const totalEnrolled = serialized.length;
        const totalCompleted = serialized.filter((p) => p.completionPercentage === 100).length;
        const totalIncomplete = totalEnrolled - totalCompleted;

        const averageProgress = totalEnrolled > 0 
            ? Math.round(serialized.reduce((acc, curr) => acc + curr.completionPercentage, 0) / totalEnrolled) 
            : 0;

        return NextResponse.json({
            success: true,
            result: {
                progressList: serialized,
                stats: {
                    totalEnrolled,
                    totalCompleted,
                    totalIncomplete,
                    averageProgress
                }
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
