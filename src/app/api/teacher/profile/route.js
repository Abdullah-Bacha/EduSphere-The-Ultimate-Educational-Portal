import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sanitizeUser } from "@/lib/serializeUser";

export async function GET() {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const user = await User.findById(teacher.id).lean();
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            result: sanitizeUser(user),
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const teacher = await requireTeacher();
        const body = await request.json();

        const { name, phone, gender, dateOfBirth, address, bio, currentPassword, newPassword } = body;

        await dbConnect();

        const user = await User.findById(teacher.id);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { success: false, message: "Current password is required to change password" },
                    { status: 400 }
                );
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json(
                    { success: false, message: "Incorrect current password" },
                    { status: 400 }
                );
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (gender !== undefined) user.gender = gender;
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
        if (address !== undefined) user.address = address;
        if (bio !== undefined) user.bio = bio;

        await user.save();

        return NextResponse.json({
            success: true,
            result: sanitizeUser(user),
            message: "Profile updated successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
