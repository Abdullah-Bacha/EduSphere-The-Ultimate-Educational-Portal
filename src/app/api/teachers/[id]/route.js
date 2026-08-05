import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

import {
    getTeacherById,
    updateTeacher,
    deleteTeacher,
} from "../../../../services/teacherService";

export async function GET(_, context) {

    try {
        await requireAdmin();

        const { id } = await context.params;

        const teacher = await getTeacherById(id);

        if (!teacher) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Teacher not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            result: teacher,
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

        const teacher = await updateTeacher(
            id,
            body
        );

        if (!teacher) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Teacher not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            result: teacher,
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

        const teacher = await deleteTeacher(id);

        if (!teacher) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Teacher not found",
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
