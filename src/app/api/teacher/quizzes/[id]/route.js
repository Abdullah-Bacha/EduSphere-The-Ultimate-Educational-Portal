import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(request, context) {
    try {
        const teacher = await requireTeacher();
        
        const params = await context.params;
        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid Quiz ID" },
                { status: 400 }
            );
        }

        await dbConnect();

        const quiz = await Quiz.findById(id).lean();
        if (!quiz) {
            return NextResponse.json(
                { success: false, message: "Quiz not found" },
                { status: 404 }
            );
        }

        // Verify ownership
        const course = await Course.findOne({
            _id: quiz.course,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        // Get attempts
        const attempts = await QuizAttempt.find({ quiz: id })
            .populate({
                path: "student",
                select: "name email",
            })
            .lean();

        const serializedAttempts = attempts.map((a) => ({
            ...a,
            _id: a._id.toString(),
            id: a._id.toString(),
            quiz: a.quiz.toString(),
            student: a.student
                ? {
                      ...a.student,
                      _id: a.student._id.toString(),
                      id: a.student._id.toString(),
                  }
                : null,
            createdAt: a.createdAt ? a.createdAt.toISOString() : null,
        }));

        return NextResponse.json({
            success: true,
            result: {
                ...quiz,
                _id: quiz._id.toString(),
                id: quiz._id.toString(),
                course: quiz.course.toString(),
                attempts: serializedAttempts,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request, context) {
    try {
        const teacher = await requireTeacher();
        
        const params = await context.params;
        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid Quiz ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        await dbConnect();

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return NextResponse.json(
                { success: false, message: "Quiz not found" },
                { status: 404 }
            );
        }

        const course = await Course.findOne({
            _id: quiz.course,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        if (body.title) quiz.title = body.title;
        if (body.description !== undefined) quiz.description = body.description;
        if (body.timeLimit) quiz.timeLimit = Number(body.timeLimit);
        if (Array.isArray(body.questions)) quiz.questions = body.questions;
        if (body.isPublished !== undefined) quiz.isPublished = Boolean(body.isPublished);

        await quiz.save();

        return NextResponse.json({
            success: true,
            result: {
                ...quiz.toObject(),
                _id: quiz._id.toString(),
                id: quiz._id.toString(),
            },
            message: "Quiz updated successfully",
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
                { success: false, message: "Invalid Quiz ID" },
                { status: 400 }
            );
        }

        await dbConnect();

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return NextResponse.json(
                { success: false, message: "Quiz not found" },
                { status: 404 }
            );
        }

        const course = await Course.findOne({
            _id: quiz.course,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        await Quiz.findByIdAndDelete(id);
        await QuizAttempt.deleteMany({ quiz: id });

        return NextResponse.json({
            success: true,
            message: "Quiz deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
