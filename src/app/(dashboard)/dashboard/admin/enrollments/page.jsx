import { requireAdmin } from "@/lib/auth";
import { getEnrollmentOverview } from "@/services/enrollmentService";
import EnrollmentsClient from "@/app/components/enrollments/EnrollmentsClient";

export const dynamic = "force-dynamic";

export default async function AdminEnrollmentsPage() {
    await requireAdmin();

    const data = await getEnrollmentOverview();

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Enrollments</h1>
                <p className="mt-1 text-gray-500">
                    Student enrollment across all courses.
                </p>
            </div>

            <EnrollmentsClient data={data} />
        </div>
    );
}
