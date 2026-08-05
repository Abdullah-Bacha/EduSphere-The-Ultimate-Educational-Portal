import { requireAdmin } from "@/lib/auth";
import { getAssessmentOverview } from "@/services/oversightService";
import AssessmentsClient from "@/app/components/oversight/AssessmentsClient";

export const dynamic = "force-dynamic";

export default async function AdminAssessmentsPage() {
    await requireAdmin();

    const data = await getAssessmentOverview();

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Assessments</h1>
                <p className="mt-1 text-gray-500">
                    Quiz attempts and assignment submissions across the platform.
                </p>
            </div>

            <AssessmentsClient data={data} />
        </div>
    );
}
