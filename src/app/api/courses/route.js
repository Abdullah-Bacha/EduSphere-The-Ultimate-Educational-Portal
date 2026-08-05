import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/auth";
import { validateCoursePayload } from "@/validations/courseValidation";
import { createCourse, getPublishedCourses } from "@/services/courseService";

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

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const result = await getPublishedCourses({
            search: searchParams.get("search") || "",
            category: searchParams.get("category") || "",
            level: searchParams.get("level") || "",
            page: parseInt(searchParams.get("page")) || 1,
            limit: parseInt(searchParams.get("limit")) || 9,
        });

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error(error);
        return errorResponse("Unable to fetch courses.");
    }
}

export async function POST(request) {
    try {
        await requireRoles(["admin", "teacher"]);

        const body = await request.json();
        const { valid, errors, payload } = validateCoursePayload(body);

        if (!valid) {
            return errorResponse("Validation failed.", 400, errors);
        }

        const result = await createCourse(payload);
        return NextResponse.json({ success: true, result }, { status: 201 });
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

        return errorResponse("Unable to create course.");
    }
}
