import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import { submitQuiz } from "@/services/quizService";

export async function POST(request, context) {
    try {
        const student = await requireStudent();
        
        const params = await context.params;
        const { id } = params; // Quiz ID

        const body = await request.json();
        
        if (!Array.isArray(body.answers)) {
            return NextResponse.json(
                { success: false, message: "Valid answers array is required" },
                { status: 400 }
            );
        }

        const attempt = await submitQuiz(student.id, id, body.answers);

        return NextResponse.json({
            success: true,
            result: attempt,
            message: "Quiz submitted successfully"
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: error.message.includes("Quiz already attempted") ? 409 : 500 }
        );
    }
}
