import dbConnect from "@/lib/dbConnect";
import Lesson from "@/models/Lesson";
import Progress from "@/models/Progress";
import User from "@/models/User";
import mongoose from "mongoose";

// Helper to serialize Mongoose documents safely
function serializeDoc(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : { ...doc };
    return {
        ...obj,
        _id: obj._id.toString(),
        id: obj._id.toString(),
        course: obj.course?.toString(),
        createdAt: obj.createdAt ? obj.createdAt.toISOString() : null,
        updatedAt: obj.updatedAt ? obj.updatedAt.toISOString() : null,
    };
}

export async function getCourseLessons(studentId, courseId) {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new Error("Invalid Course ID");
    }

    const student = await User.findById(studentId);
    if (!student || !student.enrolledCourses.some(id => id.toString() === courseId)) {
        throw new Error("Not enrolled in this course");
    }

    const lessons = await Lesson.find({ course: courseId, isPublished: true })
        .sort({ order: 1 });

    return lessons.map(serializeDoc);
}

export async function getStudentProgress(studentId, courseId) {
    await dbConnect();

    let progress = await Progress.findOne({ student: studentId, course: courseId });

    if (!progress) {
        progress = await Progress.create({
            student: studentId,
            course: courseId,
            completedLessons: [],
            completedQuizzes: [],
            completionPercentage: 0,
        });
    }

    const obj = progress.toObject();
    return {
        ...obj,
        _id: obj._id.toString(),
        id: obj._id.toString(),
        student: obj.student.toString(),
        course: obj.course.toString(),
        completedLessons: obj.completedLessons.map(id => id.toString()),
        completedQuizzes: obj.completedQuizzes.map(id => id.toString()),
        createdAt: obj.createdAt ? obj.createdAt.toISOString() : null,
        updatedAt: obj.updatedAt ? obj.updatedAt.toISOString() : null,
        lastAccessed: obj.lastAccessed ? obj.lastAccessed.toISOString() : null,
    };
}

export async function markLessonComplete(studentId, courseId, lessonId) {
    await dbConnect();

    // Verify enrollment
    const student = await User.findById(studentId);
    if (!student || !student.enrolledCourses.some(id => id.toString() === courseId)) {
        throw new Error("Not enrolled in this course");
    }

    const progress = await Progress.findOneAndUpdate(
        { student: studentId, course: courseId },
        {
            $addToSet: { completedLessons: lessonId },
            lastAccessed: new Date()
        },
        { new: true, upsert: true }
    );

    // Recalculates completionPercentage across lessons/quizzes/assignments
    // and auto-issues the certificate if the course just hit 100%.
    const { recalculateProgress } = await import("@/services/progressService");
    await recalculateProgress(studentId, courseId);

    return progress.completedLessons.map(id => id.toString());
}
