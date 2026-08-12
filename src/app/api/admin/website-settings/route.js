import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getWebsiteSettings, updateWebsiteSettings } from "@/services/websiteSettingService";
import { validateWebsiteSettingPayload } from "@/validations/websiteSettingValidation";

export const dynamic = "force-dynamic";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function GET() {
    try {
        await requireAdmin();
        const settings = await getWebsiteSettings();
        return NextResponse.json({ success: true, result: settings });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: authErrorStatus(error) });
    }
}

export async function PUT(request) {
    try {
        await requireAdmin();
        const body = await request.json();

        const { valid, errors, payload } = validateWebsiteSettingPayload(body);
        if (!valid) {
            return NextResponse.json({ success: false, message: "Validation failed.", errors }, { status: 400 });
        }

        const settings = await updateWebsiteSettings(payload);
        return NextResponse.json({ success: true, result: settings, message: "Website settings updated." });
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json({ success: false, message: "Request body must be valid JSON." }, { status: 400 });
        }
        if (error.message === "Unauthorized" || error.message === "Forbidden") {
            return NextResponse.json({ success: false, message: error.message }, { status: authErrorStatus(error) });
        }
        console.error(error);
        return NextResponse.json({ success: false, message: "Unable to update website settings." }, { status: 500 });
    }
}
