import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import { 
    getStudentNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
} from "@/services/notificationService";

export async function GET() {
    try {
        const student = await requireStudent();
        const notifications = await getStudentNotifications(student.id);

        return NextResponse.json({
            success: true,
            result: notifications,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const student = await requireStudent();
        const body = await request.json();
        const { notificationId, markAll } = body;

        if (markAll) {
            const res = await markAllNotificationsAsRead(student.id);
            return NextResponse.json({
                success: true,
                result: res,
                message: "All notifications marked as read",
            });
        }

        if (!notificationId) {
            return NextResponse.json(
                { success: false, message: "Notification ID is required" },
                { status: 400 }
            );
        }

        const notification = await markNotificationAsRead(student.id, notificationId);

        return NextResponse.json({
            success: true,
            result: notification,
            message: "Notification marked as read",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
