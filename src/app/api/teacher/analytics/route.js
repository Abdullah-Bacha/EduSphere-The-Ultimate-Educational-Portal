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

export async function GET() {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const courses = await Course.find({
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
            archived: { $ne: true },
        }).lean();
        const courseIds = courses.map((c) => c._id);

        if (courseIds.length === 0) {
            return NextResponse.json({
                success: true,
                data: {
                    gradeDistribution: [],
                    courseCompletion: [],
                    submissionTrend: [],
                    quizPerformance: [],
                    totals: { totalStudents: 0, totalCourses: 0, avgGrade: 0, avgCompletion: 0 },
                },
            });
        }

        const assignments = await Assignment.find({ course: { $in: courseIds } }).lean();
        const assignmentIds = assignments.map((a) => a._id);
        const assignmentCourseMap = new Map(assignments.map((a) => [a._id.toString(), a.course.toString()]));

        // 1. Grade distribution across graded assignment submissions
        const gradedSubmissions = await AssignmentSubmission.find({
            assignment: { $in: assignmentIds },
            marksAwarded: { $ne: null },
        }).lean();

        const buckets = [
            { range: "0-59", min: 0, max: 59, count: 0 },
            { range: "60-69", min: 60, max: 69, count: 0 },
            { range: "70-79", min: 70, max: 79, count: 0 },
            { range: "80-89", min: 80, max: 89, count: 0 },
            { range: "90-100", min: 90, max: 100, count: 0 },
        ];

        let totalPct = 0;
        gradedSubmissions.forEach((sub) => {
            const assignment = assignments.find((a) => a._id.toString() === sub.assignment.toString());
            const totalMarks = assignment?.totalMarks || 100;
            const pct = Math.min(100, Math.round((sub.marksAwarded / totalMarks) * 100));
            totalPct += pct;
            const bucket = buckets.find((b) => pct >= b.min && pct <= b.max) || buckets[buckets.length - 1];
            bucket.count += 1;
        });
        const avgGrade = gradedSubmissions.length > 0 ? Math.round(totalPct / gradedSubmissions.length) : 0;

        // 2. Course completion comparison (use aggregation to avoid N+1)
        const progressStats = await Progress.aggregate([
            { $match: { course: { $in: courseIds } } },
            { $group: {
                _id: "$course",
                avgCompletion: { $avg: "$completionPercentage" },
            }},
        ]);

        const enrollmentStats = await User.aggregate([
            { $match: { role: "student" } },
            { $unwind: "$enrolledCourses" },
            { $match: { enrolledCourses: { $in: courseIds } } },
            { $group: { _id: "$enrolledCourses", studentCount: { $sum: 1 } } },
        ]);

        const progressMap = new Map(
            progressStats.map((p) => [p._id.toString(), Math.round(p.avgCompletion || 0)])
        );
        const enrollmentMap = new Map(enrollmentStats.map((e) => [e._id.toString(), e.studentCount]));

        const courseCompletion = courses.map((course) => {
            const courseIdStr = course._id.toString();
            return {
                courseId: courseIdStr,
                title: course.title,
                completion: progressMap.get(courseIdStr) || 0,
                studentCount: enrollmentMap.get(courseIdStr) || 0,
            };
        });

        // 3. Submission trend over the last 8 weeks
        const now = new Date();
        const weeks = Array.from({ length: 8 }, (_, i) => {
            const start = new Date(now);
            start.setDate(start.getDate() - (7 - i) * 7);
            return start;
        });

        const allSubmissions = await AssignmentSubmission.find({
            assignment: { $in: assignmentIds },
        })
            .select("createdAt")
            .lean();

        const submissionTrend = weeks.map((weekStart, idx) => {
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);
            const count = allSubmissions.filter(
                (s) => s.createdAt >= weekStart && s.createdAt < weekEnd
            ).length;
            return {
                week: `Wk ${idx + 1}`,
                submissions: count,
            };
        });

        // 4. Quiz performance per quiz (use aggregation to avoid N+1)
        const quizzes = await Quiz.find({ course: { $in: courseIds } }).lean();
        const quizAttemptsStats = await QuizAttempt.aggregate([
            { $match: { quiz: { $in: quizzes.map((q) => q._id) } } },
            {
                $group: {
                    _id: "$quiz",
                    avgScore: { $avg: { $divide: ["$score", "$totalQuestions"] } },
                    attemptCount: { $sum: 1 },
                },
            },
        ]);

        const quizStatsMap = new Map(
            quizAttemptsStats.map((q) => [q._id.toString(), { avgScore: q.avgScore, attempts: q.attemptCount }])
        );

        const quizPerformance = quizzes
            .map((quiz) => {
                const stats = quizStatsMap.get(quiz._id.toString());
                if (!stats) return null;
                return {
                    quizId: quiz._id.toString(),
                    title: quiz.title,
                    avgScore: Math.round(stats.avgScore * 100),
                    attempts: stats.attempts,
                };
            })
            .filter(Boolean);

        const totalStudents = await User.countDocuments({
            role: "student",
            enrolledCourses: { $in: courseIds },
        });

        const avgCompletion = courseCompletion.length > 0
            ? Math.round(courseCompletion.reduce((sum, c) => sum + c.completion, 0) / courseCompletion.length)
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                gradeDistribution: buckets.map((b) => ({ range: b.range, count: b.count })),
                courseCompletion,
                submissionTrend,
                quizPerformance: quizPerformance.filter((q) => q.attempts > 0),
                totals: {
                    totalStudents,
                    totalCourses: courses.length,
                    avgGrade,
                    avgCompletion,
                },
            },
        });
    } catch (error) {
        console.error("Teacher analytics error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to load analytics" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
