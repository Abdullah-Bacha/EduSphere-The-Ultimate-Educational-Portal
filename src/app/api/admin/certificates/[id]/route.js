import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { revokeCertificate } from "@/services/adminCertificateService";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function DELETE(_, context) {
    try {
        await requireAdmin();
        const { id } = await context.params;

        const deleted = await revokeCertificate(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Certificate not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: authErrorStatus(error) }
        );
    }
}
