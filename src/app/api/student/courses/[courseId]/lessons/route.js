import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import { getCourseLessons } from "@/services/lessonService";

export async function GET(request, context) {
    try {
        const student = await requireStudent();
        
        const params = await context.params;
        const { courseId } = params;

        const lessons = await getCourseLessons(student.id, courseId);

        return NextResponse.json({
            success: true,
            result: lessons,
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: error.message === "Not enrolled in this course" ? 403 : 500 }
        );
    }
}
