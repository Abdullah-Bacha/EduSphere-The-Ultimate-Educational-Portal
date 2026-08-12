"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";

const EMPTY_FORM = { name: "", title: "", quote: "", image: "", order: 0 };

export default function LeadersManager() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(EMPTY_FORM);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/admin/leaders", { cache: "no-store" });
        const data = await res.json();
        if (data.success) setItems(data.result);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) setForm((f) => ({ ...f, image: data.result.url }));
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/leaders", {
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

    async function handleDelete(id) {
        await fetch(`/api/admin/leaders/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl">
            <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">Global Leaders</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Shown in the leadership carousel on the about page.</p>
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
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 shrink-0 rounded-xl border border-dashed border-gray-300 bg-white flex items-center justify-center overflow-hidden">
                            {form.image ? (
                                <img src={form.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <Upload size={16} className="text-gray-300" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={uploading}
                            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                        >
                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                            {uploading ? "Uploading..." : "Upload photo"}
                        </button>
                        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input
                            required
                            placeholder="Full name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                        />
                        <input
                            required
                            placeholder="Title (e.g. Chairman)"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                        />
                    </div>
                    <textarea
                        placeholder="Quote"
                        value={form.quote}
                        onChange={(e) => setForm({ ...form, quote: e.target.value })}
                        rows={2}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                    />
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            Order
                            <input
                                type="number"
                                value={form.order}
                                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                                className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                            />
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
                    <div className="p-7 text-sm text-gray-400">No leaders yet.</div>
                ) : (
                    items.map((item) => (
                        <div key={item._id} className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-gray-100">
                                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-400">{item.title}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleDelete(item._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                                aria-label="Delete"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
