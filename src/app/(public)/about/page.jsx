import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/ui/Container";
import WhyChooseUs from "@/app/components/home/WhyChooseUs";
import StatisticsSection from "@/app/components/home/StatisticsSection";
import CTASection from "@/app/components/home/CTASection";
import { GraduationCap, Target, Eye } from "lucide-react";

export const metadata = {
    title: "About Us | LMS University",
    description:
        "Learn more about LMS University, our mission, our vision, and why thousands of students trust us to build their future.",
};

export default function AboutPage() {
    return (
        <main className="pt-20">
            <section className="bg-blue-600 text-white py-24">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl lg:text-6xl font-bold">About Us</h1>
                    <p className="mt-6 text-white/70 max-w-2xl mx-auto leading-relaxed text-lg">
                        Learn more about our story, our mission, and why thousands of students trust our university to build their future.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-[var(--bg-main)]">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-block bg-[var(--accent-light)] text-[var(--accent)] px-4 py-2 rounded-full text-sm font-semibold border border-indigo-200">
                                Our Story
                            </span>

                            <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-[var(--text-primary)]">
                                Building Skills For The Future, Since Day One
                            </h2>

                            <p className="mt-6 text-[var(--text-secondary)] leading-relaxed text-base">
                                LMS University started with a simple idea: make quality education accessible to everyone, regardless of where they live. Today, our platform connects students with experienced instructors through modern, industry-focused courses and a flexible online learning experience.
                            </p>

                            <p className="mt-4 text-[var(--text-secondary)] leading-relaxed text-base">
                                From live classes to self-paced lessons, assignments, quizzes, and certificates, every part of our platform is designed to help learners gain real, practical skills they can use in their careers.
                            </p>

                            <div className="mt-10">
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold px-8 py-3.5 transition-all hover:shadow-lg"
                                >
                                    Explore Our Courses
                                </Link>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="relative bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-card p-6 border border-[var(--border)]">
                                <Image
                                    src="/images/hero.svg"
                                    alt="About LMS University"
                                    width={450}
                                    height={450}
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-24 bg-[var(--surface)]">
                <Container>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 hover:shadow-card-hover transition-shadow duration-300">
                            <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
                                <Target size={28} />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">
                                Our Mission
                            </h3>
                            <p className="mt-4 text-[var(--text-secondary)] leading-7 text-sm">
                                To deliver accessible, high-quality education that equips students with practical, real-world skills for their careers.
                            </p>
                        </div>

                        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 hover:shadow-card-hover transition-shadow duration-300">
                            <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
                                <Eye size={28} />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">
                                Our Vision
                            </h3>
                            <p className="mt-4 text-[var(--text-secondary)] leading-7 text-sm">
                                To become a leading online learning platform trusted by students and institutions across the region.
                            </p>
                        </div>

                        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 hover:shadow-card-hover transition-shadow duration-300">
                            <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
                                <GraduationCap size={28} />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">
                                Our Values
                            </h3>
                            <p className="mt-4 text-[var(--text-secondary)] leading-7 text-sm">
                                Quality, accessibility, and integrity guide everything we build for our students and teachers.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            <WhyChooseUs />
            <StatisticsSection />
            <CTASection />
        </main>
    );
}
