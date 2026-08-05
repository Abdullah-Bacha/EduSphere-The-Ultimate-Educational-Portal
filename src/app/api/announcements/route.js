import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sendAnnouncement } from "@/services/announcementService";
import Notification from "@/models/Notification";
import dbConnect from "@/lib/dbConnect";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function GET() {
    try {
        await requireAdmin();
        await dbConnect();

        // Get unique announcements by grouping on title+message, take latest createdAt
        const history = await Notification.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: { title: "$title", message: "$message", link: "$link" },
                    sentAt: { $first: "$createdAt" },
                    recipientCount: { $sum: 1 },
                },
            },
            { $sort: { sentAt: -1 } },
            { $limit: 20 },
            {
                $project: {
                    _id: 0,
                    title: "$_id.title",
                    message: "$_id.message",
                    link: "$_id.link",
                    sentAt: 1,
                    recipientCount: 1,
                },
            },
        ]);

        return NextResponse.json({ success: true, result: history });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: authErrorStatus(error) }
        );
    }
}

export async function POST(request) {
    try {
        await requireAdmin();
        const body = await request.json();

        const result = await sendAnnouncement(body);

        return NextResponse.json({
            success: true,
            result,
            message: `Announcement sent to ${result.count} user(s).`,
        });
    } catch (error) {
        const status =
            error.message === "Title and message are required." ||
            error.message === "Invalid audience."
                ? 400
                : authErrorStatus(error);

        return NextResponse.json(
            { success: false, message: error.message },
            { status }
        );
    }
}
