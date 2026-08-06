"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicNavigation } from "@/app/constants/navigation";
import { useState } from "react";
import {
    GraduationCap,
    LogIn,
    UserPlus,
    Menu,
    X,
} from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function PublicNavbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">

            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                        <GraduationCap size={24} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            EduLMS
                        </h1>

                        <p className="text-xs text-slate-500">
                            Learning Management System
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {publicNavigation.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`text-sm font-medium transition-colors ${pathname === item.href
                                    ? "text-blue-600"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Buttons */}
                <div className="hidden lg:flex items-center gap-3">

                    <Link
                        href="/login"
                        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <LogIn size={18} />
                        Login
                    </Link>

                    <Link
                        href="/register"
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <UserPlus size={18} />
                        Register
                    </Link>

                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

            </div>

            {/* Mobile Menu */}
            {isMenuOpen && <MobileMenu />}

        </header>
    );
}