import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import Quiz from "@/models/Quiz";
import Lesson from "@/models/Lesson";
import Progress from "@/models/Progress";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        // 1. Fetch assigned courses
        let courses = await Course.find({
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        }).lean();

        // If no courses found, create demo courses for better UX
        if (!courses || courses.length === 0) {
            console.log("No courses found for teacher. Returning empty dashboard.");

            // Return success with empty data instead of error
            return NextResponse.json({
                success: true,
                data: {
                    name: teacher.name,
                    assignedCourses: 0,
                    totalStudents: 0,
                    pendingAssignments: 0,
                    totalQuizzes: 0,
                    courses: [],
                    allCourses: [],
                    pendingSubmissions: [],
                    recentActivities: [],
                    message: "No courses assigned yet. Create a course to get started!",
                },
            });
        }

        const courseIds = courses.map((c) => c._id);

        // 2-4. Fetch all stats in parallel using aggregation (NOT N+1)
        const [
            totalStudentsResult,
            assignmentStats,
            totalQuizzesResult,
            enrollmentCounts,
            lessonCounts,
            assignmentCounts,
            progressData,
        ] = await Promise.all([
            User.countDocuments({
                role: "student",
                enrolledCourses: { $in: courseIds },
            }),
            AssignmentSubmission.aggregate([
                { $match: { status: "Submitted" } },
                { $lookup: { from: "assignments", localField: "assignment", foreignField: "_id", as: "assignmentData" } },
                { $unwind: "$assignmentData" },
                { $match: { "assignmentData.course": { $in: courseIds } } },
                { $count: "count" },
            ]),
            Quiz.countDocuments({ course: { $in: courseIds } }),
            User.aggregate([
                { $match: { role: "student" } },
                { $unwind: "$enrolledCourses" },
                { $group: { _id: "$enrolledCourses", count: { $sum: 1 } } },
            ]),
            Lesson.aggregate([
                { $match: { course: { $in: courseIds } } },
                { $group: { _id: "$course", count: { $sum: 1 } } },
            ]),
            Assignment.aggregate([
                { $match: { course: { $in: courseIds } } },
                { $group: { _id: "$course", count: { $sum: 1 } } },
            ]),
            Progress.find({ course: { $in: courseIds } })
                .select("course completionPercentage")
                .lean(),
        ]);

        const totalStudents = totalStudentsResult;
        const pendingAssignments = assignmentStats[0]?.count || 0;
        const totalQuizzes = totalQuizzesResult;

        const enrollmentMap = new Map(
            enrollmentCounts.map((e) => [e._id.toString(), e.count])
        );
        const lessonMap = new Map(lessonCounts.map((l) => [l._id.toString(), l.count]));
        const assignmentMap = new Map(
            assignmentCounts.map((a) => [a._id.toString(), a.count])
        );

        const progressByCourse = {};
        progressData.forEach((p) => {
            const courseId = p.course.toString();
            if (!progressByCourse[courseId]) {
                progressByCourse[courseId] = [];
            }
            progressByCourse[courseId].push(p.completionPercentage || 0);
        });

        const courseStats = courses.map((course) => {
            const courseIdStr = course._id.toString();
            const completionPercentages = progressByCourse[courseIdStr] || [];
            const completionPercentage = completionPercentages.length
                ? Math.round(completionPercentages.reduce((a, b) => a + b, 0) / completionPercentages.length)
                : 0;

            return {
                ...course,
                _id: courseIdStr,
                id: courseIdStr,
                studentCount: enrollmentMap.get(courseIdStr) || 0,
                completion: completionPercentage,
                lessonCount: lessonMap.get(courseIdStr) || 0,
                assignmentCount: assignmentMap.get(courseIdStr) || 0,
            };
        });

        // 6. Fetch pending submissions with details (pre-fetch courses to avoid N+1)
        const pendingSubmissions = await AssignmentSubmission.find({
            assignment: { $in: assignmentIds },
            status: "Submitted",
        })
            .populate("assignment", "title dueDate course totalMarks")
            .populate("student", "name")
            .limit(5)
            .lean();

        const courseMap = new Map(courses.map((c) => [c._id.toString(), c]));
        const submissionsWithCourses = pendingSubmissions.map((sub) => {
            const assignmentCourseId = sub.assignment?.course;
            const course = courseMap.get(assignmentCourseId?.toString()) || { title: "Unknown Course" };

            return {
                ...sub,
                _id: sub._id.toString(),
                assignmentTitle: sub.assignment?.title || "Unknown Assignment",
                studentName: sub.student?.name || "Student",
                courseName: course.title || "Unknown Course",
                dueDate: sub.assignment?.dueDate || new Date(),
            };
        });

        // 7. Fetch recent activities (using pre-fetched courseMap to avoid N+1)
        const recentSubmissions = await AssignmentSubmission.find({
            assignment: { $in: assignmentIds },
        })
            .populate("student", "name")
            .populate("assignment", "title course")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const recentActivities = recentSubmissions.map((sub) => {
            const assignmentCourseId = sub.assignment?.course;
            const course = courseMap.get(assignmentCourseId?.toString()) || { title: "Unknown Course" };

            return {
                _id: sub._id.toString(),
                activity: `${sub.student?.name || "Student"} submitted "${sub.assignment?.title || "Assignment"}"`,
                courseName: course.title || "Unknown Course",
                timestamp: sub.createdAt || new Date(),
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                name: teacher.name,
                assignedCourses: courses.length,
                totalStudents,
                pendingAssignments,
                totalQuizzes,
                courses: courseStats.slice(0, 3),
                allCourses: courseStats,
                pendingSubmissions: submissionsWithCourses.slice(0, 5),
                recentActivities: recentActivities.slice(0, 5),
            },
        });
    } catch (error) {
        console.error("Teacher dashboard error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to load dashboard data",
                error: process.env.NODE_ENV === "development" ? error.toString() : undefined,
            },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
