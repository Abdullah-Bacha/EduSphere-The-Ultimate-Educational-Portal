import { Phone, Mail, MapPin, GraduationCap } from "lucide-react";
import { getWebsiteSettings } from "@/services/websiteSettingService";

export default async function ContactInfo() {
    const settings = await getWebsiteSettings();

    const cards = [
        {
            icon: Phone,
            gradient: "from-[#2b7fff] to-[#155dfc]",
            label: "Phone",
            value: settings.contactPhone,
            note: "Mon–Fri, 9am–6pm PKT",
        },
        {
            icon: Mail,
            gradient: "from-[#615fff] to-[#4f39f6]",
            label: "Email",
            value: settings.contactEmail,
            note: "We reply within 1 business day",
        },
        {
            icon: MapPin,
            gradient: "from-[#ad46ff] to-[#9810fa]",
            label: "Address",
            value: settings.contactAddress,
            note: "Main Campus",
        },
    ];

    return (
        <div>
            <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold">
                Get In Touch
            </span>

            <h2 className="mt-5 text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                We&apos;d Love to{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Hear From You
                </span>
            </h2>

            <p className="mt-4 text-gray-500 leading-relaxed">
                Whether you have a question about a course, need technical support, or want to learn more about {settings.siteName}, our team is here to help.
            </p>

            <div className="mt-8 space-y-4">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                        >
                            <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{card.label}</p>
                                <p className="mt-0.5 font-bold text-gray-900">{card.value}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{card.note}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 rounded-2xl border border-blue-100 p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[14px] bg-blue-600 flex items-center justify-center text-white shrink-0">
                        <GraduationCap size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{settings.siteName}</p>
                        <p className="text-xs text-gray-500">Official Support Team</p>
                    </div>
                </div>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    Our dedicated support team is committed to helping every student succeed. Reach out anytime — we&apos;re here for you.
                </p>
            </div>
        </div>
    );
}
