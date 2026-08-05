"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, FileText, CheckCircle, Star } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";

const defaultValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    status: "Active",
    isFeatured: false,
};

export default function TeacherForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(getInitialValues(initialData));

    function handleChange(e) {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!isEdit && !formData.password) {
            showToast("Password is required", "error");
            return;
        }

        setLoading(true);

        try {
            const url = isEdit
                ? `/api/teachers/${initialData._id}`
                : "/api/teachers";

            const method = isEdit ? "PUT" : "POST";

            const payload = { ...formData };

            if (isEdit && !payload.password) {
                delete payload.password;
            }

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || "Failed to save teacher", "error");
                return;
            }

            showToast(isEdit ? "Teacher updated successfully." : "Teacher created successfully.", "success");
            router.push("/dashboard/teachers");
            router.refresh();
        } catch (error) {
            showToast(error.message || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6"
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Name */}
                <div>
                    <label className="block mb-1.5 text-sm font-semibold text-slate-700">Name</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter full name"
                            className="w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-1.5 text-sm font-semibold text-slate-700">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="name@gmail.com"
                            className="w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                        {isEdit ? "New Password (optional)" : "Password"}
                    </label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!isEdit}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div>
                    <label className="block mb-1.5 text-sm font-semibold text-slate-700">Phone</label>
                    <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="03101773357"
                            className="w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400"
                        />
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="block mb-1.5 text-sm font-semibold text-slate-700">Status</label>
                    <div className="relative group">
                        <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 appearance-none cursor-pointer"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400" />
                    </div>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3 md:pt-7">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-semibold text-slate-700 inline-flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500" /> Featured Teacher
                        </span>
                    </label>
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                    <label className="block mb-1.5 text-sm font-semibold text-slate-700">Bio</label>
                    <div className="relative group">
                        <FileText className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        <textarea
                            name="bio"
                            rows={3}
                            maxLength={500}
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Short teacher bio..."
                            className="w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 resize-none placeholder-slate-400"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:pointer-events-none"
                >
                    {loading ? "Saving..." : isEdit ? "Update Teacher" : "Add Teacher"}
                </button>
            </div>
        </form>
    );
}

function getInitialValues(initialData) {
    if (!initialData) {
        return defaultValues;
    }

    return {
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        phone: initialData.phone || "",
        bio: initialData.bio || "",
        status: initialData.status || "Active",
        isFeatured: Boolean(initialData.isFeatured),
    };
}
