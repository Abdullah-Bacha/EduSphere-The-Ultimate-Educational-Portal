import CourseForm from "@/app/components/courses/CourseForm";
import Link from "next/link";
import { requireRoles } from "@/lib/auth";
import { getCategories } from "@/services/categoryService";
import { getTeacherNames } from "@/services/teacherService";

export const dynamic = "force-dynamic";

export default async function AddCoursePage() {
    await requireRoles(["admin", "teacher"]);

    const [categories, teacherNames] = await Promise.all([
        getCategories(),
        getTeacherNames(),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Add New Course</h1>
                    <p className="mt-1 text-gray-500">
                        Create a new LMS course.
                    </p>
                </div>

                <Link
                    href="/dashboard/courses"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Back to Courses
                </Link>
            </div>
            <CourseForm
                categoryOptions={categories.map((c) => c.name)}
                teacherOptions={teacherNames}
            />
        </div>
    );
}
