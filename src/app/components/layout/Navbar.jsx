"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LogOut, Bell, Menu, ChevronDown, User, Search, Sparkles, Sun, Moon } from "lucide-react";

/* ── Breadcrumb label map ── */
const PAGE_LABELS = {
    "/dashboard/teacher":              "Dashboard",
    "/dashboard/teacher/courses":      "My Courses",
    "/dashboard/teacher/students":     "Students",
    "/dashboard/teacher/lessons":      "Lessons",
    "/dashboard/teacher/assignments":  "Assignments",
    "/dashboard/teacher/quizzes":      "Quizzes",
    "/dashboard/teacher/notifications":"Notifications",
    "/dashboard/teacher/messages":     "Messages",
    "/dashboard/teacher/analytics":    "Analytics & Reports",
    "/dashboard/teacher/profile":      "My Profile",
    "/dashboard/teacher/settings":     "Settings",
    "/dashboard/student":              "Dashboard",
    "/dashboard/student/my-courses":   "My Courses",
    "/dashboard/student/lessons":      "Lessons",
    "/dashboard/student/assignments":  "Assignments",
    "/dashboard/student/quizzes":      "Quizzes",
    "/dashboard/student/progress":     "Progress",
    "/dashboard/student/certificates": "Certificates",
    "/dashboard/student/notifications":"Notifications",
    "/dashboard/student/messages":     "Messages",
    "/dashboard/student/feedback":     "Feedback",
    "/dashboard/student/profile":      "Profile",
    "/dashboard/admin":                "Dashboard",
    "/dashboard/students":             "Students",
    "/dashboard/teachers":             "Teachers",
    "/dashboard/courses":              "Courses",
    "/dashboard/admin/categories":     "Categories",
    "/dashboard/admin/testimonials":   "Testimonials",
    "/dashboard/settings":             "Settings",
};

function getPageLabel(pathname) {
    if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
    // Dynamic route fallback
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    return last ? last.charAt(0).toUpperCase() + last.slice(1) : "Dashboard";
}

function getRoleBasePath(role) {
    if (role === "admin")   return "/dashboard/admin";
    if (role === "teacher") return "/dashboard/teacher";
    if (role === "student") return "/dashboard/student";
    return "/login";
}

/* ── Dark Mode Toggle ── */
function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const isDark = saved === "dark";
        setDark(isDark);
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    }, []);

    function toggle() {
        const next = !dark;
        setDark(next);
        document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
        localStorage.setItem("theme", next ? "dark" : "light");
    }

    return (
        <button
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#111827] text-slate-400 shadow-sm transition hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {dark ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
        </button>
    );
}

/* ── Notification Bell with badge ── */
function NotificationBell({ user }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!user?.role) return;

        async function fetchCount() {
            try {
                const res = await fetch("/api/notifications/unread-count", { cache: "no-store" });
                const data = await res.json();
                if (data.success) setCount(data.result?.count ?? 0);
            } catch {}
        }

        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, [user?.role]);

    const href = user?.role ? `${getRoleBasePath(user.role)}/notifications` : "#";

    return (
        <Link
            href={href}
            className="navbar-icon-btn relative flex h-10 w-10 items-center justify-center rounded-2xl border transition hover:-translate-y-0.5"
            style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text-secondary)",
            }}
            title="Notifications"
        >
            <Bell size={16} strokeWidth={1.75} />
            {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: "var(--accent)" }}>
                    {count > 9 ? "9+" : count}
                </span>
            )}
        </Link>
    );
}

/* ── User Dropdown ── */
function UserDropdown({ user, onLogout, loading }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen(!open)}
                className="navbar-user-btn flex items-center gap-2 rounded-2xl border px-2.5 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--surface)",
                }}
            >
                {/* Mini Avatar */}
                <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[0.75rem] font-bold text-white"
                    style={{
                        background: "linear-gradient(135deg, var(--accent), var(--accent-hover))"
                    }}
                >
                    {initial}
                </div>

                {/* Name + Role */}
                <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{user?.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--accent)", letterSpacing: "0.05em" }}>{user?.role}</p>
                </div>

                <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className="text-slate-400 transition"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        width: 220,
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        boxShadow: "0 8px 24px -4px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)",
                        zIndex: 100,
                        overflow: "hidden",
                    }}
                >
                    {/* User Info Header */}
                    <div
                        style={{
                            padding: "14px 16px 12px",
                            borderBottom: "1px solid var(--border-subtle)",
                            backgroundColor: "#f1f5f9"
                        }}
                    >
                        <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                            {user?.name}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: 2, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                            {user?.role}
                        </p>
                    </div>

                    {/* Links */}
                    <div style={{ padding: "6px" }}>
                        <Link
                            href={`${getRoleBasePath(user?.role)}/profile`}
                            onClick={() => setOpen(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "8px 10px",
                                borderRadius: 8,
                                fontSize: "0.8125rem",
                                fontWeight: 500,
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                transition: "all 150ms ease",
                            }}
                            className="dropdown-item hover:bg-[var(--accent-light)]"
                        >
                            <User size={14} strokeWidth={1.75} />
                            My Profile
                        </Link>

                        <Link
                            href={`${getRoleBasePath(user?.role)}/settings`}
                            onClick={() => setOpen(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "8px 10px",
                                borderRadius: 8,
                                fontSize: "0.8125rem",
                                fontWeight: 500,
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                transition: "all 150ms ease",
                            }}
                            className="dropdown-item hover:bg-[var(--accent-light)]"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                            Settings
                        </Link>
                    </div>

                    {/* Logout */}
                    <div style={{ padding: "6px", borderTop: "1px solid var(--border-subtle)" }}>
                        <button
                            onClick={() => { setOpen(false); onLogout(); }}
                            disabled={loading}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "8px 10px",
                                borderRadius: 8,
                                fontSize: "0.8125rem",
                                fontWeight: 500,
                                color: "#ef4444",
                                background: "transparent",
                                border: "none",
                                width: "100%",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.6 : 1,
                                transition: "all 150ms ease",
                                textAlign: "left",
                            }}
                            className="dropdown-item-danger hover:bg-red-50"
                        >
                            <LogOut size={14} strokeWidth={1.75} />
                            {loading ? "Signing out…" : "Sign out"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Search Bar Component ── */
function SearchBar({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        const role = user?.role || "teacher";
        const basePath = `/dashboard/${role}`;

        // Route based on role and content
        if (role === "teacher") {
            if (searchQuery.toLowerCase().includes("student")) {
                router.push(`${basePath}/students?search=${searchQuery}`);
            } else if (searchQuery.toLowerCase().includes("grade")) {
                router.push(`${basePath}/grade-book?search=${searchQuery}`);
            } else if (searchQuery.toLowerCase().includes("announce")) {
                router.push(`${basePath}/announcements?search=${searchQuery}`);
            } else {
                router.push(`${basePath}/courses?search=${searchQuery}`);
            }
        }

        setSearchQuery("");
        setIsOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:text-white sm:flex cursor-pointer"
            >
                <Search size={14} />
                <span>{isOpen ? "Type to search..." : "Search anything"}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#111827] p-3 shadow-lg z-50">
                    <form onSubmit={handleSearch}>
                        <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-[#0f172a] px-3 py-2">
                            <Search size={14} className="text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses, students, grades..."
                                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                                autoFocus
                            />
                        </div>
                        <div className="mt-3 space-y-2 text-xs text-slate-400">
                            <p>Try searching for:</p>
                            <ul className="space-y-1 ml-2">
                                <li>• "student" - search students</li>
                                <li>• "grade" - go to grade book</li>
                                <li>• "announce" - go to announcements</li>
                                <li>• Course name - search courses</li>
                            </ul>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

/* ── Main Navbar ── */
export default function Navbar({ user, onMenuClick }) {
    const router   = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    const pageLabel = getPageLabel(pathname);

    async function handleLogout() {
        setLoading(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#0f172a]/80 px-4 shadow-[0_20px_40px_-24px_rgba(2,8,23,0.9)] backdrop-blur-xl sm:px-6 lg:px-8">

                <div className="flex min-w-0 items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#111827] text-slate-300 shadow-sm transition hover:-translate-y-0.5 hover:border-white/20 hover:text-white md:hidden"
                        aria-label="Open sidebar"
                    >
                        <Menu size={16} strokeWidth={2} />
                    </button>

                    <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                            <Sparkles size={12} />
                            <span>Workspace</span>
                        </div>
                        <h1 className="truncate text-base font-semibold tracking-[-0.02em] text-white">
                            {pageLabel}
                        </h1>
                    </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                    <SearchBar user={user} />
                    <ThemeToggle />
                    <NotificationBell user={user} />
                    <UserDropdown user={user} onLogout={handleLogout} loading={loading} />
                </div>
            </header>
        </>
    );
}