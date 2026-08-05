import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

import {
    getCategories,
    createCategory,
} from "../../../services/categoryService";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

export async function GET(request) {
    try {
        await requireAdmin();
        const search =
            new URL(request.url).searchParams.get("search") || "";

        const categories = await getCategories(search);

        return NextResponse.json({
            success: true,
            result: categories,
        });

    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: authErrorStatus(error),
            }
        );
    }
}

export async function POST(request) {
    try {
        await requireAdmin();
        const body = await request.json();

        const category = await createCategory(body);

        return NextResponse.json({
            success: true,
            result: category,
        });

    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: authErrorStatus(error),
            }
        );
    }
}