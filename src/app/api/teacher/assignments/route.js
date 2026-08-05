import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import Assignment from "@/models/Assignment";
import dbConnect from "@/lib/dbConnect";

export async function GET(request) {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get("courseId");

        if (!courseId) {
            return NextResponse.json(
                { success: false, message: "Course ID is required" },
                { status: 400 }
            );
        }

        // Verify course ownership
        const course = await Course.findOne({
            _id: courseId,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        const assignments = await Assignment.find({ course: courseId }).sort({ dueDate: 1 }).lean();
        const serialized = assignments.map((a) => ({
            ...a,
            _id: a._id.toString(),
            id: a._id.toString(),
            course: a.course.toString(),
            dueDate: a.dueDate ? a.dueDate.toISOString() : null,
        }));

        return NextResponse.json({
            success: true,
            result: serialized,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const teacher = await requireTeacher();
        const body = await request.json();
        const { courseId, title, description, dueDate, totalMarks } = body;

        if (!courseId || !title || !description || !dueDate) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Verify course ownership
        const course = await Course.findOne({
            _id: courseId,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        const assignment = await Assignment.create({
            course: courseId,
            title,
            description,
            dueDate: new Date(dueDate),
            totalMarks: Number(totalMarks) || 100,
        });

        if (assignment.isPublished) {
            const User = (await import("@/models/User")).default;
            const { notifyUsers } = await import("@/services/notificationService");
            const students = await User.find({ role: "student", enrolledCourses: courseId })
                .select("_id")
                .lean();

            await notifyUsers(
                students.map((s) => s._id),
                {
                    title: "New assignment posted",
                    message: `"${assignment.title}" was added to "${course.title}", due ${new Date(
                        assignment.dueDate
                    ).toLocaleDateString()}.`,
                    link: "/dashboard/student/assignments",
                }
            );
        }

        return NextResponse.json({
            success: true,
            result: {
                ...assignment.toObject(),
                _id: assignment._id.toString(),
                id: assignment._id.toString(),
                course: assignment.course.toString(),
                dueDate: assignment.dueDate.toISOString(),
            },
            message: "Assignment created successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
