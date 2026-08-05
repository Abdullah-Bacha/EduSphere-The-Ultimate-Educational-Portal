import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { setCourseApproval } from "@/services/courseApprovalService";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function PATCH(request, context) {
    try {
        await requireAdmin();
        const { id } = await context.params;
        const body = await request.json();

        const updated = await setCourseApproval(id, body.status);

        if (!updated) {
            return NextResponse.json(
                { success: false, message: "Course not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, result: updated });
    } catch (error) {
        const status =
            error.message === "Invalid status value." ? 400 : authErrorStatus(error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status }
        );
    }
}
