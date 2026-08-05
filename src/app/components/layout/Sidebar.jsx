"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    X,
    ShieldCheck,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import {
    adminNavigation,
    teacherNavigation,
    studentNavigation,
} from "@/app/constants/navigation";

const menuItems = {
    admin: adminNavigation,
    teacher: teacherNavigation,
    student: studentNavigation,
};

const roleGradient = {
    admin: "from-amber-400 via-orange-500 to-rose-500",
    teacher: "from-indigo-500 via-violet-500 to-fuchsia-500",
    student: "from-emerald-500 via-cyan-500 to-sky-500",
};

export default function Sidebar({ user, onClose }) {
    const pathname = usePathname();
    const menus = menuItems[user?.role] || [];
    const gradient = roleGradient[user?.role] || roleGradient.student;
    const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="flex h-full flex-col overflow-hidden border-r border-white/10 bg-[#0B0F19] text-slate-100">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0B0F19]/90 px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 shadow-[0_10px_30px_-10px_rgba(99,102,241,0.7)]">
                        <ShieldCheck size={15} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold tracking-[-0.02em] text-white">LMS Portal</p>
                    </div>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-sm font-semibold text-white shadow-lg shadow-slate-950/30`}>{initial}</div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white md:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
                {menus.map((menu) => {
                    const Icon = menu.icon;
                    const isActive =
                        pathname === menu.href ||
                        (menu.href !== "/dashboard/teacher" &&
                            menu.href !== "/dashboard/student" &&
                            menu.href !== "/dashboard/admin" &&
                            pathname.startsWith(menu.href));

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`group flex items-center justify-between rounded-[12px] px-3 py-2 text-sm transition-all duration-200 ${isActive ? "bg-[#111827] text-white shadow-[inset_2px_0_0_#818cf8]" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                        >
                            <span className="flex items-center gap-2.5">
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-indigo-500/15 text-indigo-300" : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-slate-200"}`}>
                                    <Icon size={14} strokeWidth={1.6} />
                                </span>
                                <span className="font-medium">{menu.name}</span>
                            </span>
                            {isActive ? <ChevronRight size={14} className="text-slate-400" /> : null}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}