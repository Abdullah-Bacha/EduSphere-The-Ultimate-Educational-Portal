import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import { getStudentAssignments } from "@/services/assignmentService";

export async function GET() {
    try {
        const student = await requireStudent();
        const assignments = await getStudentAssignments(student.id);

        return NextResponse.json({
            success: true,
            result: assignments,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
