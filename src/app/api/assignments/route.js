import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import Assignment from "@/models/Assignment";
import dbConnect from "@/lib/dbConnect";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        // Get all courses owned by this teacher
        const courses = await Course.find({
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        })
            .select("_id")
            .lean();

        const courseIds = courses.map((c) => c._id);

        const assignments = await Assignment.find({ course: { $in: courseIds } })
            .sort({ dueDate: 1 })
            .lean();

        const data = assignments.map((a) => ({
            ...a,
            _id: a._id.toString(),
            id: a._id.toString(),
            course: a.course.toString(),
            dueDate: a.dueDate ? a.dueDate.toISOString() : null,
        }));

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
