import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import Progress from "@/models/Progress";
import dbConnect from "@/lib/dbConnect";

export async function GET(request, { params }) {
    try {
        const teacher = await requireTeacher();
        await dbConnect();
        const { id } = await params;

        const courseIds = await Course.find({
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        }).distinct("_id");

        const student = await User.findOne({
            _id: id,
            role: "student",
            enrolledCourses: { $in: courseIds },
        }).lean();

        if (!student) {
            return NextResponse.json(
                { success: false, message: "Student not found in your courses" },
                { status: 404 }
            );
        }

        const progressRecords = await Progress.find({
            student: student._id,
            course: { $in: courseIds },
        })
            .populate("course", "title")
            .lean();

        const coursesProgress = progressRecords.map((p) => ({
            courseId: p.course?._id?.toString(),
            courseTitle: p.course?.title || "Untitled Course",
            completionPercentage: p.completionPercentage || 0,
            completedLessonsCount: p.completedLessons?.length || 0,
            lastAccessed: p.lastAccessed,
        }));

        const assignments = await Assignment.find({ course: { $in: courseIds } }).lean();
        const assignmentIds = assignments.map((a) => a._id);

        const submissions = await AssignmentSubmission.find({
            student: student._id,
            assignment: { $in: assignmentIds },
        })
            .populate("assignment", "title dueDate totalMarks course")
            .sort({ createdAt: -1 })
            .lean();

        const submissionList = submissions.map((sub) => ({
            _id: sub._id.toString(),
            assignmentTitle: sub.assignment?.title || "Unknown Assignment",
            status: sub.status,
            marksAwarded: sub.marksAwarded,
            totalMarks: sub.assignment?.totalMarks || 100,
            feedback: sub.feedback || "",
            submittedAt: sub.createdAt,
        }));

        const gradedSubmissions = submissionList.filter((s) => s.marksAwarded != null);
        const assignmentAvg = gradedSubmissions.length > 0
            ? Math.round(
                  gradedSubmissions.reduce((sum, s) => sum + (s.marksAwarded / s.totalMarks) * 100, 0) /
                      gradedSubmissions.length
              )
            : 0;

        const avgCompletion = coursesProgress.length > 0
            ? Math.round(
                  coursesProgress.reduce((sum, c) => sum + c.completionPercentage, 0) / coursesProgress.length
              )
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                student: {
                    _id: student._id.toString(),
                    name: student.name,
                    email: student.email,
                    phone: student.phone || "",
                    gender: student.gender || "",
                    status: student.status || "Active",
                    createdAt: student.createdAt,
                },
                coursesProgress,
                submissions: submissionList,
                stats: {
                    assignmentAvg,
                    avgCompletion,
                    totalSubmissions: submissionList.length,
                    pendingSubmissions: submissionList.filter((s) => s.status === "Submitted").length,
                },
            },
        });
    } catch (error) {
        console.error("Teacher student detail error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to load student details" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
