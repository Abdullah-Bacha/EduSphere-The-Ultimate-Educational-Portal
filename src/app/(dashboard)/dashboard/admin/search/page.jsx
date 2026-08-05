import { requireAdmin } from "@/lib/auth";
import SearchClient from "@/app/components/search/SearchClient";

export const dynamic = "force-dynamic";

export default async function AdminSearchPage() {
    await requireAdmin();

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Search</h1>
                <p className="mt-1 text-gray-500">
                    Find students, teachers, courses, and categories in one place.
                </p>
            </div>

            <SearchClient />
        </div>
    );
}
