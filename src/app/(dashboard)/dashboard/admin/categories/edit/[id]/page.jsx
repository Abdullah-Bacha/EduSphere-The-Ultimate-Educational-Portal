import { requireAdmin } from "@/lib/auth";

import CategoryForm from "@/app/components/categories/CategoryForm";
import { getCategoryById } from "@/services/categoryService";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }) {

    await requireAdmin();

    const { id } = await params;

    const category = await getCategoryById(id);

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Edit Category
            </h1>

            <CategoryForm
                initialData={JSON.parse(JSON.stringify(category))}
                isEdit={true}
            />

        </div>
    );
}
