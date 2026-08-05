import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourseById } from "@/services/courseService";
import { requireRoles } from "@/lib/auth";
import CourseEnrollment from "@/app/components/courses/CourseEnrollment";

export const dynamic = "force-dynamic";

export default async function ViewCourse({
    params,
}) {
    const currentUser = await requireRoles(["admin", "teacher"]);

    const { id } = await params;

    const course = await getCourseById(id);

    if (!course) {
        notFound();
    }

    return (

        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Course Details</h1>
                    <p className="mt-1 text-gray-500">
                        Review course information.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link
                        href="/dashboard/courses"
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Back
                    </Link>
                    <Link
                        href={`/dashboard/courses/edit/${course._id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Edit
                    </Link>
                </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <dl className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Title</dt>
                        <dd className="mt-1 font-semibold text-gray-900">{course.title}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Instructor</dt>
                        <dd className="mt-1 text-gray-900">{course.instructor}</dd>
                    </div>
                    <div className="md:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                        <dd className="mt-1 whitespace-pre-wrap text-gray-900">
                            {course.description}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                        <dd className="mt-1 text-gray-900">{course.category}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Price</dt>
                        <dd className="mt-1 text-gray-900">${course.price}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Duration</dt>
                        <dd className="mt-1 text-gray-900">{course.duration}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Level</dt>
                        <dd className="mt-1 text-gray-900">{course.level}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-gray-900">
                            {course.isPublished ? "Published" : "Draft"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Created</dt>
                        <dd className="mt-1 text-gray-900">
                            {course.createdAt
                                ? new Date(course.createdAt).toLocaleDateString()
                                : "N/A"}
                        </dd>
                    </div>
                </dl>
            </div>

            {currentUser.role === "admin" && <CourseEnrollment courseId={course._id} />}
        </div>

    );

}
