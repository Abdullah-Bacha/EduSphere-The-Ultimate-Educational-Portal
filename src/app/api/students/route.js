import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

import {
    getStudents,
    createStudent,
} from "@/services/studentService";

export async function GET(request) {
    try {
        try {
            await requireAdmin();
        } catch (err) {
            const status = err.message === "Unauthorized" ? 401 : 403;
            return NextResponse.json({ success: false, message: err.message }, { status });
        }

        const { searchParams } = new URL(request.url);

        const search = searchParams.get("search") || "";

        const students = await getStudents(search);

        return NextResponse.json(
            {
                success: true,
                result: students,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        try {
            await requireAdmin();
        } catch (err) {
            const status = err.message === "Unauthorized" ? 401 : 403;
            return NextResponse.json({ success: false, message: err.message }, { status });
        }

        const body = await request.json();

        const student = await createStudent(body);

        return NextResponse.json(
            {
                success: true,
                message: "Student created successfully",
                result: student,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}