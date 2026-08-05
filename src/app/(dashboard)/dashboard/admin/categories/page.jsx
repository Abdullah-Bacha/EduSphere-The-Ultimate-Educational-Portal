import { requireAdmin } from "@/lib/auth";
import { getCategories } from "@/services/categoryService";
import Link from "next/link";
import AdminCategoriesClient from "@/app/components/categories/AdminCategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
    await requireAdmin();

    const categories = await getCategories("");

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <p className="text-gray-500 mt-1">Manage all LMS categories.</p>
                </div>

                <Link
                    href="/dashboard/admin/categories/add"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
                >
                    + Add Category
                </Link>
            </div>

            <AdminCategoriesClient categories={categories} />
        </div>
    );
}
