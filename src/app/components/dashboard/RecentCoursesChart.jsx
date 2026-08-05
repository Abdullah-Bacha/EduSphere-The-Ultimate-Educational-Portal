"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function RecentCoursesChart({ courses }) {
    const data = courses.map((course) => ({
        label: course.title.length > 12 ? `${course.title.slice(0, 12)}...` : course.title,
        value: 1,
        category: course.category,
    }));

    return (
        <div className="rounded-[28px] border border-white/10 bg-[#111827]/90 p-6 shadow-[0_24px_80px_-34px_rgba(15,23,42,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_90px_-32px_rgba(15,23,42,0.75)]">
            <div className="mb-5">
                <h2 className="text-lg font-semibold tracking-[-0.01em] text-white">Recent Courses</h2>
                <p className="mt-1 text-sm text-slate-400">Latest content published across the platform.</p>
            </div>
            <div className="h-72 rounded-[22px] bg-[#0b1120] p-4 ring-1 ring-white/10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip wrapperStyle={{ borderRadius: 16, border: '1px solid rgba(148,163,184,0.16)', boxShadow: '0 14px 40px rgba(15,23,42,0.14)' }} contentStyle={{ background: '#0f172a', border: 'none', color: '#e2e8f0' }} cursor={{ fill: 'rgba(14,165,233,0.08)' }} />
                        <Bar dataKey="value" fill="#38bdf8" radius={[12, 12, 0, 0]} maxBarSize={42} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
