import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import Assignment from "@/models/Assignment";
import dbConnect from "@/lib/dbConnect";
import { handleApiError } from "@/lib/apiError";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 20;
        const skip = (page - 1) * limit;

        // Get all courses owned by this teacher
        const courses = await Course.find({
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        })
            .select("_id")
            .lean();

        const courseIds = courses.map((c) => c._id);

        const [assignments, total] = await Promise.all([
            Assignment.find({ course: { $in: courseIds } })
                .sort({ dueDate: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Assignment.countDocuments({ course: { $in: courseIds } }),
        ]);

        const data = assignments.map((a) => ({
            ...a,
            _id: a._id.toString(),
            id: a._id.toString(),
            course: a.course.toString(),
            dueDate: a.dueDate ? a.dueDate.toISOString() : null,
        }));

        return NextResponse.json({
            success: true,
            result: {
                data,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return handleApiError(error);
    }
}
