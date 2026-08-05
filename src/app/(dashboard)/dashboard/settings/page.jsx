import { requireRoles } from "@/lib/auth";
import SettingsForm from "@/app/components/settings/SettingsForm";

export default async function SettingsPage() {
    // Shared settings page: accessible by admin and teacher only.
    // Students use /dashboard/student/profile for their own settings.
    await requireRoles(["admin", "teacher"]);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-gray-500 mt-1">
                    Manage your profile settings.
                </p>
            </div>

            <SettingsForm />
        </div>
    );
}