import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import Message from "@/models/Message";
import dbConnect from "@/lib/dbConnect";
import { createNotification } from "@/services/notificationService";
import mongoose from "mongoose";

async function ensureTeacherTeachesStudent(student, teacherId) {
    if (!mongoose.Types.ObjectId.isValid(teacherId)) return null;

    const courses = await Course.find({ _id: { $in: student.enrolledCourses || [] } }).lean();
    const teacherIds = courses.map((c) => c.teacher?.toString()).filter(Boolean);

    if (!teacherIds.includes(teacherId)) return null;

    return User.findOne({ _id: teacherId, role: "teacher" }).select("name email").lean();
}

export async function GET(request, context) {
    try {
        const student = await requireStudent();
        const { teacherId } = await context.params;

        await dbConnect();

        const teacher = await ensureTeacherTeachesStudent(student, teacherId);
        if (!teacher) {
            return NextResponse.json(
                { success: false, message: "Teacher not found for your courses" },
                { status: 404 }
            );
        }

        const messages = await Message.find({
            $or: [
                { sender: student._id, recipient: teacherId },
                { sender: teacherId, recipient: student._id },
            ],
        })
            .sort({ createdAt: 1 })
            .lean();

        await Message.updateMany(
            { sender: teacherId, recipient: student._id, isRead: false },
            { isRead: true }
        );

        return NextResponse.json({
            success: true,
            data: {
                teacher: { _id: teacher._id.toString(), name: teacher.name, email: teacher.email },
                messages: messages.map((m) => ({
                    _id: m._id.toString(),
                    content: m.content,
                    fromMe: m.sender.toString() === student._id.toString(),
                    createdAt: m.createdAt,
                })),
            },
        });
    } catch (error) {
        console.error("Student message thread error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to load conversation" },
            { status: 500 }
        );
    }
}

export async function POST(request, context) {
    try {
        const student = await requireStudent();
        const { teacherId } = await context.params;

        await dbConnect();

        const teacher = await ensureTeacherTeachesStudent(student, teacherId);
        if (!teacher) {
            return NextResponse.json(
                { success: false, message: "Teacher not found for your courses" },
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
            sender: student._id,
            recipient: teacherId,
            content: content.trim(),
        });

        await createNotification({
            userId: teacherId,
            title: `New message from ${student.name}`,
            message: content.trim().slice(0, 120),
            link: "/dashboard/teacher/messages",
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
        console.error("Student send message error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to send message" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
