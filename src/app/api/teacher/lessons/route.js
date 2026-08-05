import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
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

        // Verify the course belongs to the teacher
        const course = await Course.findOne({
            _id: courseId,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Course not found or access denied" },
                { status: 404 }
            );
        }

        const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 }).lean();
        const serialized = lessons.map((l) => ({
            ...l,
            _id: l._id.toString(),
            id: l._id.toString(),
            course: l.course.toString(),
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
        const { courseId, title, description, videoUrl, content, duration } = body;

        if (!courseId || !title) {
            return NextResponse.json(
                { success: false, message: "Course ID and Title are required" },
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
                { success: false, message: "Course not found or access denied" },
                { status: 404 }
            );
        }

        // Determine next order
        const count = await Lesson.countDocuments({ course: courseId });

        const lesson = await Lesson.create({
            course: courseId,
            title,
            description: description || "",
            videoUrl: videoUrl || "",
            content: content || "",
            duration: duration || "10 mins",
            order: count,
        });

        if (lesson.isPublished) {
            const User = (await import("@/models/User")).default;
            const { notifyUsers } = await import("@/services/notificationService");
            const students = await User.find({ role: "student", enrolledCourses: courseId })
                .select("_id")
                .lean();

            await notifyUsers(
                students.map((s) => s._id),
                {
                    title: "New lesson available",
                    message: `A new lesson "${lesson.title}" was added to "${course.title}".`,
                    link: `/dashboard/student/my-courses/${courseId}`,
                }
            );
        }

        return NextResponse.json({
            success: true,
            result: {
                ...lesson.toObject(),
                _id: lesson._id.toString(),
                id: lesson._id.toString(),
                course: lesson.course.toString(),
            },
            message: "Lesson created successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
