import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function POST(request, context) {
    try {
        const teacher = await requireTeacher();

        const params = await context.params;
        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid Course ID" },
                { status: 400 }
            );
        }

        await dbConnect();

        const course = await Course.findOne({
            _id: id,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        }).lean();

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Course not found or access denied" },
                { status: 404 }
            );
        }

        const duplicate = await Course.create({
            title: `${course.title} (Copy)`,
            description: course.description,
            instructor: course.instructor,
            teacher: course.teacher,
            category: course.category,
            price: course.price,
            thumbnail: course.thumbnail,
            duration: course.duration,
            level: course.level,
            isPublished: false,
            archived: false,
            approvalStatus: course.approvalStatus,
        });

        return NextResponse.json({
            success: true,
            result: {
                ...duplicate.toObject(),
                _id: duplicate._id.toString(),
                id: duplicate._id.toString(),
            },
            message: "Course duplicated successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
