import dbConnect from "@/lib/dbConnect";
import Progress from "@/models/Progress";
import Lesson from "@/models/Lesson";
import Quiz from "@/models/Quiz";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";

// Single source of truth for a student's completion percentage in a course.
// Combines lessons, quizzes, and graded assignments — whichever of those
// actually exist in the course — and, once the course reaches 100%, issues
// the certificate and notification automatically. Call this any time a
// lesson is completed, a quiz is attempted, or an assignment is graded.
export async function recalculateProgress(studentId, courseId) {
    await dbConnect();

    const [totalLessons, totalQuizzes, assignments, progress] = await Promise.all([
        Lesson.countDocuments({ course: courseId, isPublished: true }),
        Quiz.countDocuments({ course: courseId, isPublished: true }),
        Assignment.find({ course: courseId, isPublished: true }).select("_id").lean(),
        Progress.findOneAndUpdate(
            { student: studentId, course: courseId },
            { $setOnInsert: { completedLessons: [], completedQuizzes: [] } },
            { new: true, upsert: true }
        ),
    ]);

    const totalAssignments = assignments.length;
    const gradedAssignments = totalAssignments
        ? await AssignmentSubmission.countDocuments({
              student: studentId,
              assignment: { $in: assignments.map((a) => a._id) },
              status: "Graded",
          })
        : 0;

    const components = [];
    if (totalLessons > 0) {
        components.push(progress.completedLessons.length / totalLessons);
    }
    if (totalQuizzes > 0) {
        components.push(progress.completedQuizzes.length / totalQuizzes);
    }
    if (totalAssignments > 0) {
        components.push(gradedAssignments / totalAssignments);
    }

    const percentage =
        components.length > 0
            ? Math.round(
                  (components.reduce((sum, value) => sum + value, 0) / components.length) * 100
              )
            : 0;

    progress.completionPercentage = percentage;
    progress.lastAccessed = new Date();
    await progress.save();

    if (percentage >= 100) {
        await issueCertificateIfNeeded(studentId, courseId);
    }

    return {
        _id: progress._id.toString(),
        completionPercentage: percentage,
        completedLessons: progress.completedLessons.map((id) => id.toString()),
        completedQuizzes: progress.completedQuizzes.map((id) => id.toString()),
    };
}

async function issueCertificateIfNeeded(studentId, courseId) {
    const { generateCertificate } = await import("@/services/certificateService");
    const Certificate = (await import("@/models/Certificate")).default;

    const alreadyExists = await Certificate.exists({ student: studentId, course: courseId });
    const certificate = await generateCertificate(studentId, courseId);

    if (!alreadyExists && certificate) {
        const { notifyUsers } = await import("@/services/notificationService");
        const Course = (await import("@/models/Course")).default;
        const course = await Course.findById(courseId).select("title").lean();

        await notifyUsers([studentId], {
            title: "Certificate earned!",
            message: `You've completed "${course?.title ?? "your course"}" and your certificate is ready.`,
            link: "/dashboard/student/certificates",
        });
    }
}
