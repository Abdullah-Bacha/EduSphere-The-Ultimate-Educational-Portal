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

        // Augment students with their specific course enrollment progress
        const augmentedStudents = await Promise.all(
            students.map(async (student) => {
                // Find progress records for this student on the teacher's courses
                const studentProgress = await Progress.find({
                    student: student._id,
                    course: { $in: courseIds },
                })
                    .populate({
                        path: "course",
                        select: "title",
                    })
                    .lean();

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
            })
        );

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
