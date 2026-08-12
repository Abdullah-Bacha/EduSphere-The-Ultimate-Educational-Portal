import Link from "next/link";

import { Mail, Phone, MapPin } from "lucide-react";

import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaXTwitter,
} from "react-icons/fa6";

import NewsletterForm from "./NewsletterForm";
import { getWebsiteSettings } from "@/services/websiteSettingService";

export default async function FooterSection() {
    const settings = await getWebsiteSettings();

    return (
        <footer className="bg-[var(--sidebar-bg)] text-white">

            <div className="max-w-7xl mx-auto px-6 py-20">

                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">

                    {/* Logo */}

                    <div>

                        <h2 className="text-3xl font-bold text-[var(--accent)]">
                            {settings.siteName}
                        </h2>

                        <p className="mt-5 text-white/60 leading-7">

                            {settings.footerDescription}

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
                                    <Link href={href} className="text-white/60 hover:text-[var(--accent)] transition text-sm">
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

                                {settings.contactPhone}

                            </li>

                            <li className="flex items-center gap-3">

                                <Mail size={18} />

                                {settings.contactEmail}

                            </li>

                            <li className="flex items-start gap-3">

                                <MapPin size={18} />

                                {settings.contactAddress}

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
            href={settings.socialFacebook || "#"}
            target={settings.socialFacebook ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center"
        >
            <FaFacebookF />
        </a>

        <a
            href={settings.socialInstagram || "#"}
            target={settings.socialInstagram ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-pink-600 hover:bg-pink-700 transition flex items-center justify-center"
        >
            <FaInstagram />
        </a>

        <a
            href={settings.socialTwitter || "#"}
            target={settings.socialTwitter ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-black hover:bg-gray-800 transition flex items-center justify-center"
        >
            <FaXTwitter />
        </a>

        <a
            href={settings.socialLinkedin || "#"}
            target={settings.socialLinkedin ? "_blank" : undefined}
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
                        © {new Date().getFullYear()} {settings.siteName}.
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