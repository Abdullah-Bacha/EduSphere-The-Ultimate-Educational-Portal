import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireAdmin, requireStudent } from "@/lib/auth";
import { enrollCourses } from "@/services/studentService";

export async function PUT(request, { params }) {
    try {
        await dbConnect();

        await requireAdmin();

        const { id } = await params;

        const { courseIds } = await request.json();

        const student = await enrollCourses(id, courseIds);

        return NextResponse.json({
            success: true,
            message: "Courses assigned successfully",
            student,
        });

    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 500,
            }
        );

    }
}

export async function POST(request, { params }) {
    try {
        await dbConnect();

        const student = await requireStudent();
        const { id: courseId } = await params;

        await enrollCourses(student.id, [courseId]);

        return NextResponse.json({
            success: true,
            message: "Enrolled successfully",
        });

    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 500,
            }
        );

    }
}