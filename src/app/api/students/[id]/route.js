import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

import {
    getStudentById,
    updateStudent,
    deleteStudent,
} from "../../../../services/studentService";

export async function GET(_, context) {

    try {
        await requireAdmin();

        const { id } = await context.params;

        const student = await getStudentById(id);

        if (!student) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            result: student,
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

        const student = await updateStudent(
            id,
            body
        );

        if (!student) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            result: student,
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

        const student = await deleteStudent(id);

        if (!student) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student not found",
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
