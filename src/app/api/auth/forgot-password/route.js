import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(request) {
    try {
        const body = await request.json();
        const email = String(body?.email ?? "").trim().toLowerCase();

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
        }

        await dbConnect();
        await User.findOne({ email }).select("_id").lean();

        return NextResponse.json({
            success: true,
            message: "If an account exists for that email, you'll receive password reset instructions shortly.",
        });
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json({ success: false, message: "Request body must be valid JSON." }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ success: false, message: "Unable to process request." }, { status: 500 });
    }
}
