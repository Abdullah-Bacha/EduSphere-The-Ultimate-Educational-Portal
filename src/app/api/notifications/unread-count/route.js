import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import Notification from "@/models/Notification";
import dbConnect from "@/lib/dbConnect";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const user = await requireAuth();
        await dbConnect();
        const count = await Notification.countDocuments({ user: user._id, isRead: false });
        return NextResponse.json({ success: true, result: { count } });
    } catch (error) {
        const status = error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}
