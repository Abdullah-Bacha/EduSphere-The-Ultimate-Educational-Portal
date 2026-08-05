import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import Message from "@/models/Message";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const courseIds = await Course.find({
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        }).distinct("_id");

        const students = await User.find({
            role: "student",
            enrolledCourses: { $in: courseIds },
        })
            .select("name email")
            .lean();

        const studentIds = students.map((s) => s._id);

        const messages = await Message.find({
            $or: [
                { sender: teacher._id, recipient: { $in: studentIds } },
                { recipient: teacher._id, sender: { $in: studentIds } },
            ],
        })
            .sort({ createdAt: -1 })
            .lean();

        const contacts = students.map((student) => {
            const thread = messages.filter(
                (m) =>
                    m.sender.toString() === student._id.toString() ||
                    m.recipient.toString() === student._id.toString()
            );
            const lastMessage = thread[0] || null;
            const unreadCount = thread.filter(
                (m) => m.recipient.toString() === teacher._id.toString() && !m.isRead
            ).length;

            return {
                _id: student._id.toString(),
                name: student.name,
                email: student.email,
                lastMessage: lastMessage
                    ? {
                          content: lastMessage.content,
                          createdAt: lastMessage.createdAt,
                          fromMe: lastMessage.sender.toString() === teacher._id.toString(),
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
        console.error("Teacher messages list error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to load messages" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
