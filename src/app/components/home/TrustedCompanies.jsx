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
        <section className="border-y border-[var(--border)] bg-[var(--bg-main)] py-14">
            <Container>
                <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                    Platform at a glance
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {TRUST_POINTS.map(({ icon: Icon, label, sublabel }) => (
                        <div
                            key={sublabel}
                            className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--surface)] p-6 text-center shadow-sm border border-[var(--border)] hover:shadow-card-hover transition-shadow"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-light)] text-[var(--accent)]">
                                <Icon size={20} strokeWidth={1.6} />
                            </span>
                            <span className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">{label}</span>
                            <span className="text-xs text-[var(--text-secondary)]">{sublabel}</span>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
