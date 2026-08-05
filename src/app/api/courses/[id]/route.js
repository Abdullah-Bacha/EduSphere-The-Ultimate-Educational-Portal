import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/auth";
import { validateCoursePayload } from "@/validations/courseValidation";
import {
    deleteCourse,
    getCourseById,
    updateCourse,
} from "@/services/courseService";

export const dynamic = "force-dynamic";

function errorResponse(message, status = 500, errors) {
    return NextResponse.json(
        {
            success: false,
            message,
            ...(errors ? { errors } : {}),
        },
        { status }
    );
}

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

function invalidIdResponse() {
    return errorResponse("Invalid course ID.", 400);
}

async function getRouteId(context) {
    const params = await context.params;
    return params?.id;
}

export async function GET(request, context) {
    try {
        const id = await getRouteId(context);

        if (!mongoose.isValidObjectId(id)) {
            return invalidIdResponse();
        }

        const course = await getCourseById(id);

        if (!course || !course.isPublished || course.approvalStatus !== "Approved") {
            return errorResponse("Course not found.", 404);
        }

        return NextResponse.json({ success: true, result: course });
    } catch (error) {
        console.error(error);
        return errorResponse("Unable to fetch course.");
    }
}

export async function PUT(request, context) {
    try {
        await requireRoles(["admin", "teacher"]);

        const id = await getRouteId(context);

        if (!mongoose.isValidObjectId(id)) {
            return invalidIdResponse();
        }

        const body = await request.json();
        const { valid, errors, payload } = validateCoursePayload(body);

        if (!valid) {
            return errorResponse("Validation failed.", 400, errors);
        }

        const course = await updateCourse(id, payload);

        if (!course) {
            return errorResponse("Course not found.", 404);
        }

        return NextResponse.json({ success: true, result: course });
    } catch (error) {
        console.error(error);

        if (error.message === "Unauthorized" || error.message === "Forbidden") {
            return errorResponse(error.message, authErrorStatus(error));
        }

        if (error instanceof SyntaxError) {
            return errorResponse("Request body must be valid JSON.", 400);
        }

        if (error.name === "ValidationError") {
            return errorResponse(
                "Validation failed.",
                400,
                Object.values(error.errors).map((item) => item.message)
            );
        }

        return errorResponse("Unable to update course.");
    }
}

export async function DELETE(request, context) {
    try {
        await requireRoles(["admin", "teacher"]);

        const id = await getRouteId(context);

        if (!mongoose.isValidObjectId(id)) {
            return invalidIdResponse();
        }

        const deleted = await deleteCourse(id);

        if (!deleted) {
            return errorResponse("Course not found.", 404);
        }

        return NextResponse.json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
        console.error(error);
        return errorResponse("Unable to delete course.");
    }
}
