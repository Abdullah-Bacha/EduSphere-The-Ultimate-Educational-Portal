import { requireAdmin } from "@/lib/auth";
import WebsiteSettingsForm from "@/app/components/admin/WebsiteSettingsForm";
import TestimonialsManager from "@/app/components/admin/TestimonialsManager";
import LeadersManager from "@/app/components/admin/LeadersManager";

export const dynamic = "force-dynamic";

export default async function WebsiteSettingsPage() {
    await requireAdmin();

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Website Settings</h1>
                <p className="text-gray-500 mt-1">
                    Control the content shown on the public website — brand name, homepage copy, images, contact details, testimonials, and leaders.
                </p>
            </div>

            <div className="space-y-6">
                <WebsiteSettingsForm />
                <TestimonialsManager />
                <LeadersManager />
            </div>
        </div>
    );
}
