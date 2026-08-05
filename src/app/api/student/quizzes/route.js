import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import { getStudentQuizzes } from "@/services/quizService";

export async function GET() {
    try {
        const student = await requireStudent();
        const quizzes = await getStudentQuizzes(student.id);

        return NextResponse.json({
            success: true,
            result: quizzes,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
