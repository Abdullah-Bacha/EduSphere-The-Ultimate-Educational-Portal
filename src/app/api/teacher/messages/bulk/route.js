import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import Message from "@/models/Message";
import dbConnect from "@/lib/dbConnect";
import { notifyUsers } from "@/services/notificationService";

export async function POST(request) {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const { courseId, content } = await request.json();

        if (!content || !content.trim()) {
            return NextResponse.json(
                { success: false, message: "Message content is required" },
                { status: 400 }
            );
        }

        const courseQuery = {
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        };
        if (courseId) courseQuery._id = courseId;

        const courseIds = await Course.find(courseQuery).distinct("_id");
        if (courseIds.length === 0) {
            return NextResponse.json(
                { success: false, message: "No matching course found" },
                { status: 404 }
            );
        }

        const students = await User.find({
            role: "student",
            enrolledCourses: { $in: courseIds },
        })
            .select("_id")
            .lean();

        if (students.length === 0) {
            return NextResponse.json(
                { success: false, message: "No students found to message" },
                { status: 404 }
            );
        }

        const trimmed = content.trim();
        const docs = students.map((s) => ({
            sender: teacher._id,
            recipient: s._id,
            content: trimmed,
        }));

        await Message.insertMany(docs);

        await notifyUsers(
            students.map((s) => s._id),
            {
                title: `New message from ${teacher.name}`,
                message: trimmed.slice(0, 120),
                link: "/dashboard/student/messages",
            }
        );

        return NextResponse.json({
            success: true,
            message: `Message sent to ${students.length} student${students.length !== 1 ? "s" : ""}`,
        });
    } catch (error) {
        console.error("Teacher bulk message error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to send bulk message" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
