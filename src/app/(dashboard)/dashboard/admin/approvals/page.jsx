import { requireAdmin } from "@/lib/auth";
import { getCoursesForApproval } from "@/services/courseApprovalService";
import ApprovalsClient from "@/app/components/approvals/ApprovalsClient";

export const dynamic = "force-dynamic";

export default async function AdminApprovalsPage() {
    await requireAdmin();

    const data = await getCoursesForApproval();

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Course approvals</h1>
                <p className="mt-1 text-gray-500">
                    Review and moderate course visibility across the platform.
                </p>
            </div>

            <ApprovalsClient initialData={data} />
        </div>
    );
}
