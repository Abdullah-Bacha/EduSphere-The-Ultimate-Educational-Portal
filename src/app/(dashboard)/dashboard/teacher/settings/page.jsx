import { requireTeacher } from "@/lib/auth";
import SettingsForm from "@/app/components/settings/SettingsForm";

export default async function TeacherSettingsPage() {
    await requireTeacher();

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
                <p className="text-slate-500 mt-1 text-sm">
                    Manage your account preferences, notification settings, and appearance options.
                </p>
            </div>

            <SettingsForm />
        </div>
    );
}
