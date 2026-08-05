import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAssessmentOverview } from "@/services/oversightService";

export const dynamic = "force-dynamic";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function GET() {
    try {
        await requireAdmin();
        const result = await getAssessmentOverview();
        return NextResponse.json({ success: true, result });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: authErrorStatus(error) }
        );
    }
}
