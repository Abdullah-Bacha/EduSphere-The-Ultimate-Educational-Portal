import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import { rateLimit } from "@/lib/rateLimiter";
import { handleApiError, ValidationError } from "@/lib/apiError";
import { validateEmail } from "@/validations/commonValidation";

export async function POST(request) {
    try {
        const { email } = await request.json();
        const normalized = (email || "").trim().toLowerCase();

        // Validate email format
        const emailValidation = validateEmail(normalized);
        if (!emailValidation.valid) {
            throw new ValidationError(emailValidation.error);
        }

        // Rate limit newsletter subscriptions (3 attempts per IP per hour)
        const clientIp = request.headers.get("x-forwarded-for") || "unknown";
        const rateLimitCheck = rateLimit(`newsletter-${clientIp}`, 3, 60 * 60 * 1000);
        if (rateLimitCheck.limited) {
            return NextResponse.json(
                { success: false, message: "Too many subscription attempts. Please try again later." },
                { status: 429 }
            );
        }

        await dbConnect();

        const existing = await NewsletterSubscriber.findOne({ email: normalized }).lean();
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
        return handleApiError(error);
    }
}

export const dynamic = "force-dynamic";
