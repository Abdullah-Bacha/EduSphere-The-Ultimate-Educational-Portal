import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import Message from "@/models/Message";
import dbConnect from "@/lib/dbConnect";
import { createNotification } from "@/services/notificationService";
import mongoose from "mongoose";

async function ensureStudentInTeacherCourses(teacher, studentId) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) return null;

    const courseIds = await Course.find({
        $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
    }).distinct("_id");

    return User.findOne({
        _id: studentId,
        role: "student",
        enrolledCourses: { $in: courseIds },
    }).lean();
}

export async function GET(request, context) {
    try {
        const teacher = await requireTeacher();
        const { studentId } = await context.params;

        await dbConnect();

        const student = await ensureStudentInTeacherCourses(teacher, studentId);
        if (!student) {
            return NextResponse.json(
                { success: false, message: "Student not found in your courses" },
                { status: 404 }
            );
        }

        const messages = await Message.find({
            $or: [
                { sender: teacher._id, recipient: studentId },
                { sender: studentId, recipient: teacher._id },
            ],
        })
            .sort({ createdAt: 1 })
            .lean();

        await Message.updateMany(
            { sender: studentId, recipient: teacher._id, isRead: false },
            { isRead: true }
        );

        return NextResponse.json({
            success: true,
            data: {
                student: { _id: student._id.toString(), name: student.name, email: student.email },
                messages: messages.map((m) => ({
                    _id: m._id.toString(),
                    content: m.content,
                    fromMe: m.sender.toString() === teacher._id.toString(),
                    createdAt: m.createdAt,
                })),
            },
        });
    } catch (error) {
        console.error("Teacher message thread error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to load conversation" },
            { status: 500 }
        );
    }
}

export async function POST(request, context) {
    try {
        const teacher = await requireTeacher();
        const { studentId } = await context.params;

        await dbConnect();

        const student = await ensureStudentInTeacherCourses(teacher, studentId);
        if (!student) {
            return NextResponse.json(
                { success: false, message: "Student not found in your courses" },
                { status: 404 }
            );
        }

        const { content } = await request.json();
        if (!content || !content.trim()) {
            return NextResponse.json(
                { success: false, message: "Message content is required" },
                { status: 400 }
            );
        }

        const message = await Message.create({
            sender: teacher._id,
            recipient: studentId,
            content: content.trim(),
        });

        await createNotification({
            userId: studentId,
            title: `New message from ${teacher.name}`,
            message: content.trim().slice(0, 120),
            link: "/dashboard/student/messages",
        });

        return NextResponse.json({
            success: true,
            data: {
                _id: message._id.toString(),
                content: message.content,
                fromMe: true,
                createdAt: message.createdAt,
            },
        });
    } catch (error) {
        console.error("Teacher send message error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to send message" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
