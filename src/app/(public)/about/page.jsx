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
            <section className="bg-slate-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold">About Us</h1>
                    <p className="mt-5 text-slate-300 max-w-2xl mx-auto">
                        Learn more about our story, our mission, and why
                        thousands of students trust our university to build
                        their future.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-slate-50">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                                Our Story
                            </span>

                            <h2 className="mt-6 text-4xl font-bold text-slate-900">
                                Building Skills For The Future, Since Day One
                            </h2>

                            <p className="mt-6 text-slate-600 leading-8">
                                LMS University started with a simple idea:
                                make quality education accessible to everyone,
                                regardless of where they live. Today, our
                                platform connects students with experienced
                                instructors through modern, industry-focused
                                courses and a flexible online learning
                                experience.
                            </p>

                            <p className="mt-4 text-slate-600 leading-8">
                                From live classes to self-paced lessons,
                                assignments, quizzes, and certificates, every
                                part of our platform is designed to help
                                learners gain real, practical skills they can
                                use in their careers.
                            </p>

                            <div className="mt-8">
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 transition"
                                >
                                    Explore Our Courses
                                </Link>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="relative bg-white rounded-3xl shadow-xl p-6">
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

            <section className="py-24 bg-white">
                <Container>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="rounded-2xl border p-8 hover:shadow-xl transition duration-300">
                            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <Target size={30} />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold">
                                Our Mission
                            </h3>
                            <p className="mt-4 text-slate-600 leading-7">
                                To deliver accessible, high-quality education
                                that equips students with practical,
                                real-world skills for their careers.
                            </p>
                        </div>

                        <div className="rounded-2xl border p-8 hover:shadow-xl transition duration-300">
                            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <Eye size={30} />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold">
                                Our Vision
                            </h3>
                            <p className="mt-4 text-slate-600 leading-7">
                                To become a leading online learning platform
                                trusted by students and institutions across
                                the region.
                            </p>
                        </div>

                        <div className="rounded-2xl border p-8 hover:shadow-xl transition duration-300">
                            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <GraduationCap size={30} />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold">
                                Our Values
                            </h3>
                            <p className="mt-4 text-slate-600 leading-7">
                                Quality, accessibility, and integrity guide
                                everything we build for our students and
                                teachers.
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
