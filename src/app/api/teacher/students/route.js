import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import Progress from "@/models/Progress";
import dbConnect from "@/lib/dbConnect";

export async function GET(request) {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;

        // Get all course IDs taught by the teacher
        const courseIds = await Course.find({
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
        }).distinct("_id");

        const query = {
            role: "student",
            enrolledCourses: { $in: courseIds },
        };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const [students, total] = await Promise.all([
            User.find(query)
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(query),
        ]);

        const studentIds = students.map((s) => s._id);

        // Fetch ALL progress for these students in single query
        const allProgress = await Progress.find({
            student: { $in: studentIds },
            course: { $in: courseIds },
        })
            .populate("course", "title")
            .lean();

        // Group progress by student for easy lookup
        const progressByStudent = {};
        allProgress.forEach((p) => {
            const studentIdStr = p.student.toString();
            if (!progressByStudent[studentIdStr]) {
                progressByStudent[studentIdStr] = [];
            }
            progressByStudent[studentIdStr].push(p);
        });

        const augmentedStudents = students.map((student) => {
            const studentProgress = progressByStudent[student._id.toString()] || [];
            const coursesProgress = studentProgress.map((p) => ({
                courseId: p.course?._id?.toString(),
                courseTitle: p.course?.title,
                completionPercentage: p.completionPercentage,
                completedLessonsCount: p.completedLessons?.length || 0,
            }));

            return {
                ...student,
                _id: student._id.toString(),
                id: student._id.toString(),
                coursesProgress,
            };
        });

        return NextResponse.json({
            success: true,
            result: {
                students: augmentedStudents,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
