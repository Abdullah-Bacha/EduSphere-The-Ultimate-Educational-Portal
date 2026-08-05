import Link from "next/link";
import { requireRoles } from "@/lib/auth";
import { getAllCourses } from "@/services/courseService";
import CourseTable from "@/app/components/courses/CourseTable";
import ExportButton from "@/app/components/admin/ExportButton";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
    const user = await requireRoles(["admin", "teacher"]);

    const courses = await getAllCourses();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Courses</h1>
                    <p className="text-gray-500 mt-1">Manage all LMS courses.</p>
                </div>

                <div className="flex items-center gap-2">
                    {user.role === "admin" && (
                        <ExportButton
                            type="courses"
                            className="rounded-lg px-4 py-2"
                        />
                    )}
                    <Link
                        href="/dashboard/courses/add"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
                    >
                        + Add Course
                    </Link>
                </div>
            </div>

            <CourseTable courses={courses} />
        </div>
    );
}
