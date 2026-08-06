import Container from "../ui/Container";
import { GraduationCap, BookOpen, Laptop, Award } from "lucide-react";

const features = [
    {
        icon: GraduationCap,
        title: "Expert Teachers",
        description: "Learn from experienced instructors with practical industry knowledge and years of teaching excellence.",
        gradient: "from-blue-500 to-indigo-500",
    },
    {
        icon: BookOpen,
        title: "Modern Courses",
        description: "Industry-focused curriculum designed for real-world skills that employers actually look for.",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        icon: Laptop,
        title: "Learn Anywhere",
        description: "Study at your own pace on any device — desktop, tablet, or mobile — with zero app required.",
        gradient: "from-cyan-500 to-sky-500",
    },
    {
        icon: Award,
        title: "Earn Certificates",
        description: "Receive a verified certificate upon completion that you can share on LinkedIn and your CV.",
        gradient: "from-emerald-500 to-teal-500",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-white">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-blue-600 font-semibold uppercase tracking-widest text-sm">
                        Why choose us
                    </span>
                    <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-black">
                        Everything you need to build your future
                    </h2>
                    <p className="mt-6 text-gray-600 leading-relaxed text-base">
                        Our platform combines modern technology, expert instructors, and practical learning to help you achieve your goals.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                            >
                                <span className="absolute right-4 top-4 text-6xl font-black text-[var(--border)] select-none">
                                    {String(idx + 1).padStart(2, "0")}
                                </span>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br ${feature.gradient} text-white shadow-sm`}>
                                    <Icon size={22} strokeWidth={1.6} />
                                </div>
                                <h3 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
