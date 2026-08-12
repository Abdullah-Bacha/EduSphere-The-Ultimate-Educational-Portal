import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAllTestimonials, createTestimonial } from "@/services/testimonialService";

export const dynamic = "force-dynamic";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function GET() {
    try {
        await requireAdmin();
        const testimonials = await getAllTestimonials();
        return NextResponse.json({ success: true, result: testimonials });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: authErrorStatus(error) });
    }
}

export async function POST(request) {
    try {
        await requireAdmin();
        const body = await request.json();

        const name = String(body?.name ?? "").trim();
        const message = String(body?.message ?? "").trim();

        if (!name || !message) {
            return NextResponse.json({ success: false, message: "Name and message are required." }, { status: 400 });
        }

        const testimonial = await createTestimonial({
            name,
            role: String(body?.role ?? "Student").trim(),
            message,
            rating: Math.min(5, Math.max(1, Number(body?.rating) || 5)),
            approved: Boolean(body?.approved),
        });

        return NextResponse.json({ success: true, result: testimonial }, { status: 201 });
    } catch (error) {
        if (error.message === "Unauthorized" || error.message === "Forbidden") {
            return NextResponse.json({ success: false, message: error.message }, { status: authErrorStatus(error) });
        }
        console.error(error);
        return NextResponse.json({ success: false, message: "Unable to create testimonial." }, { status: 500 });
    }
}
