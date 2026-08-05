import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAudienceCounts } from "@/services/announcementService";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await requireAdmin();
        const result = await getAudienceCounts();
        return NextResponse.json({ success: true, result });
    } catch (error) {
        const status = error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}
