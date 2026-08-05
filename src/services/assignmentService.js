import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import User from "@/models/User";
import mongoose from "mongoose";

function serializeDoc(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : { ...doc };
    return {
        ...obj,
        _id: obj._id?.toString(),
        id: obj._id?.toString(),
        course: obj.course?.toString(),
        student: obj.student?.toString(),
        assignment: obj.assignment?.toString(),
        createdAt: obj.createdAt ? obj.createdAt.toISOString() : null,
        updatedAt: obj.updatedAt ? obj.updatedAt.toISOString() : null,
        dueDate: obj.dueDate ? obj.dueDate.toISOString() : null,
    };
}

export async function getStudentAssignments(studentId) {
    await dbConnect();

    const student = await User.findById(studentId);
    if (!student) throw new Error("Student not found");

    const assignments = await Assignment.find({
        course: { $in: student.enrolledCourses },
        isPublished: true,
    }).sort({ dueDate: 1 });

    const submissions = await AssignmentSubmission.find({
        student: studentId,
        assignment: { $in: assignments.map(a => a._id) },
    });

    return assignments.map(assignment => {
        const submission = submissions.find(s => s.assignment.toString() === assignment._id.toString());
        return {
            ...serializeDoc(assignment),
            submission: serializeDoc(submission),
        };
    });
}

export async function submitAssignment(studentId, assignmentId, content, fileUrl = "", fileName = "") {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        throw new Error("Invalid Assignment ID");
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error("Assignment not found");

    const student = await User.findById(studentId);
    if (!student.enrolledCourses.some(id => id.toString() === assignment.course.toString())) {
        throw new Error("Not enrolled in the course for this assignment");
    }

    if (!content?.trim() && !fileUrl) {
        throw new Error("Please provide a text answer or upload a file");
    }

    const submission = await AssignmentSubmission.findOneAndUpdate(
        { assignment: assignmentId, student: studentId },
        { content: content || "", fileUrl: fileUrl || "", fileName: fileName || "", status: "Submitted" },
        { new: true, upsert: true }
    );

    const Course = (await import("@/models/Course")).default;
    const course = await Course.findById(assignment.course).select("teacher instructor title").lean();
    const teacherId = course?.teacher;

    if (teacherId) {
        const { notifyUsers } = await import("@/services/notificationService");
        await notifyUsers([teacherId], {
            title: "New assignment submission",
            message: `${student.name} submitted "${assignment.title}" in "${course.title}".`,
            link: `/dashboard/teacher/assignments?courseId=${assignment.course}`,
        });

        // Send email to teacher
        const teacher = await User.findById(teacherId).select("name email").lean();
        if (teacher?.email) {
            const { sendEmail, newSubmissionEmail } = await import("@/services/emailService");
            const emailTpl = newSubmissionEmail({
                teacherName: teacher.name,
                studentName: student.name,
                assignmentTitle: assignment.title,
                courseTitle: course.title,
            });
            sendEmail({ to: teacher.email, ...emailTpl });
        }
    }

    return serializeDoc(submission);
}
