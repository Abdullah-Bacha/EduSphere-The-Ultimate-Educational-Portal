import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function GET(request) {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const level = searchParams.get("level") || "";
        const archived = searchParams.get("archived") === "true";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;

        const query = {
            $or: [{ teacher: teacher._id }, { instructor: teacher.name }],
            archived: archived ? true : { $ne: true },
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
            Course.countDocuments(query),
        ]);

        // Augment each course with its student count
        const augmentedCourses = await Promise.all(
            courses.map(async (course) => {
                const studentCount = await User.countDocuments({
                    role: "student",
                    enrolledCourses: course._id,
                });
                return {
                    ...course,
                    _id: course._id.toString(),
                    id: course._id.toString(),
                    studentCount,
                };
            })
        );

        return NextResponse.json({
            success: true,
            result: {
                courses: augmentedCourses,
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
