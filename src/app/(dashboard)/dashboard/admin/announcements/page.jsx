"use client";

import { useEffect, useState } from "react";
import AnnouncementForm from "@/app/components/announcements/AnnouncementForm";
import { Bell, Users, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminAnnouncementsPage() {
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        async function loadHistory() {
            setLoadingHistory(true);
            try {
                const res = await fetch("/api/announcements", { cache: "no-store" });
                const data = await res.json();
                if (data.success) setHistory(data.result || []);
            } catch (err) {
                console.error("Failed to load announcement history:", err);
            } finally {
                setLoadingHistory(false);
            }
        }
        loadHistory();
    }, [refreshKey]);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Announcements</h1>
                <p className="mt-1 text-gray-500">
                    Broadcast a notification to students and teachers.
                </p>
            </div>

            <AnnouncementForm onSent={() => setRefreshKey(k => k + 1)} />

            {/* Sent History */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Bell size={20} />
                    Sent Announcements
                </h2>

                {loadingHistory ? (
                    <div className="space-y-3 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-slate-200 rounded-xl" />
                        ))}
                    </div>
                ) : history.length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-slate-200 p-10 text-center text-slate-400">
                        <Bell size={32} className="mx-auto mb-3 opacity-40" />
                        <p className="font-medium">No announcements sent yet.</p>
                        <p className="text-sm mt-1">Use the form above to send your first announcement.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.message}</p>
                                        {item.link && (
                                            <p className="text-xs text-indigo-500 mt-1 truncate">Link: {item.link}</p>
                                        )}
                                    </div>
                                    <div className="shrink-0 text-right space-y-1">
                                        <div className="flex items-center gap-1 text-xs text-slate-500 justify-end">
                                            <Users size={12} />
                                            <span>{item.recipientCount} recipient{item.recipientCount !== 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-400 justify-end">
                                            <Clock size={12} />
                                            <span>{new Date(item.sentAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
