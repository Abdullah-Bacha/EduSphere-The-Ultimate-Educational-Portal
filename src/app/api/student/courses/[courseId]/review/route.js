import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import Testimonial from "@/models/Testimonial";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
    try {
        const student = await requireStudent();
        const { courseId } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return NextResponse.json({ success: false, message: "Invalid course ID" }, { status: 400 });
        }

        await dbConnect();
        const review = await Testimonial.findOne({ student: student._id, course: courseId }).lean();

        if (!review) {
            return NextResponse.json({ success: true, result: null });
        }

        return NextResponse.json({
            success: true,
            result: {
                ...review,
                _id: review._id.toString(),
                student: review.student?.toString(),
                course: review.course?.toString(),
            },
        });
    } catch (error) {
        const status = error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}

export async function POST(request, context) {
    try {
        const student = await requireStudent();
        const { courseId } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return NextResponse.json({ success: false, message: "Invalid course ID" }, { status: 400 });
        }

        const body = await request.json();
        const { content, rating } = body;

        if (!content?.trim()) {
            return NextResponse.json({ success: false, message: "Review content is required" }, { status: 400 });
        }

        const ratingNum = Math.min(5, Math.max(1, Number(rating) || 5));

        await dbConnect();

        // Check if enrolled
        const user = await User.findById(student._id).select("enrolledCourses name").lean();
        const enrolled = user?.enrolledCourses?.some((id) => id.toString() === courseId);
        if (!enrolled) {
            return NextResponse.json({ success: false, message: "You must be enrolled in this course to review it" }, { status: 403 });
        }

        // Upsert — one review per student per course
        const review = await Testimonial.findOneAndUpdate(
            { student: student._id, course: courseId },
            {
                student: student._id,
                course: courseId,
                name: user.name,
                role: "Student",
                content: content.trim(),
                rating: ratingNum,
                isActive: false,
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            success: true,
            result: {
                ...review.toObject(),
                _id: review._id.toString(),
                student: review.student?.toString(),
                course: review.course?.toString(),
            },
            message: "Review submitted for approval.",
        });
    } catch (error) {
        const status = error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}
