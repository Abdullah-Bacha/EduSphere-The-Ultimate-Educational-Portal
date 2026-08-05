import dbConnect from "../lib/dbConnect";
import User from "../models/User";
import Course from "../models/Course";

export async function getStudentCourses(studentId, { search = "", category = "", level = "", page = 1, limit = 10 } = {}) {
    await dbConnect();

    const student = await User.findById(studentId);

    if (!student) {
        throw new Error("Student not found");
    }

    const query = {
        _id: { $in: student.enrolledCourses },
        isPublished: true,
    };

    if (search) {
        query.title = { $regex: search, $options: "i" };
    }

    if (category) {
        query.category = category;
    }

    if (level) {
        query.level = level;
    }

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
        Course.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Course.countDocuments(query)
    ]);

    return {
        courses: courses.map(course => ({
            ...course,
            _id: course._id.toString(),
            id: course._id.toString()
        })),
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
    };
}