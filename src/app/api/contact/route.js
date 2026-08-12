import { NextResponse } from "next/server";
import { createContactMessage } from "@/services/contactMessageService";

export const dynamic = "force-dynamic";

function errorResponse(message, status = 500, errors) {
    return NextResponse.json(
        {
            success: false,
            message,
            ...(errors ? { errors } : {}),
        },
        { status }
    );
}

export async function POST(request) {
    try {
        const body = await request.json();

        const name = String(body?.name ?? "").trim();
        const email = String(body?.email ?? "").trim();
        const subject = String(body?.subject ?? "").trim() || "General Inquiry";
        const message = String(body?.message ?? "").trim();

        const errors = [];
        if (!name) errors.push("Name is required.");
        if (!email) errors.push("Email is required.");
        if (!message) errors.push("Message is required.");

        if (errors.length > 0) {
            return errorResponse("Validation failed.", 400, errors);
        }

        const result = await createContactMessage({ name, email, subject, message });

        return NextResponse.json(
            { success: true, message: "Message sent successfully.", result },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);

        if (error instanceof SyntaxError) {
            return errorResponse("Request body must be valid JSON.", 400);
        }

        if (error.name === "ValidationError") {
            return errorResponse(
                "Validation failed.",
                400,
                Object.values(error.errors).map((item) => item.message)
            );
        }

        return errorResponse("Unable to send message.");
    }
}
