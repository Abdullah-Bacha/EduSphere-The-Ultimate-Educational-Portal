"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children, user }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dashboard-root">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-950/55 backdrop-blur-[2px] md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`sidebar-panel ${sidebarOpen ? "open" : ""}`}>
                <Sidebar user={user} onClose={() => setSidebarOpen(false)} />
            </aside>

            <div className="content-panel">
                <Navbar user={user} onMenuClick={() => setSidebarOpen(true)} />
                <main className="content-main">
                    <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
