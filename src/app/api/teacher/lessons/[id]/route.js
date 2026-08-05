import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function PUT(request, context) {
    try {
        const teacher = await requireTeacher();
        
        const params = await context.params;
        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid Lesson ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        await dbConnect();

        const lesson = await Lesson.findById(id);
        if (!lesson) {
            return NextResponse.json(
                { success: false, message: "Lesson not found" },
                { status: 404 }
            );
        }

        // Verify the lesson's course is taught by this teacher
        const course = await Course.findOne({
            _id: lesson.course,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        if (body.title) lesson.title = body.title;
        if (body.description !== undefined) lesson.description = body.description;
        if (body.videoUrl !== undefined) lesson.videoUrl = body.videoUrl;
        if (body.content !== undefined) lesson.content = body.content;
        if (body.duration) lesson.duration = body.duration;
        if (body.order !== undefined) lesson.order = Number(body.order);

        await lesson.save();

        return NextResponse.json({
            success: true,
            result: {
                ...lesson.toObject(),
                _id: lesson._id.toString(),
                id: lesson._id.toString(),
                course: lesson.course.toString(),
            },
            message: "Lesson updated successfully",
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid Lesson ID" },
                { status: 400 }
            );
        }

        await dbConnect();

        const lesson = await Lesson.findById(id);
        if (!lesson) {
            return NextResponse.json(
                { success: false, message: "Lesson not found" },
                { status: 404 }
            );
        }

        // Verify course ownership
        const course = await Course.findOne({
            _id: lesson.course,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        await Lesson.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Lesson deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
