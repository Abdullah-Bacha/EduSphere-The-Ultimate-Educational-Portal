import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import {
    getStudentNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "@/services/notificationService";

export async function GET() {
    try {
        const teacher = await requireTeacher();
        const notifications = await getStudentNotifications(teacher.id);

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
        const teacher = await requireTeacher();
        const body = await request.json();
        const { notificationId, markAll } = body;

        if (markAll) {
            const res = await markAllNotificationsAsRead(teacher.id);
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

        const notification = await markNotificationAsRead(teacher.id, notificationId);

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

export async function DELETE(request) {
    try {
        const teacher = await requireTeacher();
        const { notificationId } = await request.json();

        if (!notificationId) {
            return NextResponse.json(
                { success: false, message: "Notification ID is required" },
                { status: 400 }
            );
        }

        const result = await deleteNotification(teacher.id, notificationId);

        return NextResponse.json({
            success: true,
            result,
            message: "Notification deleted",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
