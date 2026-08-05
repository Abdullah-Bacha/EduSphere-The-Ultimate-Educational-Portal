import dbConnect from "../lib/dbConnect";
import Category from "../models/Category";
import mongoose from "mongoose";

export async function getCategories(search = "") {
    await dbConnect();

    const query = {};

    if (search) {
        query.name = {
            $regex: search,
            $options: "i",
        };
    }

    const categories = await Category.find(query)
        .sort({ createdAt: -1 })
        .lean();

    return categories.map((category) => ({
        ...category,
        _id: String(category._id),
    }));
}

export async function getCategoryById(id) {
    await dbConnect();

    if (!mongoose.isValidObjectId(id)) {
        return null;
    }

    const category = await Category.findById(id).lean();
    return category
        ? { ...category, _id: String(category._id) }
        : null;
}

export async function createCategory(data) {
    await dbConnect();

    const exists = await Category.findOne({
        name: data.name,
    });

    if (exists) {
        throw new Error("Category already exists");
    }

    const category = await Category.create({
        name: data.name,
        description: data.description || "",
        image: data.image || "/images/category-placeholder.svg",
        isActive: data.isActive !== false,
    });

    return { ...category.toObject(), _id: String(category._id) };
}

export async function updateCategory(id, data) {
    await dbConnect();

    if (!mongoose.isValidObjectId(id)) {
        return null;
    }

    const updated = await Category.findByIdAndUpdate(
        id,
        {
            name: data.name,
            description: data.description ?? "",
            image: data.image || "/images/category-placeholder.svg",
            isActive: data.isActive !== false,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    return updated
        ? { ...updated.toObject(), _id: String(updated._id) }
        : null;
}

export async function deleteCategory(id) {
    await dbConnect();

    if (!mongoose.isValidObjectId(id)) {
        return false;
    }

    const category = await Category.findByIdAndDelete(id);
    return Boolean(category);
}

export async function getCategoryNames() {
    await dbConnect();

    const categories = await Category.find({ isActive: true })
        .select("name")
        .sort({ name: 1 })
        .lean();

    return categories.map((category) => category.name);
}
