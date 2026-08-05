"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList } from "recharts";

export default function AnalyticsChart({ data }) {
  const gradients = [
    "url(#studentsGradient)",
    "url(#teachersGradient)",
    "url(#usersGradient)",
    "url(#coursesGradient)",
    "url(#categoriesGradient)",
  ];

  return (
    <div className="rounded-[26px] border border-white/10 bg-[#0b1220]/95 p-6 shadow-[0_24px_80px_-34px_rgba(2,8,23,0.94)]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300/80">Operational Overview</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">Platform Growth Snapshot</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">A polished view of your active users, teachers, courses, and categories.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          <span className="block font-semibold text-slate-100">Live metrics</span>
          <span className="text-slate-400">Soft gradients and crisp spacing.</span>
        </div>
      </div>

      <div className="h-80 rounded-2xl bg-[#070b14] p-4 ring-1 ring-white/10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 18, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="studentsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
              <linearGradient id="teachersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#0f766e" />
              </linearGradient>
              <linearGradient id="coursesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
              <linearGradient id="categoriesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1f2937" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip wrapperStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,0.16)", boxShadow: "0 24px 64px rgba(15,23,42,0.24)" }} contentStyle={{ background: "#0f172a", border: "none", color: "#e2e8f0" }} cursor={{ fill: "rgba(56,189,248,0.08)" }} />
            <Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={48} barSize={36} isAnimationActive animationDuration={900}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={gradients[index % gradients.length]} />
              ))}
              <LabelList dataKey="value" position="top" fill="#e2e8f0" fontSize={12} fontWeight={700} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}