export default function StatCard({
    title,
    value,
    icon
}) {
    const accent = {
        Students: "from-cyan-500 to-sky-500",
        Teachers: "from-violet-500 to-fuchsia-500",
        Users: "from-emerald-500 to-teal-500",
        Courses: "from-sky-500 to-indigo-500",
        Categories: "from-amber-500 to-orange-500",
    }[title] || "from-slate-500 to-slate-600";

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/95 p-5 shadow-[0_24px_70px_-30px_rgba(2,8,23,0.9)] transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_28px_80px_-32px_rgba(14,165,233,0.35)]">
            <div className={`absolute -right-8 top-4 h-24 w-24 rounded-full bg-linear-to-br ${accent} opacity-20 blur-3xl`} />
            <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{title}</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-white">{value}</h2>
                </div>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br ${accent} text-white shadow-[0_16px_40px_-20px_rgba(15,23,42,0.65)]`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}