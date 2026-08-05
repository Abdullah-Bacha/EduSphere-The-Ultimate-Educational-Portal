import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Course from "@/models/Course";

export async function GET(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        // Get teacher details - check both by ID and name
        let teacher = await User.findById(id).lean();

        if (!teacher) {
            return NextResponse.json(
                { success: false, message: "Teacher not found" },
                { status: 404 }
            );
        }

        // Get teacher's courses by teacher ID or instructor name
        const courses = await Course.find({
            $or: [
                { teacher: id },
                { instructor: teacher.name }
            ]
        }).select("title description category price thumbnail level duration instructor teacher _id isPublished").lean();

        return NextResponse.json({
            success: true,
            result: {
                _id: teacher._id?.toString() || id,
                name: teacher.name || "Unknown",
                email: teacher.email || "",
                phone: teacher.phone || "",
                address: teacher.address || "",
                bio: teacher.bio || "",
                image: teacher.image || "",
                gender: teacher.gender || "",
                dateOfBirth: teacher.dateOfBirth || null,
                status: teacher.status || "Active",
                isFeatured: teacher.isFeatured || false,
                role: teacher.role || "teacher",
                courseCount: courses.length,
            },
            courses: courses.map(c => ({
                _id: c._id?.toString() || "",
                title: c.title,
                description: c.description,
                category: c.category,
                price: c.price,
                thumbnail: c.thumbnail,
                level: c.level,
                duration: c.duration,
                instructor: c.instructor,
                isPublished: c.isPublished,
            })),
        });

    } catch (error) {
        console.error("Teacher profile error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
