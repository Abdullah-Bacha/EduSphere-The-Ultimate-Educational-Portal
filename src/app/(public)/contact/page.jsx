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
            <section className="bg-slate-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold">Contact Us</h1>
                    <p className="mt-5 text-slate-300 max-w-2xl mx-auto">
                        Have a question about our courses or platform? Send us
                        a message and our team will get back to you shortly.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-2xl shadow p-6 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <Phone size={22} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        Phone
                                    </h3>
                                    <p className="text-slate-600 mt-1">
                                        +92 300 1234567
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow p-6 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <Mail size={22} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        Email
                                    </h3>
                                    <p className="text-slate-600 mt-1">
                                        info@lmsuniversity.com
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow p-6 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        Address
                                    </h3>
                                    <p className="text-slate-600 mt-1">
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
