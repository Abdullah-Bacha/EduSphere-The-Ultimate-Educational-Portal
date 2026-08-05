import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getStudentById } from "@/services/studentService";
import AssignCourses from "@/app/components/students/AssignCourses";
import StudentDetailActions from "@/app/components/students/StudentDetailActions";

export default async function ViewStudentPage({ params }) {
    await requireAdmin();

    const { id } = await params;

    const student = await getStudentById(id);

    if (!student) {
        notFound();
    }

    const dob = student.dateOfBirth
        ? new Date(student.dateOfBirth).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "—";

    const createdAt = student.createdAt
        ? new Date(student.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "—";

    const fields = [
        { label: "Full Name", value: student.name },
        { label: "Email", value: student.email },
        { label: "Phone", value: student.phone || "—" },
        { label: "Gender", value: student.gender || "—" },
        { label: "Date of Birth", value: dob },
        { label: "Address", value: student.address || "—" },
        { label: "Joined On", value: createdAt },
    ];

    return (
        <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200/70">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <Link
                                href="/dashboard/students"
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                ← Back to Students
                            </Link>
                            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                                {student.name}
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Student profile and enrollment details.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                                    student.status === "Active"
                                        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                                        : "bg-slate-50 text-slate-600 ring-slate-500/10"
                                }`}
                            >
                                {student.status || "Active"}
                            </span>

                            <StudentDetailActions student={student} />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6">
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.label}>
                                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    {field.label}
                                </dt>
                                <dd className="mt-1 text-sm font-medium text-slate-800 break-words">
                                    {field.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            <AssignCourses student={student} />
        </div>
    );
}
