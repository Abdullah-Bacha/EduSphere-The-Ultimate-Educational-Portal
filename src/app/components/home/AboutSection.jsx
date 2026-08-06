import Image from "next/image";
import Container from "../ui/Container";

export default function AboutSection() {
    return (
        <section className="py-24 bg-[var(--bg-main)]">

            <Container>

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side */}
                    <div>

                        <span className="inline-block bg-[var(--accent-light)] text-[var(--accent)] px-4 py-2 rounded-full text-sm font-semibold border border-indigo-200">
                            About Our University
                        </span>

                        <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-[var(--text-primary)]">
                            Empowering Students Through Modern Education
                        </h2>

                        <p className="mt-6 text-[var(--text-secondary)] leading-relaxed text-base">
                            Our Learning Management System provides a modern, flexible and interactive environment where students can learn from experienced instructors, access high-quality courses and build practical skills for their future careers.
                        </p>

                        <div className="mt-10 space-y-4">

                            <div className="flex items-center gap-3 text-[var(--text-primary)]">
                                ✅
                                <span className="font-medium">Experienced Faculty Members</span>
                            </div>

                            <div className="flex items-center gap-3 text-[var(--text-primary)]">
                                ✅
                                <span className="font-medium">Industry-Oriented Courses</span>
                            </div>

                            <div className="flex items-center gap-3 text-[var(--text-primary)]">
                                ✅
                                <span className="font-medium">Online Learning Platform</span>
                            </div>

                            <div className="flex items-center gap-3 text-[var(--text-primary)]">
                                ✅
                                <span className="font-medium">International Certifications</span>
                            </div>

                        </div>

                    </div>

                    {/* Right Side */}

                    <div className="flex justify-center">

                        <div className="relative bg-white rounded-3xl shadow-xl p-6">

                            <Image
                                src="/images/hero2.svg"
                                alt="About University"
                                width={450}
                                height={450}
                                className="w-full h-auto"
                            />

                        </div>

                    </div>

                </div>

            </Container>

        </section>
    );
}