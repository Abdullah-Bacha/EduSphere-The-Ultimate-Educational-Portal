import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import StudentForm from "@/app/components/students/StudentForm";
import { getStudentById } from "@/services/studentService";

export default async function EditStudentPage({ params }) {

    await requireAdmin();

    const { id } = await params;

    const student = await getStudentById(id);

    if (!student) {
        notFound();
    }

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Edit Student
            </h1>

            <StudentForm
                initialData={student}
                isEdit={true}
            />

        </div>
    );
}