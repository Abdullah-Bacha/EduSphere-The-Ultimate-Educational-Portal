import dbConnect from "../lib/dbConnect";
import User from "../models/User";
import Course from "../models/Course";
import Category from "../models/Category";
import Lesson from "../models/Lesson";
import Assignment from "../models/Assignment";
import Quiz from "../models/Quiz";
import Certificate from "../models/Certificate";
import Progress from "../models/Progress";

export async function getDashboardStats() {
    await dbConnect();

    const [
        totalUsers,
        totalStudents,
        totalTeachers,
        totalCourses,
        totalCategories,
        totalLessons,
        totalAssignments,
        totalQuizzes,
        totalCertificates,
        progressRecords,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "teacher" }),
        Course.countDocuments(),
        Category.countDocuments(),
        Lesson.countDocuments(),
        Assignment.countDocuments(),
        Quiz.countDocuments(),
        Certificate.countDocuments(),
        Progress.find().select("completionPercentage").lean(),
    ]);

    const averageCompletionRate =
        progressRecords.length > 0
            ? Math.round(
                  progressRecords.reduce(
                      (sum, record) => sum + (record.completionPercentage || 0),
                      0
                  ) / progressRecords.length
              )
            : 0;

    return {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalCourses,
        totalCategories,
        totalLessons,
        totalAssignments,
        totalQuizzes,
        totalCertificates,
        averageCompletionRate,
    };
}

export async function getRecentUsers() {
    await dbConnect();

    const users = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role createdAt")
        .lean();

    return users.map((user) => ({
        _id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
    }));
}

export async function getRecentCourses() {
    await dbConnect();

    const courses = await Course.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title instructor category level createdAt")
        .lean();

    return courses.map((course) => ({
        _id: String(course._id),
        title: course.title,
        instructor: course.instructor,
        category: course.category,
        level: course.level,
        createdAt: course.createdAt instanceof Date ? course.createdAt.toISOString() : String(course.createdAt),
    }));
}