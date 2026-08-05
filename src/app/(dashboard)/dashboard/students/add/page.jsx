import StudentForm from "../../../../components/students/StudentForm";
import { requireAdmin } from "@/lib/auth";

export default async function AddStudentPage() {

    await requireAdmin();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Add Student</h1>
            <StudentForm />
        </div>
    );
}