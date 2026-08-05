import Link from "next/link";

import { Mail, Phone, MapPin } from "lucide-react";

import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaXTwitter,
} from "react-icons/fa6";

import NewsletterForm from "./NewsletterForm";

export default function FooterSection() {
    return (
        <footer className="bg-slate-900 text-white">

            <div className="max-w-7xl mx-auto px-6 py-20">

                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">

                    {/* Logo */}

                    <div>

                        <h2 className="text-3xl font-bold text-blue-400">
                            LMS University
                        </h2>

                        <p className="mt-5 text-gray-400 leading-7">

                            A modern learning management system designed to
                            provide quality education with experienced teachers
                            and professional courses.

                        </p>

                    </div>

                    {/* Quick Links */}

                    <div>

                        <h3 className="text-xl font-semibold mb-6">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">
                            {[
                                { label: "Home", href: "/" },
                                { label: "About", href: "/about" },
                                { label: "Courses", href: "/courses" },
                                { label: "Teachers", href: "/teachers" },
                                { label: "Contact", href: "/contact" },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="text-gray-400 hover:text-blue-400 transition text-sm">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                    </div>

                    {/* Contact */}

                    <div>

                        <h3 className="text-xl font-semibold mb-6">
                            Contact
                        </h3>

                        <ul className="space-y-4">

                            <li className="flex items-center gap-3">

                                <Phone size={18} />

                                +92 300 1234567

                            </li>

                            <li className="flex items-center gap-3">

                                <Mail size={18} />

                                info@lmsuniversity.com

                            </li>

                            <li className="flex items-start gap-3">

                                <MapPin size={18} />

                                Takht Bhai, Mardan, Pakistan

                            </li>

                        </ul>

                    </div>

                    {/* Social */}

                   {/* Social */}

<div>

    <h3 className="text-xl font-semibold mb-6">
        Follow Us
    </h3>

    <div className="flex gap-4">

        <a
            href="#"
            className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center"
        >
            <FaFacebookF />
        </a>

        <a
            href="#"
            className="w-11 h-11 rounded-full bg-pink-600 hover:bg-pink-700 transition flex items-center justify-center"
        >
            <FaInstagram />
        </a>

        <a
            href="#"
            className="w-11 h-11 rounded-full bg-black hover:bg-gray-800 transition flex items-center justify-center"
        >
            <FaXTwitter />
        </a>

        <a
            href="https://linkedin.com/in/abdullah-bacha"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-blue-800 hover:bg-blue-900 transition flex items-center justify-center"
        >
            <FaLinkedinIn />
        </a>

    </div>

</div>

                    {/* Newsletter */}
                    <NewsletterForm />

                </div>

                <div className="border-t border-slate-700 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center text-gray-400">

                    <p>
                        © {new Date().getFullYear()} LMS University.
                        All Rights Reserved.
                    </p>

                    <div className="flex gap-6 text-sm">
                        <Link href="/privacy-policy" className="hover:text-blue-400 transition">
                            Privacy Policy
                        </Link>
                        <Link href="/terms-of-service" className="hover:text-blue-400 transition">
                            Terms of Service
                        </Link>
                    </div>

                </div>

            </div>

        </footer>
    );
}