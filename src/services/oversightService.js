import dbConnect from "@/lib/dbConnect";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import User from "@/models/User";

// User is imported so its schema is registered for populate().
void User;

export async function getAssessmentOverview() {
    await dbConnect();

    const [
        totalQuizzes,
        totalAttempts,
        attemptAgg,
        totalAssignments,
        totalSubmissions,
        gradedSubmissions,
        recentAttempts,
        recentSubmissions,
    ] = await Promise.all([
        Quiz.countDocuments(),
        QuizAttempt.countDocuments(),
        QuizAttempt.aggregate([
            {
                $group: {
                    _id: null,
                    score: { $sum: "$score" },
                    total: { $sum: "$totalQuestions" },
                },
            },
        ]),
        Assignment.countDocuments(),
        AssignmentSubmission.countDocuments(),
        AssignmentSubmission.countDocuments({ status: "Graded" }),
        QuizAttempt.find()
            .sort({ createdAt: -1 })
            .limit(6)
            .populate({ path: "quiz", select: "title" })
            .populate({ path: "student", select: "name" })
            .lean(),
        AssignmentSubmission.find()
            .sort({ createdAt: -1 })
            .limit(6)
            .populate({ path: "assignment", select: "title totalMarks" })
            .populate({ path: "student", select: "name" })
            .lean(),
    ]);

    const scoreSum = attemptAgg[0]?.score || 0;
    const questionSum = attemptAgg[0]?.total || 0;
    const avgQuizScore = questionSum
        ? Math.round((scoreSum / questionSum) * 100)
        : 0;

    return {
        quiz: {
            total: totalQuizzes,
            attempts: totalAttempts,
            avgScore: avgQuizScore,
        },
        assignment: {
            total: totalAssignments,
            submissions: totalSubmissions,
            graded: gradedSubmissions,
            pending: totalSubmissions - gradedSubmissions,
        },
        recentAttempts: recentAttempts.map((a) => ({
            _id: String(a._id),
            quiz: a.quiz?.title || "Deleted quiz",
            student: a.student?.name || "Unknown",
            score: a.score,
            total: a.totalQuestions,
            percentage: a.totalQuestions
                ? Math.round((a.score / a.totalQuestions) * 100)
                : 0,
            date: a.createdAt ? new Date(a.createdAt).toISOString() : null,
        })),
        recentSubmissions: recentSubmissions.map((s) => ({
            _id: String(s._id),
            assignment: s.assignment?.title || "Deleted assignment",
            student: s.student?.name || "Unknown",
            status: s.status,
            marks: s.marksAwarded,
            totalMarks: s.assignment?.totalMarks ?? null,
            date: s.createdAt ? new Date(s.createdAt).toISOString() : null,
        })),
    };
}
