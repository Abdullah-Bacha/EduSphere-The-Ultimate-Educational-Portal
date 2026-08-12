import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updateLeader, deleteLeader } from "@/services/leaderService";

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
        if (body.title !== undefined) payload.title = String(body.title).trim();
        if (body.quote !== undefined) payload.quote = String(body.quote).trim();
        if (body.image !== undefined) payload.image = String(body.image).trim();
        if (body.order !== undefined) payload.order = Number(body.order) || 0;

        const leader = await updateLeader(id, payload);
        if (!leader) {
            return NextResponse.json({ success: false, message: "Leader not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, result: leader });
    } catch (error) {
        if (error.message === "Unauthorized" || error.message === "Forbidden") {
            return NextResponse.json({ success: false, message: error.message }, { status: authErrorStatus(error) });
        }
        console.error(error);
        return NextResponse.json({ success: false, message: "Unable to update leader." }, { status: 500 });
    }
}

export async function DELETE(request, context) {
    try {
        await requireAdmin();
        const { id } = await context.params;
        await deleteLeader(id);
        return NextResponse.json({ success: true, message: "Leader deleted." });
    } catch (error) {
        if (error.message === "Unauthorized" || error.message === "Forbidden") {
            return NextResponse.json({ success: false, message: error.message }, { status: authErrorStatus(error) });
        }
        console.error(error);
        return NextResponse.json({ success: false, message: "Unable to delete leader." }, { status: 500 });
    }
}
