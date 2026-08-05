import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { bulkStudentAction } from "@/services/studentService";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function POST(request) {
    try {
        await requireAdmin();
        const body = await request.json();

        const result = await bulkStudentAction(body.ids, body.action);

        return NextResponse.json({
            success: true,
            result,
            message: `${result.modified} student(s) updated.`,
        });
    } catch (error) {
        const status =
            error.message === "Invalid action" ? 400 : authErrorStatus(error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status }
        );
    }
}
