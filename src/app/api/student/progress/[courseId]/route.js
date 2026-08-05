import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import { getStudentProgress, markLessonComplete } from "@/services/lessonService";

export async function GET(request, context) {
    try {
        const student = await requireStudent();
        
        const params = await context.params;
        const { courseId } = params;

        const progress = await getStudentProgress(student.id, courseId);

        return NextResponse.json({
            success: true,
            result: progress,
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request, context) {
    try {
        const student = await requireStudent();
        
        const params = await context.params;
        const { courseId } = params;

        const body = await request.json();
        const { lessonId } = body;

        if (!lessonId) {
            return NextResponse.json(
                { success: false, message: "Lesson ID is required" },
                { status: 400 }
            );
        }

        const completedLessons = await markLessonComplete(student.id, courseId, lessonId);

        return NextResponse.json({
            success: true,
            result: completedLessons,
            message: "Lesson marked as complete"
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: error.message === "Not enrolled in this course" ? 403 : 500 }
        );
    }
}
