import Link from "next/link";
import Container from "../ui/Container";
import Button from "../ui/Button";
import HeroStats from "./HeroStats";
import Image from "next/image";
import User from "@/models/User";
import Course from "@/models/Course";
import dbConnect from "@/lib/dbConnect";

async function getHeroStats() {
    await dbConnect();

    const [students, teachers, courses] = await Promise.all([
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "teacher" }),
        Course.countDocuments(),
    ]);

    return { students, teachers, courses };
}

export default async function HeroSection() {
    const stats = await getHeroStats();

    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28" style={{ background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)" }}>
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -right-40 -top-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute -left-40 bottom-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
            </div>

            <Container className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-light)] border border-indigo-200">
                            <span className="inline-block w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                            <span className="text-sm font-semibold text-[var(--accent)]">Welcome to EduLMS</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">
                                Learn Today, Lead Tomorrow
                            </h1>
                            <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg">
                                Join thousands of students learning through our modern Learning Management System. Expert instructors, practical courses, and industry-ready skills await you.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/courses">
                                <Button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-8 py-3.5 rounded-[var(--radius-md)] font-semibold transition-all hover:shadow-md">
                                    Explore Courses
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="outline" className="border border-[var(--border)] text-[var(--text-primary)] px-8 py-3.5 rounded-[var(--radius-md)] font-semibold hover:bg-[var(--surface-hover)] transition-all">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>

                        <HeroStats students={stats.students} courses={stats.courses} teachers={stats.teachers} />
                    </div>

                    {/* Visual */}
                    <div className="relative hidden lg:block">
                        <div className="relative w-full aspect-square">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-indigo-50 rounded-2xl"></div>
                            <Image
                                src="/images/hero.svg"
                                alt="Student Learning"
                                width={400}
                                height={400}
                                priority
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}