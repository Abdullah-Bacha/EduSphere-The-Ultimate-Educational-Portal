import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
    try {
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated",
                },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            result: user,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}
