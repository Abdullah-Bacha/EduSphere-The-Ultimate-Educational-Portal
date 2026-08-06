import Link from "next/link";
import Container from "../ui/Container";
import Button from "../ui/Button";
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
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40" style={{ background: "linear-gradient(135deg, #e8eef8 0%, #f0e8f8 50%, #e8f4f8 100%)" }}>
            {/* Decorative dot pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-20 left-10 w-1 h-1 bg-blue-400 rounded-full"></div>
                <div className="absolute top-32 left-20 w-1 h-1 bg-blue-400 rounded-full"></div>
                <div className="absolute top-40 left-32 w-1 h-1 bg-blue-400 rounded-full"></div>
                <div className="absolute top-12 left-40 w-1 h-1 bg-blue-400 rounded-full"></div>
            </div>

            <Container className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            <span className="text-xs font-semibold text-blue-600">Welcome to EduLMS</span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
                                Learn Today, <span className="text-blue-600">Lead Tomorrow</span>
                            </h1>
                            <p className="text-base text-gray-600 leading-relaxed max-w-md">
                                Join thousands of students learning through our modern Learning Management System. Expert instructors, practical courses, and industry-ready skills await you.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                            <Link href="/courses">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg flex items-center gap-2">
                                    Explore Courses
                                    <span>→</span>
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-all">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 pt-8">
                            <div>
                                <div className="text-2xl font-black text-black">{stats.students}K+</div>
                                <div className="text-sm text-gray-500">Students</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-black">{stats.courses}+</div>
                                <div className="text-sm text-gray-500">Courses</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-black">{stats.teachers}+</div>
                                <div className="text-sm text-gray-500">Instructors</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual with Floating Cards */}
                    <div className="relative hidden lg:block h-full min-h-[500px]">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src="/images/hero.svg"
                                alt="Student Learning"
                                width={350}
                                height={400}
                                priority
                                className="relative z-20 w-auto h-96 object-contain"
                            />

                            {/* Floating Stat Card - Top Left */}
                            <div className="absolute top-20 left-0 bg-white rounded-lg shadow-xl p-4 z-10 animate-bounce" style={{ animationDelay: '0s' }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">👥</div>
                                    <div>
                                        <div className="text-sm font-bold text-black">50K+</div>
                                        <div className="text-xs text-gray-500">Active Students</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stat Card - Top Right */}
                            <div className="absolute top-16 right-0 bg-white rounded-lg shadow-xl p-4 z-10 animate-bounce" style={{ animationDelay: '0.5s' }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">📚</div>
                                    <div>
                                        <div className="text-sm font-bold text-black">500+</div>
                                        <div className="text-xs text-gray-500">Courses</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stat Card - Middle Right */}
                            <div className="absolute bottom-32 right-10 bg-white rounded-lg shadow-xl p-4 z-10 animate-bounce" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">⭐</div>
                                    <div>
                                        <div className="text-sm font-bold text-black">4.9 / 5</div>
                                        <div className="text-xs text-gray-500">Learning</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stat Card - Bottom Right */}
                            <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-xl p-4 z-10 animate-bounce" style={{ animationDelay: '0.7s' }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">📈</div>
                                    <div>
                                        <div className="text-sm font-bold text-black">98%</div>
                                        <div className="text-xs text-gray-500">Success Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}