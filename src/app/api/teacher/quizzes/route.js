import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import Quiz from "@/models/Quiz";
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

        const quizzes = await Quiz.find({ course: courseId }).sort({ createdAt: -1 }).lean();
        const serialized = quizzes.map((q) => ({
            ...q,
            _id: q._id.toString(),
            id: q._id.toString(),
            course: q.course.toString(),
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
        const { courseId, title, description, timeLimit, questions } = body;

        if (!courseId || !title || !Array.isArray(questions)) {
            return NextResponse.json(
                { success: false, message: "Course ID, Title, and Questions list are required" },
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

        const quiz = await Quiz.create({
            course: courseId,
            title,
            description: description || "",
            timeLimit: Number(timeLimit) || 15,
            questions,
        });

        if (quiz.isPublished) {
            const User = (await import("@/models/User")).default;
            const { notifyUsers } = await import("@/services/notificationService");
            const students = await User.find({ role: "student", enrolledCourses: courseId })
                .select("_id")
                .lean();

            await notifyUsers(
                students.map((s) => s._id),
                {
                    title: "New quiz available",
                    message: `"${quiz.title}" was added to "${course.title}".`,
                    link: "/dashboard/student/quizzes",
                }
            );
        }

        return NextResponse.json({
            success: true,
            result: {
                ...quiz.toObject(),
                _id: quiz._id.toString(),
                id: quiz._id.toString(),
                course: quiz.course.toString(),
            },
            message: "Quiz created successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
