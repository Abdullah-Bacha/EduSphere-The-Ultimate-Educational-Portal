"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadNotifications() {
        try {
            const res = await fetch("/api/student/notifications");
            const data = await res.json();
            if (data.success) {
                setNotifications(data.result);
            } else {
                setError(data.message || "Failed to load notifications");
            }
        } catch (err) {
            setError("An error occurred while fetching notifications.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadNotifications();
    }, []);

    async function handleMarkRead(id) {
        try {
            const res = await fetch("/api/student/notifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId: id }),
            });
            const data = await res.json();
            if (data.success) {
                setNotifications(prev =>
                    prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
                );
            }
        } catch (err) {
            console.error("Error marking read:", err);
        }
    }

    async function handleMarkAllRead() {
        try {
            const res = await fetch("/api/student/notifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAll: true }),
            });
            const data = await res.json();
            if (data.success) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            }
        } catch (err) {
            console.error("Error marking all read:", err);
        }
    }

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) {
        return (
            <div className="p-6 animate-pulse space-y-4">
                <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-slate-200 rounded-xl"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="text-sm bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                                {unreadCount} New
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Keep track of your course announcements and activity alerts.</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors self-start sm:self-auto"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                    <div className="text-5xl mb-4">🔔</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">All caught up!</h3>
                    <p className="text-slate-500">You don't have any notifications at the moment.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-5 flex gap-4 transition-colors hover:bg-slate-50/50 ${
                                !notification.isRead ? "bg-blue-50/30" : ""
                            }`}
                        >
                            <div className="flex-grow space-y-1">
                                <div className="flex items-center gap-2">
                                    <h4 className={`text-base ${!notification.isRead ? "font-bold text-slate-800" : "font-semibold text-slate-700"}`}>
                                        {notification.title}
                                    </h4>
                                    {!notification.isRead && (
                                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                    )}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">{notification.message}</p>
                                <div className="text-xs text-slate-400 font-semibold pt-1">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </div>
                            </div>
                            {!notification.isRead && (
                                <button
                                    onClick={() => handleMarkRead(notification._id)}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 shrink-0 self-start"
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
