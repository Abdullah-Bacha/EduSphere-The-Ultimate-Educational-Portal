import { notFound } from "next/navigation";
import { getCourseById } from "@/services/courseService";
import CourseForm from "@/app/components/courses/CourseForm";
import { requireRoles } from "@/lib/auth";
import { getCategories } from "@/services/categoryService";
import { getTeacherNames } from "@/services/teacherService";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({ params }) {
    await requireRoles(["admin", "teacher"]);

    const { id } = await params;
    const course = await getCourseById(id);

    if (!course) {
        notFound();
    }

    const [categories, teacherNames] = await Promise.all([
        getCategories(),
        getTeacherNames(),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Course</h1>
                <p className="mt-1 text-gray-500">
                    Update course details and publishing status.
                </p>
            </div>
            <CourseForm
                key={course._id}
                course={course}
                mode="edit"
                categoryOptions={categories.map((c) => c.name)}
                teacherOptions={teacherNames}
            />
        </div>
    );
}
