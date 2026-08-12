import Link from "next/link";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Image from "next/image";
import User from "@/models/User";
import Course from "@/models/Course";
import dbConnect from "@/lib/dbConnect";
import { getWebsiteSettings } from "@/services/websiteSettingService";

async function getHeroStats() {
    await dbConnect();

    const [students, teachers, courses] = await Promise.all([
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "teacher" }),
        Course.countDocuments(),
    ]);

    return { students, teachers, courses };
}

function renderHeading(title, highlight) {
    if (highlight && title.includes(highlight)) {
        const [before, after] = title.split(highlight);
        return (
            <>
                {before}
                <span className="text-blue-600">{highlight}</span>
                {after}
            </>
        );
    }
    return title;
}

export default async function HeroSection() {
    const [stats, settings] = await Promise.all([getHeroStats(), getWebsiteSettings()]);

    return (
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-1 lg:pb-14" style={{ background: "linear-gradient(135deg, #e8eef8 0%, #f0e8f8 50%, #e8f4f8 100%)" }}>
            {/* Decorative dot pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-20 left-10 w-1 h-1 bg-blue-400 rounded-full"></div>
                <div className="absolute top-32 left-20 w-1 h-1 bg-blue-400 rounded-full"></div>
                <div className="absolute top-40 left-32 w-1 h-1 bg-blue-400 rounded-full"></div>
                <div className="absolute top-12 left-40 w-1 h-1 bg-blue-400 rounded-full"></div>
            </div>

            <Container className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            <span className="text-xs font-semibold text-blue-600">{settings.heroBadge}</span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-5xl font-black leading-tight">
                                {renderHeading(settings.heroTitle, settings.heroHighlight)}
                            </h1>
                            <p className="text-base text-gray-600 leading-relaxed max-w-md">
                                {settings.heroDescription}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link href="/courses">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg flex items-center gap-2 border border-blue-600">
                                    Explore Courses
                                    <span>→</span>
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button className="border-2 border-gray-300 text-gray-700 bg-[#EFE9F8] hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-all hover:border-gray-400">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8">
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
                                src={settings.heroImage || "/images/Students learning.png"}
                                alt="Student Learning"
                                width={350}
                                height={400}
                                priority
                                className="relative z-20 w-auto h-96 object-contain"
                            />

                            {/* Floating Stat Card - Top Center Left */}
                            <div
                                className="absolute top-8 left-12 bg-white rounded-xl shadow-md px-4 py-3 z-10 w-max"
                                style={{
                                    animation: 'float 3s ease-in-out infinite',
                                    animationDelay: '0s'
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">👥</div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">50K+</div>
                                        <div className="text-xs text-gray-600">Students</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stat Card - Top Right */}
                            <div
                                className="absolute top-8 right-14 bg-white rounded-xl shadow-md px-4 py-3 z-10 w-max"
                                style={{
                                    animation: 'float 3s ease-in-out infinite',
                                    animationDelay: '0.4s'
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">📚</div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">500+</div>
                                        <div className="text-xs text-gray-600">Courses</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stat Card - Middle Right */}
                            <div
                                className="absolute top-1/3 -right-1 bg-white rounded-xl shadow-md px-4 py-3 z-10 w-max"
                                style={{
                                    animation: 'float 3s ease-in-out infinite',
                                    animationDelay: '0.2s'
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xs font-bold ">⭐</div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">4.9★</div>
                                        <div className="text-xs text-gray-600">Learning</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stat Card - Bottom Right */}
                            <div
                                className="absolute bottom-18 right-0 bg-white rounded-xl shadow-md px-4 py-3 z-10 w-max"
                                style={{
                                    animation: 'float 3s ease-in-out infinite',
                                    animationDelay: '0.6s'
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-bold">📈</div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">98%</div>
                                        <div className="text-xs text-gray-600">Success Rate</div>
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