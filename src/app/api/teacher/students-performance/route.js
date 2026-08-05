import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";
import Progress from "@/models/Progress";
import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
    try {
        const teacher = await requireTeacher();
        await dbConnect();
        const courseId = req.nextUrl.searchParams.get("courseId");

        // Fetch teacher's courses
        const query = {
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        };
        if (courseId) query._id = courseId;

        const courses = await Course.find(query).lean();
        const courseIds = courses.map((c) => c._id);

        // Fetch students enrolled in these courses
        const students = await User.find({
            role: "student",
            enrolledCourses: { $in: courseIds },
        }).lean();

        const assignments = await Assignment.find({ course: { $in: courseIds } }).lean();
        const assignmentIds = assignments.map((a) => a._id);
        const assignmentTotalMarks = new Map(assignments.map((a) => [a._id.toString(), a.totalMarks || 100]));

        const quizzes = await Quiz.find({ course: { $in: courseIds } }).lean();
        const quizIds = quizzes.map((q) => q._id);

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

        // Get performance data for each student
        const performanceData = await Promise.all(
            students.map(async (student) => {
                const submissions = await AssignmentSubmission.find({
                    student: student._id,
                    assignment: { $in: assignmentIds },
                    marksAwarded: { $ne: null },
                }).lean();

                const assignmentAvg = submissions.length > 0
                    ? Math.round(
                          submissions.reduce((sum, sub) => {
                              const total = assignmentTotalMarks.get(sub.assignment.toString()) || 100;
                              return sum + (sub.marksAwarded / total) * 100;
                          }, 0) / submissions.length
                      )
                    : 0;

                const quizAttempts = await QuizAttempt.find({
                    student: student._id,
                    quiz: { $in: quizIds },
                }).lean();

                const quizAvg = quizAttempts.length > 0
                    ? Math.round(
                          quizAttempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) /
                              quizAttempts.length
                      )
                    : 0;

                // Real completion score from progress records
                const progressRecords = await Progress.find({
                    student: student._id,
                    course: { $in: courseIds },
                }).lean();

                const completionScore = progressRecords.length > 0
                    ? Math.round(
                          progressRecords.reduce((sum, p) => sum + (p.completionPercentage || 0), 0) /
                              progressRecords.length
                      )
                    : 0;

                // Trend: compare last 30 days avg grade vs the 30 days before that
                const recentSubs = submissions.filter((s) => s.createdAt >= thirtyDaysAgo);
                const priorSubs = submissions.filter(
                    (s) => s.createdAt >= sixtyDaysAgo && s.createdAt < thirtyDaysAgo
                );
                const pct = (subs) =>
                    subs.length > 0
                        ? subs.reduce((sum, s) => sum + (s.marksAwarded / (assignmentTotalMarks.get(s.assignment.toString()) || 100)) * 100, 0) / subs.length
                        : null;
                const recentPct = pct(recentSubs);
                const priorPct = pct(priorSubs);
                const trend = recentPct != null && priorPct != null ? Math.round(recentPct - priorPct) : 0;

                // Alert system
                const alerts = [];
                if (assignmentAvg < 70) alerts.push("Low assignment scores");
                if (quizAvg < 70) alerts.push("Low quiz performance");
                if (completionScore < 60) alerts.push("Low course completion");
                if (submissions.length === 0 && quizAttempts.length === 0) alerts.push("No submissions yet");

                return {
                    id: student._id.toString(),
                    name: student.name,
                    email: student.email,
                    assignmentAvg,
                    quizAvg,
                    completionScore,
                    trend,
                    alerts,
                };
            })
        );

        return NextResponse.json({
            success: true,
            data: {
                students: performanceData,
                totalStudents: performanceData.length,
                courseCount: courseIds.length,
            },
        });
    } catch (error) {
        console.error("Student performance error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
