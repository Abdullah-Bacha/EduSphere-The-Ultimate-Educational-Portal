import { Users, GraduationCap, BookOpen, CircleDollarSign } from "lucide-react";

export default function DashboardCards({ stats }) {
    const cards = [
        {
            title: "Total Students",
            value: stats.totalStudents,
            icon: Users,
            accent: "from-emerald-500 to-cyan-500",
        },
        {
            title: "Total Teachers",
            value: stats.totalTeachers,
            icon: GraduationCap,
            accent: "from-violet-500 to-fuchsia-500",
        },
        {
            title: "Total Courses",
            value: "0",
            icon: BookOpen,
            accent: "from-sky-500 to-indigo-500",
        },
        {
            title: "Revenue",
            value: "$0",
            icon: CircleDollarSign,
            accent: "from-amber-500 to-orange-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm transition transform hover:-translate-y-1 hover:shadow-md">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow`}>
                            <Icon size={20} />
                        </div>
                        <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                            {card.title}
                        </h2>
                        <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900">
                            {card.value}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}