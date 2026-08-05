import { requireAdmin } from "@/lib/auth";
import TeacherForm from "@/app/components/teachers/TeacherForm";

export default async function AddTeacherPage() {
    await requireAdmin();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Add Teacher</h1>
            <TeacherForm />
        </div>
    );
}
