import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { ValidationError, handleApiError } from "@/lib/apiError";

export async function POST(request) {
    try {
        const { name, email, password, role = "student" } = await request.json();

        if (!name || !email || !password) {
            throw new ValidationError("Name, email, and password are required");
        }

        if (password.length < 6) {
            throw new ValidationError("Password must be at least 6 characters");
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            status: "Active",
        });

        await user.save();

        // Generate token
        const token = generateToken({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

        // Set cookie
        const response = NextResponse.json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;
    } catch (error) {
        return handleApiError(error);
    }
}
