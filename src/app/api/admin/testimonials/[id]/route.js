import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updateTestimonial, deleteTestimonial } from "@/services/testimonialService";

export const dynamic = "force-dynamic";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function PUT(request, context) {
    try {
        await requireAdmin();
        const { id } = await context.params;
        const body = await request.json();

        const payload = {};
        if (body.name !== undefined) payload.name = String(body.name).trim();
        if (body.role !== undefined) payload.role = String(body.role).trim();
        if (body.message !== undefined) payload.message = String(body.message).trim();
        if (body.rating !== undefined) payload.rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
        if (body.approved !== undefined) payload.approved = Boolean(body.approved);

        const testimonial = await updateTestimonial(id, payload);
        if (!testimonial) {
            return NextResponse.json({ success: false, message: "Testimonial not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, result: testimonial });
    } catch (error) {
        if (error.message === "Unauthorized" || error.message === "Forbidden") {
            return NextResponse.json({ success: false, message: error.message }, { status: authErrorStatus(error) });
        }
        console.error(error);
        return NextResponse.json({ success: false, message: "Unable to update testimonial." }, { status: 500 });
    }
}

export async function DELETE(request, context) {
    try {
        await requireAdmin();
        const { id } = await context.params;
        await deleteTestimonial(id);
        return NextResponse.json({ success: true, message: "Testimonial deleted." });
    } catch (error) {
        if (error.message === "Unauthorized" || error.message === "Forbidden") {
            return NextResponse.json({ success: false, message: error.message }, { status: authErrorStatus(error) });
        }
        console.error(error);
        return NextResponse.json({ success: false, message: "Unable to delete testimonial." }, { status: 500 });
    }
}
