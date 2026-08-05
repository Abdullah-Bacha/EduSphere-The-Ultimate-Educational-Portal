"use client";

import { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function AdminTrendsChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/trends", { cache: "no-store" })
            .then(r => r.json())
            .then(d => {
                if (d.success) setData(d.result.trend);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="rounded-[26px] border border-white/10 bg-[#0b1220]/95 p-6 shadow-[0_24px_80px_-34px_rgba(2,8,23,0.94)]">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300/80">6-Month Trend</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white flex items-center gap-2">
                        <TrendingUp size={20} className="text-emerald-400" />
                        Growth Over Time
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Monthly new students, teachers, courses, and certificates issued.</p>
                </div>
            </div>

            <div className="h-72 rounded-2xl bg-[#070b14] p-4 ring-1 ring-white/10">
                {loading ? (
                    <div className="flex h-full items-center justify-center text-slate-500 text-sm">Loading trend data…</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 18, left: 0, bottom: 8 }}>
                            <CartesianGrid stroke="#1f2937" strokeDasharray="4 4" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 10, color: "#e2e8f0" }}
                                cursor={{ stroke: "rgba(148,163,184,0.1)" }}
                            />
                            <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                            <Line type="monotone" dataKey="students" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 4, fill: "#22d3ee" }} name="New Students" />
                            <Line type="monotone" dataKey="teachers" stroke="#c084fc" strokeWidth={2.5} dot={{ r: 4, fill: "#c084fc" }} name="New Teachers" />
                            <Line type="monotone" dataKey="courses" stroke="#60a5fa" strokeWidth={2.5} dot={{ r: 4, fill: "#60a5fa" }} name="New Courses" />
                            <Line type="monotone" dataKey="certificates" stroke="#34d399" strokeWidth={2.5} dot={{ r: 4, fill: "#34d399" }} name="Certificates" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
