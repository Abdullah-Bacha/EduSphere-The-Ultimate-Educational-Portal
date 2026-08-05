import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { exportCsv } from "@/services/exportService";

export const dynamic = "force-dynamic";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function GET(request) {
    try {
        await requireAdmin();
        const type = new URL(request.url).searchParams.get("type") || "";

        const { filename, csv } = await exportCsv(type);

        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        const status =
            error.message === "Invalid export type."
                ? 400
                : authErrorStatus(error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status }
        );
    }
}
