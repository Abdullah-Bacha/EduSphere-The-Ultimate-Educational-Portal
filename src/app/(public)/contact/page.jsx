import ContactForm from "@/app/components/contact/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
    title: "Contact Us | LMS University",
    description:
        "Get in touch with LMS University. We'd love to hear from you about courses, enrollment, or any questions you have.",
};

export default function ContactPage() {
    return (
        <main className="pt-20">
            <section className="bg-[var(--text-primary)] text-white py-24">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl lg:text-6xl font-bold">Contact Us</h1>
                    <p className="mt-6 text-white/70 max-w-2xl mx-auto leading-relaxed text-lg">
                        Have a question about our courses or platform? Send us a message and our team will get back to you shortly.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-[var(--bg-main)]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 flex items-start gap-4 hover:shadow-card-hover transition-shadow">
                                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] shrink-0">
                                    <Phone size={22} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                        Phone
                                    </h3>
                                    <p className="text-[var(--text-secondary)] mt-1 text-sm">
                                        +92 300 1234567
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 flex items-start gap-4 hover:shadow-card-hover transition-shadow">
                                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] shrink-0">
                                    <Mail size={22} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                        Email
                                    </h3>
                                    <p className="text-[var(--text-secondary)] mt-1 text-sm">
                                        info@lmsuniversity.com
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 flex items-start gap-4 hover:shadow-card-hover transition-shadow">
                                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] shrink-0">
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                        Address
                                    </h3>
                                    <p className="text-[var(--text-secondary)] mt-1 text-sm">
                                        Takht Bhai, Mardan, Pakistan
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
