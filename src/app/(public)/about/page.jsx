import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/ui/Container";
import WhyChooseUs from "@/app/components/home/WhyChooseUs";
import StatisticsSection from "@/app/components/home/StatisticsSection";
import CTASection from "@/app/components/home/CTASection";
import GlobalLeadersSection from "@/app/components/home/GlobalLeadersSection";
import StudentStories from "@/app/components/home/StudentStories";
import TestimonialsSection from "@/app/components/home/TestimonialsSection";
import FooterSection from "@/app/components/home/FooterSection";
import { Star, Target, Eye, GraduationCap } from "lucide-react";
import { getWebsiteSettings } from "@/services/websiteSettingService";
import { getLeaders } from "@/services/leaderService";

export const metadata = {
    title: "About Us | LMS University",
    description:
        "Learn more about LMS University, our mission, our vision, and why thousands of students trust us to build their future.",
};

export default async function AboutPage() {
    const [settings, leaders] = await Promise.all([getWebsiteSettings(), getLeaders()]);

    return (
        <main className="pt-1">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-50 to-blue-100 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm font-medium mb-8">
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
                        >
                            Home
                        </Link>

                        {/* Modern Chevron Icon */}
                        <svg
                            className="h-4 w-4 shrink-0 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>

                        <span className="text-[#155DFC] font-semibold" aria-current="page">
                            About Us
                        </span>
                    </nav>


                    {/* About LMS University Label */}
                    <div className="mb-6">
                        <span className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold">
                            <GraduationCap size={16} />
                            About LMS University
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                        About <span className="text-blue-600">Us</span>
                    </h1>

                    {/* Description */}
                    <p className="text-gray-600 max-w-2xl text-base leading-relaxed mb-12">
                        Learn more about our story, our mission, and why thousands of students trust our university to build their future.
                    </p>

                    {/* Stats Section */}
                    <div className="flex flex-wrap gap-8">
                        <div className="flex items-center gap-3   rounded-2xl px-3 py-2 bg-[#EEF2FF] shadow-[0_8px_15px_-6px_rgba(0,0,0,0.15)]">
                            <span className="inline-block text-blue-600 px-3 py-1 rounded-full text-sm font-bold">50K+</span>
                            <span className="text-gray-700 text-sm font-medium">Students Enrolled</span>
                        </div>
                        <div className="flex items-center gap-3  rounded-2xl px-3 py-2 bg-[#EEF2FF] shadow-[0_8px_15px_-6px_rgba(0,0,0,0.15)]">
                            <span className="inline-block text-blue-600 px-3 py-1 rounded-full text-sm font-bold">500+</span>
                            <span className="text-gray-700 text-sm font-medium">Courses Available</span>
                        </div>
                        <div className="flex items-center gap-3   rounded-2xl px-3 py-2 bg-[#EEF2FF] shadow-[0_8px_15px_-6px_rgba(0,0,0,0.15)]">
                            <span className="inline-block text-blue-600 px-3 py-1 rounded-full text-sm font-bold">10+</span>
                            <span className="text-gray-700 text-sm font-medium">Years of Excellence</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-22 bg-[var(--bg-main)]">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-14 items-start">
                        <div>
                            <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                                Our Story
                            </span>

                            <h2 className="mt-6 text-4xl lg:text-3xl font-bold leading-tight">
                                <span className="text-gray-900">Building Skills For The Future,</span>
                                <br />
                                <span className="text-blue-600">Since Day One</span>
                            </h2>

                            <p className="mt-6 text-gray-600 leading-relaxed text-base">
                                LMS University started with a simple idea: make quality education accessible to everyone, regardless of where they live. Today, our platform connects students with experienced instructors through modern, industry-focused courses and a flexible online learning experience.
                            </p>

                            <p className="mt-4 text-gray-600 leading-relaxed text-base">
                                From live classes to self-paced lessons, assignments, quizzes, and certificates, every part of our platform is designed to help learners gain real, practical skills they can use in their careers.
                            </p>

                            <div className="mt-10">
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 transition-all hover:shadow-lg"
                                >
                                    Explore Our Courses
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        <div className="flex justify-center relative w-full mt-10">
                            {/* Student Rating Badge */}
                            <div className="absolute -top-8 -right-6 bg-white rounded-lg shadow-lg p-2 z-10 flex items-center gap-2">
                                <span className="text-yellow-400 text-2xl bg-[#FEF9C2] rounded-full px-1">★</span>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-gray-900">4.9 / 5.0</div>
                                    <div className="text-xs text-gray-600">Student Rating</div>
                                </div>
                            </div>

                            {/* Image Container */}
                            <div className="relative w-full">
                                <Image
                                    src="/images/about-group-phto.jpeg"
                                    alt="About LMS University"
                                    width={400}
                                    height={400}
                                    className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                                />

                                {/* Years of Excellence Badge */}
                                <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white rounded-2xl px-4 py-2 font-semibold text-sm shadow-lg">
                                    10+ <br /> Years of Excellence
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-32 bg-[var(--surface)]">
                <Container>
                    <div className="text-center mb-12">
                        <span className="inline-block text-blue-600  bg-[#EFF6FF] rounded-2xl text-sm font-semibold mb-4">Who We Are</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Our Mission, Vision & Values</h2>
                    </div>
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
                            <div className="w-14 h-14 rounded-[var(--radius-md)] bg-purple-100 flex items-center justify-center text-purple-600">
                                <Star size={28} />
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
            <GlobalLeadersSection leaders={leaders} />
            <StudentStories />

            <StatisticsSection />
            <TestimonialsSection />
            <CTASection title={settings.ctaTitle} description={settings.ctaDescription} />

            <FooterSection />
        </main>
    );
}