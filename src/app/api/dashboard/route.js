import { NextResponse } from "next/server";
// import { getDashboardStats } from "@/services/dashboardService";
import { getDashboardStats } from "../../../services/dashboardService";
export async function GET() {
    try {
        const stats = await getDashboardStats();

        return NextResponse.json({
            success: true,
            result: stats,
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