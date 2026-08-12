import Link from "next/link";
import Container from "@/app/components/ui/Container";
import ContactInfo from "@/app/components/contact/ContactInfo";
import ContactForm from "@/app/components/contact/ContactForm";
import ContactMap from "@/app/components/contact/ContactMap";
import CTASection from "@/app/components/home/CTASection";
import FooterSection from "@/app/components/home/FooterSection";
import { MessageCircle, ChevronRight, Clock, Phone, Mail, BookOpen, HelpCircle } from "lucide-react";
import { getWebsiteSettings } from "@/services/websiteSettingService";

export const metadata = {
    title: "Contact Us | LMS University",
    description:
        "Get in touch with LMS University. We'd love to hear from you about courses, enrollment, or any questions you have.",
};

export default async function ContactPage() {
    const settings = await getWebsiteSettings();

    const quickFacts = [
        { icon: Clock, label: "Respond within 1 business day" },
        { icon: Phone, label: settings.contactPhone },
        { icon: Mail, label: settings.contactEmail },
    ];

    return (
        <main>
            {/* Hero */}
            <section
                className="relative overflow-hidden"
                style={{
                    backgroundImage:
                        "linear-gradient(161deg, #eef2ff 0%, #eef3ff 10%, #eff4ff 30%, #f0f6ff 50%, #eef6fe 62%, #ecf6fe 75%, #eaf5fd 87%, #e8f4fd 100%)",
                }}
            >
                <div className="absolute -left-24 -top-24 w-80 h-80 rounded-full bg-blue-200/40 blur-[64px]" />
                <div className="absolute right-[-72px] top-[260px] w-80 h-80 rounded-full bg-indigo-200/40 blur-[64px]" />
                <div
                    className="absolute right-8 top-8 w-40 h-40 opacity-40 hidden md:block"
                    style={{
                        backgroundImage: "radial-gradient(circle, #93c5fd 1.5px, transparent 1.5px)",
                        backgroundSize: "16px 16px",
                    }}
                />

                <Container className="relative py-20">
                    <nav className="flex items-center gap-2 text-sm mb-6">
                        <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
                            Home
                        </Link>
                        <ChevronRight size={14} className="text-gray-400" />
                        <span className="text-blue-600 font-semibold">Contact Us</span>
                    </nav>

                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold shadow-sm">
                            <MessageCircle size={16} />
                            Get In Touch
                        </span>

                        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                            Contact{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                Us
                            </span>
                        </h1>

                        <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-xl">
                            Have a question about our courses or platform? Send us a message and our team will get back to you shortly.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-10">
                        {quickFacts.map((fact) => {
                            const Icon = fact.icon;
                            return (
                                <span
                                    key={fact.label}
                                    className="inline-flex items-center gap-2 bg-white/80 border border-white rounded-[14px] px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
                                >
                                    <Icon size={16} className="text-blue-600" />
                                    {fact.label}
                                </span>
                            );
                        })}
                    </div>
                </Container>
            </section>

            {/* Info + Form */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-14 items-start">
                        <ContactInfo />
                        <ContactForm />
                    </div>
                </Container>
            </section>

            <ContactMap />

            <CTASection
                badge="Quick Help"
                title="Need Help With a Course?"
                description="Explore our courses or connect with our support team to find the right learning option for you."
                primaryHref="/courses"
                primaryLabel="Explore Courses"
                primaryIcon={BookOpen}
                secondaryHref="/courses#faq"
                secondaryLabel="View FAQ"
                secondaryIcon={HelpCircle}
                background="bg-gradient-to-br from-blue-600 to-indigo-700"
            />

            <FooterSection />
        </main>
    );
}
