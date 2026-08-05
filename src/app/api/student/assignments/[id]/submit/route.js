import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import { submitAssignment } from "@/services/assignmentService";

export async function POST(request, context) {
    try {
        const student = await requireStudent();
        
        const params = await context.params;
        const { id } = params; // Assignment ID

        const body = await request.json();

        if (!body.content?.trim() && !body.fileUrl) {
            return NextResponse.json(
                { success: false, message: "Please provide a text answer or upload a file" },
                { status: 400 }
            );
        }

        const submission = await submitAssignment(student.id, id, body.content || "", body.fileUrl || "", body.fileName || "");

        return NextResponse.json({
            success: true,
            result: submission,
            message: "Assignment submitted successfully"
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: error.message.includes("Not enrolled") ? 403 : 500 }
        );
    }
}
