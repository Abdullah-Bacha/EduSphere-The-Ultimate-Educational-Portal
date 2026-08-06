"use client";

import { useEffect, useState } from "react";
import { User as UserIcon, ImageIcon } from "lucide-react";

const AVAILABLE_AVATARS = [
    { name: "Avatar (ABD)", path: "/images/abd.jpeg" },
    { name: "Image 8", path: "/images/image 8.png" },
    { name: "Image 10", path: "/images/image 10.png" },
    { name: "Image 11", path: "/images/image 11.png" },
    { name: "Student Learning", path: "/images/Student learning.png" },
    { name: "Students Learning", path: "/images/Students learning.png" },
];

export default function TeacherProfilePage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        bio: "",
        image: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(true);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    async function loadProfile() {
        try {
            const res = await fetch("/api/teacher/profile");
            const data = await res.json();
            if (data.success) {
                const user = data.result;
                setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    gender: user.gender || "",
                    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
                    address: user.address || "",
                    bio: user.bio || "",
                    image: user.image || "",
                });
            }
        } catch (err) {
            console.error("Failed to load profile", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);
        setMessage({ text: "", type: "" });
        try {
            const res = await fetch("/api/teacher/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ text: "Profile updated successfully!", type: "success" });
            } else {
                setMessage({ text: data.message || "Failed to update profile", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "An error occurred.", type: "error" });
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ text: "New passwords do not match", type: "error" });
            return;
        }

        setUpdatingPassword(true);
        setMessage({ text: "", type: "" });
        try {
            const res = await fetch("/api/teacher/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ text: "Password changed successfully!", type: "success" });
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                setMessage({ text: data.message || "Failed to change password", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "An error occurred.", type: "error" });
        } finally {
            setUpdatingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 animate-pulse space-y-6 max-w-4xl mx-auto">
                <div className="h-10 bg-slate-200 rounded w-1/4"></div>
                <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
                <p className="text-slate-500 text-sm mt-1">Update your personal information, bio, and account security settings.</p>
            </div>

            {message.text && (
                <div
                    className={`p-4 rounded-xl font-medium ${
                        message.type === "success"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                    {message.text}
                </div>
            )}

            {/* Avatar Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <UserIcon size={20} /> Profile Picture
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-3">
                            Select Your Avatar
                        </label>
                        <select
                            value={formData.image || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                            className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">-- No Avatar --</option>
                            {AVAILABLE_AVATARS.map((avatar) => (
                                <option key={avatar.path} value={avatar.path}>
                                    {avatar.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-3">
                            Or enter custom image URL
                        </label>
                        <input
                            type="text"
                            placeholder="https://example.com/photo.jpg"
                            value={formData.image && formData.image.startsWith('http') ? formData.image : ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Avatar Preview */}
                    {formData.image && (
                        <div className="flex items-center gap-6 pt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-blue-300 bg-slate-100 flex items-center justify-center shrink-0">
                                <img
                                    src={formData.image}
                                    alt="Avatar preview"
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.parentElement.innerHTML = `
                                            <div class="w-full h-full flex items-center justify-center bg-slate-100">
                                                <div class="text-center">
                                                    <svg class="w-8 h-8 mx-auto text-red-500 mb-1" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                                    </svg>
                                                    <p class="text-xs text-red-600 font-medium">Failed to load</p>
                                                </div>
                                            </div>
                                        `;
                                    }}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-slate-700 font-semibold mb-1">Preview:</p>
                                <p className="text-xs text-slate-600">Your avatar will appear next to your name</p>
                                <p className="text-xs text-slate-500 mt-2">
                                    <span className="font-semibold">URL:</span> {formData.image}
                                </p>
                            </div>
                        </div>
                    )}
                    {!formData.image && (
                        <div className="flex items-center gap-6 pt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="h-28 w-28 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border-4 border-slate-200">
                                <UserIcon size={48} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">
                                    <span className="font-semibold">No avatar selected</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Choose an avatar from the dropdown or enter a custom image URL</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Details Form */}
                <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800">Personal Details</h2>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
                                <input
                                    disabled
                                    type="email"
                                    value={formData.email}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 text-slate-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Professional Bio</label>
                            <textarea
                                rows="5"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Describe your teaching experience and expertise..."
                                className="w-full border border-slate-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            ></textarea>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={updatingProfile}
                                className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {updatingProfile ? "Saving..." : "Save Profile Details"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change Password Form */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 h-fit space-y-6">
                    <h2 className="text-xl font-bold text-slate-800">Security</h2>
                    <p className="text-sm text-slate-500">Change your login password to keep your account secure.</p>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Current Password</label>
                            <input
                                required
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">New Password</label>
                            <input
                                required
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Confirm New Password</label>
                            <input
                                required
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={updatingPassword}
                                className="w-full py-2.5 bg-slate-800 text-white hover:bg-slate-900 font-bold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {updatingPassword ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
