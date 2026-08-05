import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

import {
    getTeachers,
    createTeacher,
} from "../../../services/teacherService";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function GET(request) {
    try {
        await requireAdmin();
        const search =
            new URL(request.url).searchParams.get("search") || "";

        const teachers = await getTeachers(search);

        return NextResponse.json({
            success: true,
            result: teachers,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: authErrorStatus(error) }
        );
    }
}

export async function POST(request) {
    try {
        await requireAdmin();
        const body = await request.json();

        const teacher = await createTeacher(body);

        return NextResponse.json(
            {
                success: true,
                message: "Teacher created successfully",
                result: teacher,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: authErrorStatus(error) }
        );
    }
}
