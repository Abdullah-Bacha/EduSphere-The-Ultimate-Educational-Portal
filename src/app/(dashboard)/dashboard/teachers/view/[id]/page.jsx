import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getTeacherById } from "@/services/teacherService";
import TeacherDetailActions from "@/app/components/teachers/TeacherDetailActions";

export default async function ViewTeacherPage({ params }) {
    await requireAdmin();

    const { id } = await params;

    const teacher = await getTeacherById(id);

    if (!teacher) {
        notFound();
    }

    const createdAt = teacher.createdAt
        ? new Date(teacher.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "—";

    const fields = [
        { label: "Full Name", value: teacher.name },
        { label: "Email", value: teacher.email },
        { label: "Phone", value: teacher.phone || "—" },
        { label: "Bio", value: teacher.bio || "—" },
        { label: "Featured", value: teacher.isFeatured ? "Yes" : "No" },
        { label: "Joined On", value: createdAt },
    ];

    return (
        <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200/70">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <Link
                                href="/dashboard/teachers"
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                ← Back to Teachers
                            </Link>
                            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                                {teacher.name}
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Teacher profile and details.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                                    teacher.status === "Active"
                                        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                                        : "bg-slate-50 text-slate-600 ring-slate-500/10"
                                }`}
                            >
                                {teacher.status || "Active"}
                            </span>

                            <TeacherDetailActions teacher={teacher} />
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
        </div>
    );
}
