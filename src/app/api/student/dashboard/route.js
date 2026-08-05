import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import User from "@/models/User";
import Course from "@/models/Course";
import Progress from "@/models/Progress";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
    try {
        const student = await requireStudent();
        await dbConnect();

        // 1. Fetch Student Details
        const user = await User.findById(student.id)
            .populate({
                path: "enrolledCourses",
                select: "title thumbnail category duration instructor level",
            })
            .lean();

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Student not found" },
                { status: 404 }
            );
        }

        const enrolledCourseIds = user.enrolledCourses.map((c) => c._id);

        // 2. Fetch Progress Stats
        const progressRecords = await Progress.find({
            student: student.id,
            course: { $in: enrolledCourseIds },
        }).lean();

        const completedLessonsCount = progressRecords.reduce(
            (acc, curr) => acc + (curr.completedLessons?.length || 0),
            0
        );

        // 3. Fetch Assignments Stats
        const totalAssignmentsCount = await Assignment.countDocuments({
            course: { $in: enrolledCourseIds },
            isPublished: true,
        });

        const submittedAssignmentsCount = await AssignmentSubmission.countDocuments({
            student: student.id,
            assignment: {
                $in: await Assignment.find({
                    course: { $in: enrolledCourseIds },
                    isPublished: true,
                }).distinct("_id"),
            },
        });

        const pendingAssignmentsCount = totalAssignmentsCount - submittedAssignmentsCount;

        // 4. Fetch Quizzes Stats
        const totalQuizzesCount = await Quiz.countDocuments({
            course: { $in: enrolledCourseIds },
            isPublished: true,
        });

        const completedQuizzesCount = progressRecords.reduce(
            (acc, curr) => acc + (curr.completedQuizzes?.length || 0),
            0
        );

        const pendingQuizzesCount = totalQuizzesCount - completedQuizzesCount;

        // 5. Determine recently accessed course to Continue Learning
        let continueCourse = null;
        if (progressRecords.length > 0) {
            // Sort by lastAccessed desc
            const sortedProgress = [...progressRecords].sort(
                (a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed)
            );
            const targetCourseId = sortedProgress[0].course;
            continueCourse = user.enrolledCourses.find(
                (c) => c._id.toString() === targetCourseId.toString()
            );
        } else if (user.enrolledCourses.length > 0) {
            continueCourse = user.enrolledCourses[0];
        }

        // Serialize results
        const courses = user.enrolledCourses.map((c) => ({
            ...c,
            _id: c._id.toString(),
            id: c._id.toString(),
        }));

        return NextResponse.json({
            success: true,
            data: {
                name: user.name,
                enrolledCourses: enrolledCourseIds.length,
                completedLessons: completedLessonsCount,
                pendingAssignments: pendingAssignmentsCount,
                pendingQuizzes: pendingQuizzesCount,
                courses,
                continueCourse: continueCourse
                    ? {
                          ...continueCourse,
                          _id: continueCourse._id.toString(),
                          id: continueCourse._id.toString(),
                          progress: progressRecords.find(
                              (p) => p.course.toString() === continueCourse._id.toString()
                          )?.completionPercentage || 0,
                      }
                    : null,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
