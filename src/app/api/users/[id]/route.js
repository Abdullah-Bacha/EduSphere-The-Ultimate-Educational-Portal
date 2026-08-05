import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/auth";

function authErrorStatus(error) {
    if (error.message === "Unauthorized") return 401;
    if (error.message === "Forbidden") return 403;
    return 500;
}

// ======================
// GET USER BY ID
// ======================
export async function GET(request, { params }) {
    try {
        const currentUser = await requireAuth();
        await dbConnect();

        const { id } = await params;

        if (currentUser.role !== "admin" && currentUser.id !== id) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        const user = await User.findById(id).select("-password");

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
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
            { status: authErrorStatus(error) }
        );
    }
}

// ======================
// UPDATE USER
// ======================
export async function PUT(request, { params }) {
    try {
        const currentUser = await requireAuth();
        await dbConnect();

        const { id } = await params;

        if (currentUser.role !== "admin" && currentUser.id !== id) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await request.json();

        // Only admins may change role/status; strip these fields otherwise
        // so a regular user can never self-promote via this endpoint.
        if (currentUser.role !== "admin") {
            delete body.role;
            delete body.status;
        }

        if (body.password) {
            body.password = await bcrypt.hash(body.password, 10);
        } else {
            delete body.password;
        }

        const user = await User.findByIdAndUpdate(
            id,
            body,
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        return NextResponse.json({
            success: true,
            message: "User Updated Successfully",
            result: user,
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: authErrorStatus(error) }
        );
    }
}

// ======================
// DELETE USER
// ======================
export async function DELETE(request, { params }) {
    try {
        const currentUser = await requireAuth();
        await dbConnect();

        if (currentUser.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;

        await User.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "User Deleted Successfully",
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: authErrorStatus(error) }
        );
    }
}