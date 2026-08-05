import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
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
                { success: false, message: "Invalid Assignment ID" },
                { status: 400 }
            );
        }

        await dbConnect();

        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return NextResponse.json(
                { success: false, message: "Assignment not found" },
                { status: 404 }
            );
        }

        // Verify ownership
        const course = await Course.findOne({
            _id: assignment.course,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        // Get submissions with student details
        const submissions = await AssignmentSubmission.find({ assignment: id })
            .populate({
                path: "student",
                select: "name email",
            })
            .lean();

        const serializedSubmissions = submissions.map((s) => ({
            ...s,
            _id: s._id.toString(),
            id: s._id.toString(),
            assignment: s.assignment.toString(),
            student: s.student
                ? {
                      ...s.student,
                      _id: s.student._id.toString(),
                      id: s.student._id.toString(),
                  }
                : null,
            createdAt: s.createdAt ? s.createdAt.toISOString() : null,
            updatedAt: s.updatedAt ? s.updatedAt.toISOString() : null,
        }));

        // Get all enrolled students for this course
        const enrolledStudents = await User.find({
            role: "student",
            enrolledCourses: assignment.course,
        }).select("_id name email").lean();

        const serializedEnrolled = enrolledStudents.map((s) => ({
            _id: s._id.toString(),
            id: s._id.toString(),
            name: s.name,
            email: s.email,
        }));

        return NextResponse.json({
            success: true,
            result: {
                ...assignment.toObject(),
                _id: assignment._id.toString(),
                id: assignment._id.toString(),
                course: assignment.course.toString(),
                dueDate: assignment.dueDate ? assignment.dueDate.toISOString() : null,
                submissions: serializedSubmissions,
                enrolledStudents: serializedEnrolled,
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
                { success: false, message: "Invalid ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        await dbConnect();

        // 1. Submissions grading check
        if (body.submissionId) {
            const submission = await AssignmentSubmission.findById(body.submissionId)
                .populate("assignment");
            if (!submission) {
                return NextResponse.json(
                    { success: false, message: "Submission not found" },
                    { status: 404 }
                );
            }

            // Verify course ownership
            const course = await Course.findOne({
                _id: submission.assignment.course,
                $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
            });

            if (!course) {
                return NextResponse.json(
                    { success: false, message: "Access denied" },
                    { status: 403 }
                );
            }

            submission.marksAwarded = Number(body.marksAwarded);
            submission.feedback = body.feedback || "";
            submission.status = "Graded";
            await submission.save();

            const { recalculateProgress } = await import("@/services/progressService");
            await recalculateProgress(submission.student, submission.assignment.course);

            const { notifyUsers } = await import("@/services/notificationService");
            await notifyUsers([submission.student], {
                title: "Assignment reviewed",
                message: `Your submission for "${submission.assignment.title}" was graded: ${submission.marksAwarded}/${submission.assignment.totalMarks}.`,
                link: "/dashboard/student/assignments",
            });

            // Send email notification
            const { sendEmail, gradeNotificationEmail } = await import("@/services/emailService");
            const studentUser = await (await import("@/models/User")).default.findById(submission.student).select("name email").lean();
            if (studentUser?.email) {
                const emailTpl = gradeNotificationEmail({
                    studentName: studentUser.name,
                    assignmentTitle: submission.assignment.title,
                    marksAwarded: submission.marksAwarded,
                    totalMarks: submission.assignment.totalMarks,
                    feedback: submission.feedback,
                });
                sendEmail({ to: studentUser.email, ...emailTpl });
            }

            return NextResponse.json({
                success: true,
                result: {
                    ...submission.toObject(),
                    _id: submission._id.toString(),
                    id: submission._id.toString(),
                },
                message: "Submission graded successfully",
            });
        }

        // 2. Standard assignment details update
        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return NextResponse.json(
                { success: false, message: "Assignment not found" },
                { status: 404 }
            );
        }

        const course = await Course.findOne({
            _id: assignment.course,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        if (body.title) assignment.title = body.title;
        if (body.description) assignment.description = body.description;
        if (body.dueDate) assignment.dueDate = new Date(body.dueDate);
        if (body.totalMarks !== undefined) assignment.totalMarks = Number(body.totalMarks);

        await assignment.save();

        return NextResponse.json({
            success: true,
            result: {
                ...assignment.toObject(),
                _id: assignment._id.toString(),
                id: assignment._id.toString(),
            },
            message: "Assignment updated successfully",
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
                { success: false, message: "Invalid ID" },
                { status: 400 }
            );
        }

        await dbConnect();

        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return NextResponse.json(
                { success: false, message: "Assignment not found" },
                { status: 404 }
            );
        }

        const course = await Course.findOne({
            _id: assignment.course,
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }

        await Assignment.findByIdAndDelete(id);
        // Also delete submissions
        await AssignmentSubmission.deleteMany({ assignment: id });

        return NextResponse.json({
            success: true,
            message: "Assignment deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
