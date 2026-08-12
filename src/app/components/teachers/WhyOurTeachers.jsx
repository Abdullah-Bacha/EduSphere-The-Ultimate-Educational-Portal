import Container from "@/app/components/ui/Container";
import { Briefcase, Lightbulb, Heart } from "lucide-react";

const reasons = [
    {
        icon: Briefcase,
        title: "Industry Experience",
        description: "Learn from instructors with practical knowledge and real-world experience in their fields.",
    },
    {
        icon: Lightbulb,
        title: "Practical Learning",
        description: "Gain hands-on experience through projects, assignments, and real-world examples.",
    },
    {
        icon: Heart,
        title: "Student Focused",
        description: "Get guidance and support designed around your individual learning journey.",
    },
];

export default function WhyOurTeachers() {
    return (
        <section className="py-24 bg-white">
            <Container>
                <div className="text-center mb-14 max-w-2xl mx-auto">
                    <span className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold">
                        Why Our Teachers
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Teaching That Makes a Difference
                    </h2>
                    <p className="mt-4 text-gray-500 leading-relaxed">
                        Our instructors combine academic knowledge with practical industry experience to create learning experiences that prepare students for real-world challenges.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {reasons.map((reason) => {
                        const Icon = reason.icon;
                        return (
                            <div
                                key={reason.title}
                                className="rounded-2xl border border-gray-100 p-8 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Icon size={22} strokeWidth={1.75} />
                                </div>
                                <h3 className="mt-5 font-extrabold text-gray-900">{reason.title}</h3>
                                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{reason.description}</p>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
