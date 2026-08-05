"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, UserCheck, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { useToast } from "@/app/components/ui/ToastProvider";

const defaultValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "Male",
    dateOfBirth: "",
    address: "",
    status: "Active",
};

export default function StudentForm({
    initialData = null,
    isEdit = false,
}) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(getInitialValues(initialData));

    function handleChange(e) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
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
                ? `/api/students/${initialData._id}`
                : "/api/students";

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
                showToast(data.message, "error");
                return;
            }

            showToast(isEdit ? "Student updated successfully." : "Student created successfully.", "success");
            router.push("/dashboard/students");
            router.refresh();
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    }


return (
    <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6"
    >
        {/* Form Grid Area */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Name Input */}
            <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">Name</label>
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500 group-focus-within:text-blue-500" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter full name"
                    />
                </div>
            </div>

            {/* Email Input */}
            <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">Email</label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500 group-focus-within:text-blue-500" />
                    <input
                        type="email"
                        className="w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="name@gmail.com"
                    />
                </div>
            </div>

            {/* Password Input */}
            <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                    {isEdit ? "New Password (optional)" : "Password"}
                </label>
                <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500 group-focus-within:text-blue-500" />
                    <input
                        type="password"
                        className="w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={!isEdit}
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {/* Phone Input */}
            <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">Phone</label>
                <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500 group-focus-within:text-blue-500" />
                    <input
                        type="tel"
                        className="w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="03101773357"
                    />
                </div>
            </div>

            {/* Gender Select */}
            <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">Gender</label>
                <div className="relative group">
                    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500 group-focus-within:text-blue-500 pointer-events-none" />
                    <select
                        className="w-full pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 appearance-none cursor-pointer"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 group-hover:border-t-blue-500 group-focus-within:border-t-blue-500" />
                </div>
            </div>

            {/* Date of Birth Input */}
            <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">Date of Birth</label>
                <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500 group-focus-within:text-blue-500 pointer-events-none" />
                    <input
                        type="date"
                        className="w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Status Select */}
            <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">Status</label>
                <div className="relative group">
                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500 group-focus-within:text-blue-500 pointer-events-none" />
                    <select
                        className="w-full pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 appearance-none cursor-pointer"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 group-hover:border-t-blue-500 group-focus-within:border-t-blue-500" />
                </div>
            </div>

            {/* Address Textarea */}
            <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">Address</label>
                <div className="relative group">
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500 group-focus-within:text-blue-500" />
                    <textarea
                        className="w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-black outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 resize-none placeholder-slate-400"
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter complete address..."
                    />
                </div>
            </div>
        </div>

        {/* Form Action Button */}
        <div className="flex justify-end pt-2">
            <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
            >
                {loading ? "Saving..." : isEdit ? "Update Student" : "Add Student"}
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
        gender: initialData.gender || "Male",
        dateOfBirth: initialData.dateOfBirth
            ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
            : "",
        address: initialData.address || "",
        status: initialData.status || "Active",
    };
}
