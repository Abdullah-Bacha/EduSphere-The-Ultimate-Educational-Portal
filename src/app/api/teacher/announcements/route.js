import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import Announcement from "@/models/Announcement";
import dbConnect from "@/lib/dbConnect";
import { notifyUsers } from "@/services/notificationService";

export async function POST(req) {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const { title, content, courseId, category, pin } = await req.json();

        if (!title || !content || !courseId) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify teacher owns this course
        const course = await Course.findOne({
            _id: courseId,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Course not found or unauthorized" },
                { status: 404 }
            );
        }

        const announcement = await Announcement.create({
            course: courseId,
            teacher: teacher._id,
            title,
            content,
            category: category || "general",
            pin: Boolean(pin),
        });

        const students = await User.find({ role: "student", enrolledCourses: courseId })
            .select("_id")
            .lean();

        await notifyUsers(
            students.map((s) => s._id),
            {
                title: `New announcement: ${title}`,
                message: content.slice(0, 120),
                link: "/dashboard/student/notifications",
            }
        );

        return NextResponse.json({
            success: true,
            data: {
                ...announcement.toObject(),
                _id: announcement._id.toString(),
                courseId: announcement.course.toString(),
            },
            message: "Announcement created successfully",
        });
    } catch (error) {
        console.error("Create announcement error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const courseId = req.nextUrl.searchParams.get("courseId");

        const courseIds = await Course.find({
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        }).distinct("_id");

        const query = { course: { $in: courseIds } };
        if (courseId) query.course = courseId;

        const announcements = await Announcement.find(query)
            .populate("course", "title")
            .sort({ pin: -1, createdAt: -1 })
            .lean();

        const serialized = announcements.map((a) => ({
            ...a,
            _id: a._id.toString(),
            courseId: a.course?._id?.toString(),
            courseTitle: a.course?.title || "Unknown Course",
            teacher: a.teacher.toString(),
        }));

        return NextResponse.json({
            success: true,
            data: { announcements: serialized },
        });
    } catch (error) {
        console.error("Get announcements error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Announcement ID required" },
                { status: 400 }
            );
        }

        const deleted = await Announcement.findOneAndDelete({ _id: id, teacher: teacher._id });

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Announcement not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Announcement deleted successfully",
        });
    } catch (error) {
        console.error("Delete announcement error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
