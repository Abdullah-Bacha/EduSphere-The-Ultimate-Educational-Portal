import Container from "../ui/Container";
import { Lock, Lightbulb, Trophy, Users, Monitor, Library, Clock, Headphones } from "lucide-react";

const features = [
    {
        icon: Lock,
        title: "Secure & Safe",
        description: "Your data and learning environment are protected with industry-standard security measures.",
        gradient: "from-blue-500 to-indigo-500",
    },
    {
        icon: Lightbulb,
        title: "Quality Education",
        description: "Premium content curated by experts to ensure highest standards of learning.",
        gradient: "from-amber-500 to-orange-500",
    },
    {
        icon: Trophy,
        title: "Certified Courses",
        description: "Earn recognized certificates upon completion that enhance your professional credentials.",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        icon: Users,
        title: "Expert Teachers",
        description: "Learn from experienced instructors with practical industry knowledge and years of teaching excellence.",
        gradient: "from-purple-500 to-violet-500",
    },
    {
        icon: Monitor,
        title: "Live Classes",
        description: "Engage in interactive live sessions with instructors and fellow learners in real-time.",
        gradient: "from-rose-500 to-pink-500",
    },
    {
        icon: Library,
        title: "Online Catalog",
        description: "Access a comprehensive catalog of courses across multiple subjects and skill levels.",
        gradient: "from-cyan-500 to-sky-500",
    },
    {
        icon: Clock,
        title: "Flexible Learning",
        description: "Study at your own pace, anytime, anywhere with no time constraints or deadlines.",
        gradient: "from-fuchsia-500 to-purple-500",
    },
    {
        icon: Headphones,
        title: "Student Support",
        description: "24/7 dedicated support team ready to help you with any questions or issues.",
        gradient: "from-indigo-500 to-blue-500",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-white">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center justify-center gap-2 mb-4 bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">Why Choose Us</span>
                    </div>
                    <h2 className="mt-4 text-3xl lg:text-3xl font-bold text-gray-900">
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
