import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sanitizeUsers, sanitizeUser } from "@/lib/serializeUser";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
    try {

        await dbConnect();

        // Only admins can list users
        await requireAdmin();

        const users = await User.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            result: sanitizeUsers(users),
        });

    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error.message,
        }, {
            status: 500,
        });

    }
}

export async function POST(request) {

    try {

        await dbConnect();

        const body = await request.json();

        const { name, email, password } = body;

        if (!name || !email || !password) {

            return NextResponse.json({
                success: false,
                message: "Name, Email and Password are required",
            }, {
                status: 400,
            });

        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return NextResponse.json({
                success: false,
                message: "Email already exists",
            }, {
                status: 409,
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Public self-registration always creates a student account — role
        // is never trusted from the request body, otherwise anyone could
        // POST { role: "admin" } and grant themselves admin access.
        const user = await User.create({

            name,
            email,
            password: hashedPassword,
            role: "student",

        });

        return NextResponse.json({

            success: true,
            message: "Registration Successful",
            result: sanitizeUser(user),

        }, {
            status: 201,
        });

    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error.message,
        }, {
            status: 500,
        });

    }

}