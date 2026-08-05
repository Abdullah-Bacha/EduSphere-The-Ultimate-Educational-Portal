import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

async function ensureCourseOwnership(teacher, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }
    return Course.findOne({
        _id: id,
        $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
    }).lean();
}

export async function POST(request, context) {
    try {
        const teacher = await requireTeacher();
        const params = await context.params;
        const { id } = params;

        await dbConnect();

        const course = await ensureCourseOwnership(teacher, id);
        if (!course) {
            return NextResponse.json(
                { success: false, message: "Course not found or access denied" },
                { status: 404 }
            );
        }

        const { email } = await request.json();
        if (!email) {
            return NextResponse.json(
                { success: false, message: "Student email is required" },
                { status: 400 }
            );
        }

        const student = await User.findOne({ email: email.toLowerCase().trim(), role: "student" });
        if (!student) {
            return NextResponse.json(
                { success: false, message: "No student found with that email" },
                { status: 404 }
            );
        }

        if (student.enrolledCourses.some((c) => c.toString() === id)) {
            return NextResponse.json(
                { success: false, message: "Student is already enrolled in this course" },
                { status: 400 }
            );
        }

        student.enrolledCourses.push(id);
        await student.save();

        return NextResponse.json({
            success: true,
            message: `${student.name} enrolled successfully`,
            result: {
                _id: student._id.toString(),
                name: student.name,
                email: student.email,
                phone: student.phone || "",
                gender: student.gender || "",
                status: student.status || "Active",
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, context) {
    try {
        const teacher = await requireTeacher();
        const params = await context.params;
        const { id } = params;

        await dbConnect();

        const course = await ensureCourseOwnership(teacher, id);
        if (!course) {
            return NextResponse.json(
                { success: false, message: "Course not found or access denied" },
                { status: 404 }
            );
        }

        const { studentId } = await request.json();
        if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
            return NextResponse.json(
                { success: false, message: "Valid studentId is required" },
                { status: 400 }
            );
        }

        await User.updateOne(
            { _id: studentId, role: "student" },
            { $pull: { enrolledCourses: id } }
        );

        return NextResponse.json({
            success: true,
            message: "Student removed from course",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
