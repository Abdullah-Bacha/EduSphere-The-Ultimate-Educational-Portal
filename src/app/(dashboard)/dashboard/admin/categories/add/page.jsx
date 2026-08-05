import { requireAdmin } from "@/lib/auth";
import CategoryForm from "@/app/components/categories/CategoryForm";

export const dynamic = "force-dynamic";

export default async function AdminCategoryAddPage() {
    await requireAdmin();

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Add Category</h1>
                <p className="text-gray-500 mt-1">Create a new category.</p>
            </div>

            <CategoryForm />
        </div>
    );
}
