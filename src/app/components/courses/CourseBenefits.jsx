import Container from "@/app/components/ui/Container";
import { Users, Monitor, Award, Star } from "lucide-react";

const benefits = [
    {
        icon: Users,
        title: "Expert Instructors",
        description: "Learn from experienced professionals.",
    },
    {
        icon: Monitor,
        title: "Practical Projects",
        description: "Build real-world projects while learning.",
    },
    {
        icon: Award,
        title: "Flexible Learning",
        description: "Study at your own pace from anywhere.",
    },
    {
        icon: Star,
        title: "Certificates",
        description: "Earn certificates to showcase your achievements.",
    },
];

export default function CourseBenefits() {
    return (
        <section className="py-24 bg-white">
            <Container>
                <div className="text-center mb-12">
                    <span className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold">
                        Why LMS University
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Why Learn With LMS University?
                    </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={benefit.title}
                                className="rounded-2xl border border-gray-100 p-8 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Icon size={22} strokeWidth={1.75} />
                                </div>
                                <h3 className="mt-5 font-extrabold text-gray-900">{benefit.title}</h3>
                                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{benefit.description}</p>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
