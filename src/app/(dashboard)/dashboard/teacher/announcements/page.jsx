"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import AnnouncementForm from "@/app/components/teacher/AnnouncementForm";
import AnnouncementsList from "@/app/components/teacher/AnnouncementsList";

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [courseRes, announcementRes] = await Promise.all([
                    fetch("/api/teacher/courses?limit=100", { cache: "no-store" }),
                    fetch("/api/teacher/announcements", { cache: "no-store" }),
                ]);

                const courseData = await courseRes.json();
                const announcementData = await announcementRes.json();

                if (courseData.success) setCourses(courseData.result.courses || []);
                if (announcementData.success) setAnnouncements(announcementData.data.announcements || []);
            } catch (err) {
                console.error("Error fetching announcements:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleSubmitAnnouncement = (newAnnouncement) => {
        setAnnouncements([newAnnouncement, ...announcements]);
        setShowForm(false);
    };

    const handleDeleteAnnouncement = async (id) => {
        try {
            const res = await fetch("/api/teacher/announcements", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (data.success) {
                setAnnouncements(prev => prev.filter(a => a._id !== id));
            } else {
                console.error("Failed to delete announcement:", data.message);
            }
        } catch (err) {
            console.error("Error deleting announcement:", err);
        }
    };

    if (loading) {
        return (
            <div className="p-6 animate-pulse space-y-6">
                <div className="h-24 bg-slate-200 rounded-xl"></div>
                <div className="h-96 bg-slate-200 rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                            <Megaphone className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold text-slate-900">Announcements</h1>
                            <p className="mt-1 text-slate-600">Communicate important updates to your students</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                    >
                        {showForm ? "Cancel" : "New Announcement"}
                    </button>
                </div>
            </div>

            {showForm && (
                <AnnouncementForm
                    courses={courses}
                    onSubmit={handleSubmitAnnouncement}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <AnnouncementsList
                announcements={announcements}
                onDelete={handleDeleteAnnouncement}
            />
        </div>
    );
}
