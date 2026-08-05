import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(request, context) {
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

        // Get enrolled students details
        const students = await User.find({
            role: "student",
            enrolledCourses: id,
        })
            .select("name email phone gender dateOfBirth status")
            .lean();

        const serializedStudents = students.map((s) => ({
            ...s,
            _id: s._id.toString(),
            id: s._id.toString(),
            dateOfBirth: s.dateOfBirth ? s.dateOfBirth.toISOString() : null,
        }));

        return NextResponse.json({
            success: true,
            result: {
                ...course,
                _id: course._id.toString(),
                id: course._id.toString(),
                students: serializedStudents,
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
                { success: false, message: "Invalid Course ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        await dbConnect();

        const course = await Course.findOne({
            _id: id,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Course not found or access denied" },
                { status: 404 }
            );
        }

        // Edit allowed fields — use !== undefined so empty strings can clear optional fields
        if (body.title !== undefined) course.title = body.title;
        if (body.description !== undefined) course.description = body.description;
        if (body.level !== undefined) course.level = body.level;
        if (body.duration !== undefined) course.duration = body.duration;
        if (body.thumbnail !== undefined) course.thumbnail = body.thumbnail;
        if (body.isPublished !== undefined) course.isPublished = Boolean(body.isPublished);
        if (body.archived !== undefined) course.archived = Boolean(body.archived);

        await course.save();

        return NextResponse.json({
            success: true,
            result: {
                ...course.toObject(),
                _id: course._id.toString(),
                id: course._id.toString(),
            },
            message: "Course updated successfully",
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
                { success: false, message: "Invalid Course ID" },
                { status: 400 }
            );
        }

        await dbConnect();

        const course = await Course.findOne({
            _id: id,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Course not found or access denied" },
                { status: 404 }
            );
        }

        const enrolledCount = await User.countDocuments({
            role: "student",
            enrolledCourses: id,
        });

        if (enrolledCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This course has enrolled students. Archive it instead of deleting.",
                },
                { status: 400 }
            );
        }

        await Course.deleteOne({ _id: id });

        return NextResponse.json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
