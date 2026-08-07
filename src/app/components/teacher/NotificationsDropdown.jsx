"use client";

import { Bell, Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

function timeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default function NotificationsDropdown() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadNotifications() {
        try {
            const res = await fetch("/api/teacher/notifications", { cache: "no-store" });
            const data = await res.json();
            if (data.success) {
                setNotifications(data.result);
            }
        } catch (err) {
            console.error("Failed to load notifications:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            await loadNotifications();
        })();
    }, []);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleMarkAsRead = async (id) => {
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
        try {
            await fetch("/api/teacher/notifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId: id }),
            });
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const handleDelete = async (id) => {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        try {
            await fetch("/api/teacher/notifications", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId: id }),
            });
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
                    <div className="border-b border-slate-200 px-4 py-3">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 py-8 text-center text-slate-400 text-sm">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-slate-500">
                                <Bell size={32} className="mx-auto mb-2 opacity-30" />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.slice(0, 8).map((notif) => (
                                <div
                                    key={notif._id}
                                    className={`border-b border-slate-100 px-4 py-3 hover:bg-slate-50 transition ${!notif.isRead ? "bg-indigo-50" : ""}`}
                                >
                                    <div className="flex gap-3">
                                        <span className="text-xl">🔔</span>
                                        <div className="flex-1">
                                            <p className={`text-sm ${!notif.isRead ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                                            <p className="text-xs text-slate-400 mt-1">{timeAgo(notif.createdAt)}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            {!notif.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notif._id)}
                                                    className="p-1 text-slate-400 hover:text-indigo-600 transition"
                                                    title="Mark as read"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notif._id)}
                                                className="p-1 text-slate-400 hover:text-red-600 transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t border-slate-200 px-4 py-2 text-center">
                        <a href="/dashboard/teacher/notifications" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                            View all notifications
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
