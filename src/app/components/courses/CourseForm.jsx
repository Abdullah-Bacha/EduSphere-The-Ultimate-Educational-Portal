"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    BookOpen,
    User,
    Tag,
    DollarSign,
    Clock,
    ImageIcon,
    AlertCircle,
    Loader2,
} from "lucide-react";
import {
    COURSE_LEVELS,
    DEFAULT_COURSE_THUMBNAIL,
    normalizeCoursePayload,
    validateCoursePayload,
} from "@/validations/courseValidation";

const defaultValues = {
    title: "",
    description: "",
    instructor: "",
    category: "",
    price: "",
    duration: "8 Weeks",
    thumbnail: "",
    level: "Beginner",
    isPublished: true,
};

const fieldClasses =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

function Label({ children, required }) {
    return (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {children}
            {required && <span className="text-red-500"> *</span>}
        </label>
    );
}

export default function CourseForm({ course, mode = "create", categoryOptions = [], teacherOptions = [] }) {
    const router = useRouter();
    const isEdit = mode === "edit";
    const courseId = course?._id ?? course?.id;

    const [formData, setFormData] = useState(getInitialValues(course));
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    // Keep the course's existing value selectable even if it's not part of
    // the current categories/teachers list (renamed/removed elsewhere).
    const categorySelectOptions = mergeOptions(categoryOptions, formData.category);
    const teacherSelectOptions = mergeOptions(teacherOptions, formData.instructor);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function validate() {
        const result = validateCoursePayload(formData);
        setErrors(result.errors);
        return result;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validation = validate();

        if (!validation.valid) {
            return;
        }

        if (isEdit && !courseId) {
            setErrors(["Course ID is missing."]);
            return;
        }

        setLoading(true);
        setErrors([]);

        try {
            const payload = normalizeCoursePayload(validation.payload);

            const endpoint = isEdit ? `/api/courses/${courseId}` : "/api/courses";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setErrors(formatApiErrors(data));
                return;
            }

            router.push("/dashboard/courses");
            router.refresh();
        } catch (error) {
            setErrors([error.message || "Unable to save course."]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl space-y-6 rounded-xl border bg-white p-6 shadow-sm sm:p-8"
        >
            <div className="space-y-4 border-b pb-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isEdit ? "Edit Course" : "Create Course"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isEdit
                                ? "Update the details for this course."
                                : "Fill in the details to add a new course."}
                        </p>
                    </div>
                </div>

                {errors.length > 0 && (
                    <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold">Please fix the following:</p>
                            <ul className="mt-1.5 list-disc list-inside space-y-0.5">
                                {errors.map((error) => (
                                    <li key={error}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-5">
                <div>
                    <Label required>Course Title</Label>
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g. Frontend Development with React"
                        value={formData.title ?? ""}
                        onChange={handleChange}
                        className={fieldClasses}
                        required
                    />
                </div>

                <div>
                    <Label required>Description</Label>
                    <textarea
                        name="description"
                        placeholder="What will students learn in this course?"
                        value={formData.description ?? ""}
                        onChange={handleChange}
                        rows={5}
                        className={`${fieldClasses} resize-none`}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <Label required>
                            <span className="inline-flex items-center gap-1.5">
                                <User size={14} /> Instructor
                            </span>
                        </Label>
                        <select
                            name="instructor"
                            value={formData.instructor ?? ""}
                            onChange={handleChange}
                            className={fieldClasses}
                            required
                        >
                            <option value="" disabled>
                                Select instructor
                            </option>
                            {teacherSelectOptions.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label required>
                            <span className="inline-flex items-center gap-1.5">
                                <Tag size={14} /> Category
                            </span>
                        </Label>
                        <select
                            name="category"
                            value={formData.category ?? ""}
                            onChange={handleChange}
                            className={fieldClasses}
                            required
                        >
                            <option value="" disabled>
                                Select category
                            </option>
                            {categorySelectOptions.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <Label required>
                            <span className="inline-flex items-center gap-1.5">
                                <DollarSign size={14} /> Price (USD)
                            </span>
                        </Label>
                        <input
                            type="number"
                            min="0"
                            name="price"
                            placeholder="0 for free course"
                            value={formData.price ?? ""}
                            onChange={handleChange}
                            className={fieldClasses}
                            required
                        />
                    </div>

                    <div>
                        <Label required>
                            <span className="inline-flex items-center gap-1.5">
                                <Clock size={14} /> Duration
                            </span>
                        </Label>
                        <input
                            type="text"
                            name="duration"
                            placeholder="e.g. 8 Weeks"
                            value={formData.duration ?? ""}
                            onChange={handleChange}
                            className={fieldClasses}
                            required
                        />
                    </div>
                </div>

                <div>
                    <Label>
                        <span className="inline-flex items-center gap-1.5">
                            <ImageIcon size={14} /> Thumbnail
                        </span>
                    </Label>

                    <div className="space-y-3">
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                Select from available images
                            </label>
                            <select
                                value={formData.thumbnail ?? ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                                className={fieldClasses}
                            >
                                <option value="">-- Choose an image --</option>
                                <option value="/images/abd.jpeg">Avatar (ABD)</option>
                                <option value="/images/image 8.png">Image 8</option>
                                <option value="/images/image 10.png">Image 10</option>
                                <option value="/images/image 11.png">Image 11</option>
                                <option value="/images/Student learning.png">Student Learning</option>
                                <option value="/images/Students learning.png">Students Learning</option>
                                <option value="">-- Custom URL --</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                Or enter custom URL
                            </label>
                            <input
                                type="text"
                                name="thumbnail"
                                placeholder="https://... (leave blank to use default placeholder)"
                                value={formData.thumbnail ?? ""}
                                onChange={handleChange}
                                className={fieldClasses}
                            />
                        </div>
                    </div>

                    <div className="mt-3 h-36 w-full max-w-[220px] overflow-hidden rounded-lg border bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={formData.thumbnail || DEFAULT_COURSE_THUMBNAIL}
                            alt="Thumbnail preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = DEFAULT_COURSE_THUMBNAIL;
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-end">
                    <div>
                        <Label>Level</Label>
                        <select
                            name="level"
                            value={formData.level ?? "Beginner"}
                            onChange={handleChange}
                            className={fieldClasses}
                        >
                            {COURSE_LEVELS.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>

                    <label className="flex h-[42px] cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4">
                        <span className="text-sm font-medium text-gray-700">
                            Published
                        </span>
                        <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={Boolean(formData.isPublished)}
                                onChange={handleChange}
                                className="peer sr-only"
                            />
                            <span className="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-blue-600" />
                            <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                        </span>
                    </label>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t pt-5">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? "Saving..." : isEdit ? "Update Course" : "Add Course"}
                </button>
                <Link
                    href="/dashboard/courses"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}

function getInitialValues(course) {
    return {
        ...defaultValues,
        ...(course ?? {}),
        price: course?.price ?? defaultValues.price,
        thumbnail:
            course?.thumbnail === DEFAULT_COURSE_THUMBNAIL
                ? ""
                : course?.thumbnail ?? defaultValues.thumbnail,
    };
}

function formatApiErrors(data) {
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
        return data.errors;
    }

    return [data?.message || "Unable to save course."];
}

function mergeOptions(options, currentValue) {
    const list = Array.isArray(options) ? [...options] : [];

    if (currentValue && !list.includes(currentValue)) {
        list.unshift(currentValue);
    }

    return list;
}