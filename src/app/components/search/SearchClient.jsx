"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    Search,
    Users,
    GraduationCap,
    BookOpen,
    FolderOpen,
    Loader2,
} from "lucide-react";

const GROUPS = [
    {
        key: "students",
        label: "Students",
        icon: Users,
        href: (item) => `/dashboard/students/view/${item._id}`,
        primary: (i) => i.name,
        secondary: (i) => i.email,
    },
    {
        key: "teachers",
        label: "Teachers",
        icon: GraduationCap,
        href: (item) => `/dashboard/teachers/view/${item._id}`,
        primary: (i) => i.name,
        secondary: (i) => i.email,
    },
    {
        key: "courses",
        label: "Courses",
        icon: BookOpen,
        href: (item) => `/dashboard/courses/view/${item._id}`,
        primary: (i) => i.title,
        secondary: (i) => `${i.category} · ${i.instructor}`,
    },
    {
        key: "categories",
        label: "Categories",
        icon: FolderOpen,
        href: (item) => `/dashboard/admin/categories/edit/${item._id}`,
        primary: (i) => i.name,
        secondary: () => "Category",
    },
];

export default function SearchClient() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        const term = query.trim();

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!term) {
            debounceRef.current = setTimeout(() => {
                setResults(null);
                setLoading(false);
            }, 0);
            return () => {
                if (debounceRef.current) clearTimeout(debounceRef.current);
            };
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/admin/search?q=${encodeURIComponent(term)}`
                );
                const data = await res.json();
                setResults(data.result || null);
            } catch {
                setResults(null);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    const totalCount = results
        ? GROUPS.reduce((sum, g) => sum + (results[g.key]?.length || 0), 0)
        : 0;

    return (
        <div className="space-y-5">
            <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Start typing to search…"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-11 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                {loading && (
                    <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                )}
            </div>

            {results && !loading && totalCount === 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                    <p className="text-sm font-semibold text-gray-900">
                        No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Try a different name, email, or keyword.
                    </p>
                </div>
            )}

            {results && totalCount > 0 && (
                <div className="grid gap-5 md:grid-cols-2">
                    {GROUPS.map((group) => {
                        const items = results[group.key] || [];
                        if (items.length === 0) return null;
                        const Icon = group.icon;
                        return (
                            <div
                                key={group.key}
                                className="rounded-2xl border border-gray-100 bg-white shadow-sm"
                            >
                                <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3">
                                    <Icon size={16} className="text-gray-400" />
                                    <span className="text-sm font-semibold text-gray-900">
                                        {group.label}
                                    </span>
                                    <span className="ml-auto text-xs text-gray-400">
                                        {items.length}
                                    </span>
                                </div>
                                <ul className="divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <li key={item._id}>
                                            <Link
                                                href={group.href(item)}
                                                className="flex flex-col px-5 py-3 transition hover:bg-gray-50"
                                            >
                                                <span className="text-sm font-medium text-gray-900">
                                                    {group.primary(item)}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {group.secondary(item)}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            )}

            {!results && !loading && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 p-12 text-center">
                    <Search className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                    <p className="text-sm text-gray-500">
                        Search across students, teachers, courses, and categories.
                    </p>
                </div>
            )}
        </div>
    );
}
