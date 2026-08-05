import { requireAdmin } from "@/lib/auth";
import { getProgressOverview } from "@/services/adminProgressService";
import ProgressClient from "@/app/components/progress/ProgressClient";

export const dynamic = "force-dynamic";

export default async function AdminProgressPage() {
    await requireAdmin();

    const data = await getProgressOverview();

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Student progress</h1>
                <p className="mt-1 text-gray-500">
                    Course completion across all enrolled students.
                </p>
            </div>

            <ProgressClient data={data} />
        </div>
    );
}
