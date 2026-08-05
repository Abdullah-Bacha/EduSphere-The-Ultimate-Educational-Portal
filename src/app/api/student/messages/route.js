import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import Message from "@/models/Message";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
    try {
        const student = await requireStudent();
        await dbConnect();

        const courses = await Course.find({ _id: { $in: student.enrolledCourses || [] } }).lean();
        const teacherIds = [...new Set(courses.map((c) => c.teacher?.toString()).filter(Boolean))];

        const teachers = await User.find({
            _id: { $in: teacherIds },
            role: "teacher",
        })
            .select("name email")
            .lean();

        const messages = await Message.find({
            $or: [
                { sender: student._id, recipient: { $in: teacherIds } },
                { recipient: student._id, sender: { $in: teacherIds } },
            ],
        })
            .sort({ createdAt: -1 })
            .lean();

        const contacts = teachers.map((teacher) => {
            const thread = messages.filter(
                (m) =>
                    m.sender.toString() === teacher._id.toString() ||
                    m.recipient.toString() === teacher._id.toString()
            );
            const lastMessage = thread[0] || null;
            const unreadCount = thread.filter(
                (m) => m.recipient.toString() === student._id.toString() && !m.isRead
            ).length;

            return {
                _id: teacher._id.toString(),
                name: teacher.name,
                email: teacher.email,
                lastMessage: lastMessage
                    ? {
                          content: lastMessage.content,
                          createdAt: lastMessage.createdAt,
                          fromMe: lastMessage.sender.toString() === student._id.toString(),
                      }
                    : null,
                unreadCount,
            };
        });

        contacts.sort((a, b) => {
            if (!a.lastMessage && !b.lastMessage) return a.name.localeCompare(b.name);
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });

        return NextResponse.json({ success: true, data: { contacts } });
    } catch (error) {
        console.error("Student messages list error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to load messages" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
