import Container from "../ui/Container";
import { Star, Shield, Zap, Users, Globe, Award } from "lucide-react";

const TRUST_POINTS = [
    { icon: Users, label: "10,000+", sublabel: "Active students" },
    { icon: Star, label: "4.9 / 5", sublabel: "Average rating" },
    { icon: Award, label: "500+", sublabel: "Certificates issued" },
    { icon: Globe, label: "15+", sublabel: "Countries reached" },
    { icon: Shield, label: "100%", sublabel: "Secure platform" },
    { icon: Zap, label: "24 / 7", sublabel: "Support available" },
];

export default function TrustedCompanies() {
    return (
        <section className="border-y border-slate-100 bg-slate-50 py-14">
            <Container>
                <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Platform at a glance
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {TRUST_POINTS.map(({ icon: Icon, label, sublabel }) => (
                        <div
                            key={sublabel}
                            className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-100"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Icon size={20} strokeWidth={1.6} />
                            </span>
                            <span className="text-xl font-bold tracking-tight text-slate-900">{label}</span>
                            <span className="text-xs text-slate-500">{sublabel}</span>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
