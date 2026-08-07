"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Search, MessageSquare } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function StudentMessagesPage() {
    const { showToast } = useToast();
    const [contacts, setContacts] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [search, setSearch] = useState("");
    const [activeId, setActiveId] = useState(null);
    const [thread, setThread] = useState(null);
    const [loadingThread, setLoadingThread] = useState(false);
    const [draft, setDraft] = useState("");
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    async function loadContacts() {
        setLoadingContacts(true);
        try {
            const res = await fetch("/api/student/messages", { cache: "no-store" });
            const data = await res.json();
            if (data.success) {
                setContacts(data.data.contacts);
            }
        } catch (err) {
            console.error("Failed to load contacts:", err);
        } finally {
            setLoadingContacts(false);
        }
    }

    async function loadThread(teacherId) {
        setActiveId(teacherId);
        setLoadingThread(true);
        try {
            const res = await fetch(`/api/student/messages/${teacherId}`, { cache: "no-store" });
            const data = await res.json();
            if (data.success) {
                setThread(data.data);
                setContacts((prev) =>
                    prev.map((c) => (c._id === teacherId ? { ...c, unreadCount: 0 } : c))
                );
            } else {
                showToast(data.message || "Failed to load conversation", "error");
            }
        } catch (err) {
            showToast("Failed to load conversation", "error");
        } finally {
            setLoadingThread(false);
        }
    }

    useEffect(() => {
        (async () => {
            await loadContacts();
        })();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [thread]);

    async function handleSend(e) {
        e.preventDefault();
        if (!draft.trim() || !activeId) return;

        setSending(true);
        try {
            const res = await fetch(`/api/student/messages/${activeId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: draft.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setThread((prev) => ({ ...prev, messages: [...prev.messages, data.data] }));
                setDraft("");
                loadContacts();
            } else {
                showToast(data.message || "Failed to send message", "error");
            }
        } catch (err) {
            showToast("Failed to send message", "error");
        } finally {
            setSending(false);
        }
    }

    const filteredContacts = contacts.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
    );

    const formatTime = (date) =>
        new Date(date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

    return (
        <div className="h-[calc(100vh-8rem)] min-h-[560px] flex flex-col">
            <div className="mb-4">
                <h1 className="text-3xl font-bold text-slate-800">Messages</h1>
                <p className="text-slate-500 text-sm mt-1">Message your course instructors directly.</p>
            </div>

            <div className="flex flex-1 min-h-0 gap-4">
                <div className="w-full max-w-xs shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-slate-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search teachers..."
                                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loadingContacts ? (
                            <div className="p-6 text-center text-sm text-slate-400">Loading...</div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="p-6 text-center text-sm text-slate-400">No teachers found</div>
                        ) : (
                            filteredContacts.map((c) => (
                                <button
                                    key={c._id}
                                    onClick={() => loadThread(c._id)}
                                    className={`w-full text-left p-3 border-b border-slate-100 hover:bg-slate-50 transition ${
                                        activeId === c._id ? "bg-indigo-50" : ""
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-semibold text-sm text-slate-900 truncate">{c.name}</span>
                                        {c.unreadCount > 0 && (
                                            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                                                {c.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                        {c.lastMessage ? `${c.lastMessage.fromMe ? "You: " : ""}${c.lastMessage.content}` : "No messages yet"}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    {!activeId ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <MessageSquare size={40} />
                            <p className="mt-3 text-sm">Select a teacher to start messaging</p>
                        </div>
                    ) : loadingThread ? (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading conversation...</div>
                    ) : (
                        <>
                            <div className="p-4 border-b border-slate-200">
                                <h3 className="font-semibold text-slate-900">{thread?.teacher?.name}</h3>
                                <p className="text-xs text-slate-500">{thread?.teacher?.email}</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {thread?.messages?.length === 0 ? (
                                    <p className="text-center text-sm text-slate-400 mt-6">No messages yet. Say hello!</p>
                                ) : (
                                    thread?.messages?.map((m) => (
                                        <div key={m._id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                                                    m.fromMe
                                                        ? "bg-indigo-600 text-white rounded-br-sm"
                                                        : "bg-slate-100 text-slate-800 rounded-bl-sm"
                                                }`}
                                            >
                                                <p className="whitespace-pre-wrap">{m.content}</p>
                                                <p className={`mt-1 text-[10px] ${m.fromMe ? "text-indigo-200" : "text-slate-400"}`}>
                                                    {formatTime(m.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={bottomRef} />
                            </div>
                            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !draft.trim()}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm disabled:opacity-50"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
