"use client";
import CategoryTable from "./CategoryTable";

export default function AdminCategoriesClient({ categories }) {
    return (
        <div className="space-y-4">
            <CategoryTable categories={categories} />
        </div>
    );
}