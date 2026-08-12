import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getLeaders, createLeader } from "@/services/leaderService";

export const dynamic = "force-dynamic";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function GET() {
    try {
        await requireAdmin();
        const leaders = await getLeaders();
        return NextResponse.json({ success: true, result: leaders });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: authErrorStatus(error) });
    }
}

export async function POST(request) {
    try {
        await requireAdmin();
        const body = await request.json();

        const name = String(body?.name ?? "").trim();
        const title = String(body?.title ?? "").trim();

        if (!name || !title) {
            return NextResponse.json({ success: false, message: "Name and title are required." }, { status: 400 });
        }

        const leader = await createLeader({
            name,
            title,
            quote: String(body?.quote ?? "").trim(),
            image: String(body?.image ?? "").trim(),
            order: Number(body?.order) || 0,
        });

        return NextResponse.json({ success: true, result: leader }, { status: 201 });
    } catch (error) {
        if (error.message === "Unauthorized" || error.message === "Forbidden") {
            return NextResponse.json({ success: false, message: error.message }, { status: authErrorStatus(error) });
        }
        console.error(error);
        return NextResponse.json({ success: false, message: "Unable to create leader." }, { status: 500 });
    }
}
