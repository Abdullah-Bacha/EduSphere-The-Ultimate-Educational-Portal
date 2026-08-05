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

        // 2. Fetch unique students enrolled in these courses
        const totalStudents = await User.countDocuments({
            role: "student",
            enrolledCourses: { $in: courseIds },
        });

        // 3. Fetch pending assignments to grade
        const assignments = await Assignment.find({ course: { $in: courseIds } }).lean();
        const assignmentIds = assignments.map((a) => a._id);
        const pendingAssignments = await AssignmentSubmission.countDocuments({
            assignment: { $in: assignmentIds },
            status: "Submitted",
        });

        // 4. Fetch total quizzes in these courses
        const totalQuizzes = await Quiz.countDocuments({
            course: { $in: courseIds },
        });

        // 5. Fetch recent courses list with student enrollment counts
        const courseStats = await Promise.all(
            courses.map(async (course) => {
                const [count, lessonCount, assignmentCount, progressRecords] = await Promise.all([
                    User.countDocuments({ role: "student", enrolledCourses: course._id }),
                    Lesson.countDocuments({ course: course._id }),
                    Assignment.countDocuments({ course: course._id }),
                    Progress.find({ course: course._id }).select("completionPercentage").lean(),
                ]);

                const completionPercentage = progressRecords.length > 0
                    ? Math.round(
                          progressRecords.reduce((sum, p) => sum + (p.completionPercentage || 0), 0) /
                              progressRecords.length
                      )
                    : 0;

                return {
                    ...course,
                    _id: course._id.toString(),
                    id: course._id.toString(),
                    studentCount: count,
                    completion: completionPercentage,
                    lessonCount,
                    assignmentCount,
                };
            })
        );

        // 6. Fetch pending submissions with details
        const pendingSubmissions = await AssignmentSubmission.find({
            assignment: { $in: assignmentIds },
            status: "Submitted",
        })
            .populate("assignment", "title dueDate course totalMarks")
            .populate("student", "name")
            .limit(5)
            .lean();

        const submissionsWithCourses = await Promise.all(
            pendingSubmissions.map(async (sub) => {
                try {
                    const assignmentCourseId = sub.assignment?.course || courseIds[0];
                    const course = assignmentCourseId
                        ? await Course.findById(assignmentCourseId).lean()
                        : null;

                    return {
                        ...sub,
                        _id: sub._id.toString(),
                        assignmentTitle: sub.assignment?.title || "Unknown Assignment",
                        studentName: sub.student?.name || "Student",
                        courseName: course?.title || "Unknown Course",
                        dueDate: sub.assignment?.dueDate || new Date(),
                    };
                } catch (err) {
                    console.error("Error processing submission:", err);
                    return {
                        ...sub,
                        _id: sub._id.toString(),
                        assignmentTitle: sub.assignment?.title || "Unknown Assignment",
                        studentName: sub.student?.name || "Student",
                        courseName: "Unknown Course",
                        dueDate: sub.assignment?.dueDate || new Date(),
                    };
                }
            })
        );

        // 7. Fetch recent activities
        const recentSubmissions = await AssignmentSubmission.find({
            assignment: { $in: assignmentIds },
        })
            .populate("student", "name")
            .populate("assignment", "title course")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const recentActivities = await Promise.all(
            recentSubmissions.map(async (sub) => {
                try {
                    const assignmentCourseId = sub.assignment?.course || courseIds[0];
                    const course = assignmentCourseId
                        ? await Course.findById(assignmentCourseId).lean()
                        : null;

                    return {
                        _id: sub._id.toString(),
                        activity: `${sub.student?.name || "Student"} submitted "${sub.assignment?.title || "Assignment"}"`,
                        courseName: course?.title || "Unknown Course",
                        timestamp: sub.createdAt || new Date(),
                    };
                } catch (err) {
                    console.error("Error processing activity:", err);
                    return {
                        _id: sub._id.toString(),
                        activity: `${sub.student?.name || "Student"} submitted "${sub.assignment?.title || "Assignment"}"`,
                        courseName: "Unknown Course",
                        timestamp: sub.createdAt || new Date(),
                    };
                }
            })
        );

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
