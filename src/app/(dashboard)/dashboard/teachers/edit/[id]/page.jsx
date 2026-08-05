import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import TeacherForm from "@/app/components/teachers/TeacherForm";
import { getTeacherById } from "@/services/teacherService";

export default async function EditTeacherPage({ params }) {
    await requireAdmin();

    const { id } = await params;

    const teacher = await getTeacherById(id);

    if (!teacher) {
        notFound();
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Edit Teacher</h1>

            <TeacherForm initialData={teacher} isEdit={true} />
        </div>
    );
}
