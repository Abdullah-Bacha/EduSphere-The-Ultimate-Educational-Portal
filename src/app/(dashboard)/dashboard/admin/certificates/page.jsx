import { requireAdmin } from "@/lib/auth";
import {
    getAllCertificates,
    getCertificateStats,
} from "@/services/adminCertificateService";
import CertificatesClient from "@/app/components/certificates/CertificatesClient";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
    await requireAdmin();

    const [certificates, stats] = await Promise.all([
        getAllCertificates(),
        getCertificateStats(),
    ]);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Certificates</h1>
                <p className="mt-1 text-gray-500">
                    Certificates issued to students on course completion.
                </p>
            </div>

            <CertificatesClient
                initialCertificates={certificates}
                stats={stats}
            />
        </div>
    );
}
