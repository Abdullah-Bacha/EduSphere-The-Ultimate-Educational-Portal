import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
    getAllCertificates,
    getCertificateStats,
} from "@/services/adminCertificateService";

export const dynamic = "force-dynamic";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function GET(request) {
    try {
        await requireAdmin();
        const search = new URL(request.url).searchParams.get("search") || "";

        const [certificates, stats] = await Promise.all([
            getAllCertificates(search),
            getCertificateStats(),
        ]);

        return NextResponse.json({
            success: true,
            result: { certificates, stats },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: authErrorStatus(error) }
        );
    }
}
