import { NextResponse } from "next/server";
import { getStudentCourses } from "@/services/studentCourseService";
import { requireStudent } from "@/lib/auth";

export async function GET(request) {
    try {
        const student = await requireStudent();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const level = searchParams.get("level") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;

        const data = await getStudentCourses(student.id, {
            search,
            category,
            level,
            page,
            limit,
        });

        return NextResponse.json({
            success: true,
            result: data,
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