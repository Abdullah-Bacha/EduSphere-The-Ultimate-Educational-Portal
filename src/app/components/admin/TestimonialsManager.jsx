"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Star, CheckCircle2 } from "lucide-react";

const EMPTY_FORM = { name: "", role: "Student", message: "", rating: 5, approved: true };

export default function TestimonialsManager() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(EMPTY_FORM);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/admin/testimonials", { cache: "no-store" });
        const data = await res.json();
        if (data.success) setItems(data.result);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleCreate(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                setForm(EMPTY_FORM);
                setShowForm(false);
                load();
            }
        } finally {
            setSaving(false);
        }
    }

    async function toggleApproved(item) {
        await fetch(`/api/admin/testimonials/${item._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ approved: !item.approved }),
        });
        load();
    }

    async function handleDelete(id) {
        await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl">
            <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Student Testimonials</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Shown on the homepage and about page. Only approved testimonials appear publicly.</p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowForm((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors"
                >
                    <Plus size={14} /> Add
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="p-7 border-b border-gray-100 space-y-4 bg-gray-50/50">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input
                            required
                            placeholder="Student name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                        />
                        <input
                            placeholder="Role (e.g. Web Development Student)"
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                        />
                    </div>
                    <textarea
                        required
                        placeholder="Testimonial message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                    />
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            Rating
                            <select
                                value={form.rating}
                                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                            >
                                {[5, 4, 3, 2, 1].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.approved}
                                onChange={(e) => setForm({ ...form, approved: e.target.checked })}
                                className="rounded border-gray-300 text-indigo-600"
                            />
                            Publish immediately
                        </label>
                        <button
                            type="submit"
                            disabled={saving}
                            className="ml-auto inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {saving && <Loader2 size={14} className="animate-spin" />}
                            Save
                        </button>
                    </div>
                </form>
            )}

            <div className="divide-y divide-gray-100">
                {loading ? (
                    <div className="p-7 text-sm text-gray-400">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="p-7 text-sm text-gray-400">No testimonials yet.</div>
                ) : (
                    items.map((item) => (
                        <div key={item._id} className="p-5 flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                                    <span className="text-xs text-gray-400">{item.role}</span>
                                    {item.approved ? (
                                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            <CheckCircle2 size={11} /> Published
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Hidden</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                                <div className="flex text-amber-400 mt-1">
                                    {Array.from({ length: item.rating }).map((_, i) => (
                                        <Star key={i} size={12} fill="currentColor" />
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => toggleApproved(item)}
                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                                >
                                    {item.approved ? "Unpublish" : "Publish"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item._id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    aria-label="Delete"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
