"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useMemo } from "react";

export default function CategoryChart({ categories }) {
    const data = useMemo(() => {
        const map = {};
        categories.forEach((cat) => {
            const d = new Date(cat.createdAt);
            const label = d.toLocaleString("default", { month: "short", year: "numeric" });
            map[label] = (map[label] || 0) + 1;
        });
        return Object.keys(map)
            .map((label) => ({ label, count: map[label] }))
            .sort((a, b) => new Date(a.label) - new Date(b.label));
    }, [categories]);

    return (
        <div className="bg-white rounded-xl shadow p-6 h-80">
            <h3 className="text-lg font-semibold mb-2">Categories Over Time</h3>
            {data.length === 0 ? (
                <p className="text-gray-500 text-sm">No data to display.</p>
            ) : (
                <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" tick={{ fill: "#475569" }} />
                            <YAxis allowDecimals={false} tick={{ fill: "#475569" }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}