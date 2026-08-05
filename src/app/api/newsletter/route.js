import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
    try {
        await dbConnect();

        const { email } = await request.json();
        const normalized = (email || "").trim().toLowerCase();

        if (!EMAIL_REGEX.test(normalized)) {
            return NextResponse.json(
                { success: false, message: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        const existing = await NewsletterSubscriber.findOne({ email: normalized });
        if (existing) {
            return NextResponse.json({
                success: true,
                message: "You're already subscribed!",
            });
        }

        await NewsletterSubscriber.create({ email: normalized });

        return NextResponse.json({
            success: true,
            message: "Thanks for subscribing!",
        });
    } catch (error) {
        console.error("Newsletter subscribe error:", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
