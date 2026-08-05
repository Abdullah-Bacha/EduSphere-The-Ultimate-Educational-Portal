import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

import {
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "../../../../services/categoryService";

export async function GET(_, context) {
    try {
        await requireAdmin();
        const { id } = await context.params;
        const category = await getCategoryById(id);

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Category not found",
                },
                { status: 404 }
            );
        }

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
            { status: 500 }
        );
    }
}

export async function PUT(request, context) {
    try {
        await requireAdmin();
        const { id } = await context.params;
        const body = await request.json();

        const category = await updateCategory(id, body);

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Category not found",
                },
                { status: 404 }
            );
        }

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
            { status: 500 }
        );
    }
}

export async function DELETE(_, context) {
    try {
        await requireAdmin();
        const { id } = await context.params;

        const deleted = await deleteCategory(id);

        if (!deleted) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Category not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
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
