import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getCourseEnrollment, setCourseEnrollment } from "@/services/courseService";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function GET(request, context) {
    try {
        await requireAdmin();

        const { id } = await context.params;
        const result = await getCourseEnrollment(id);

        if (!result) {
            return NextResponse.json(
                { success: false, message: "Course not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, result });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: authErrorStatus(error) }
        );
    }
}

export async function PUT(request, context) {
    try {
        await requireAdmin();

        const { id } = await context.params;
        const { studentIds } = await request.json();

        const result = await setCourseEnrollment(id, studentIds);

        return NextResponse.json({
            success: true,
            message: "Enrollment updated successfully.",
            result,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: authErrorStatus(error) }
        );
    }
}
