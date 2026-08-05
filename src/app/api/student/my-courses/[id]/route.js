import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(request, context) {
    try {
        const student = await requireStudent();

        const params = await context.params;
        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid Course ID" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Ensure the student is enrolled in this course
        const user = await User.findById(student.id);
        const isEnrolled = user.enrolledCourses.some(
            (courseId) => courseId.toString() === id
        );

        if (!isEnrolled) {
            return NextResponse.json(
                { success: false, message: "You are not enrolled in this course" },
                { status: 403 }
            );
        }

        const course = await Course.findById(id).lean();

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Course not found" },
                { status: 404 }
            );
        }

        // Return course data with plain ID
        return NextResponse.json({
            success: true,
            result: {
                ...course,
                _id: course._id.toString(),
                id: course._id.toString()
            },
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
