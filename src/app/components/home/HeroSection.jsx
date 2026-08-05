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
        <section className="relative overflow-hidden py-40 lg:py-32" style={{ backgroundImage: "linear-gradient(150.6deg, rgb(238, 242, 255) 0%, rgb(240, 247, 255) 50%, rgb(232, 244, 253) 100%)" }}>

            {/* Background Blurs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-br from-blue-300 to-blue-200 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute left-1/2 bottom-0 translate-x-1/2 w-64 h-64 bg-gradient-to-br from-cyan-200 to-blue-100 rounded-full blur-2xl opacity-30"></div>
            </div>

            <Container className="relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side */}
                    <div className="space-y-6">

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-600 text-sm font-semibold">
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/>
                            </svg>
                            Welcome to EduLMS
                        </div>

                        <div>
                            <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight text-slate-900 tracking-tight">
                                Learn Today,{" "}
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Lead
                                </span>
                            </h1>
                            <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                                Tomorrow
                            </h1>
                        </div>

                        <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                            Join thousands of students learning through our modern Learning Management System. Expert instructors, practical courses, and industry-ready skills await you.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">

                            <Link href="/courses">
                                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2">
                                    Explore Courses
                                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8.5 3.5a.5.5 0 0 0-1 0v8l-2.5-2.5a.5.5 0 0 0-.707.707l3.5 3.5a.5.5 0 0 0 .707 0l3.5-3.5a.5.5 0 1 0-.707-.707L8.5 11.5v-8z"/>
                                    </svg>
                                </Button>
                            </Link>

                            <Link href="/contact">
                                <Button variant="outline" className="border-2 border-gray-300 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50">
                                    Contact Us
                                </Button>
                            </Link>

                        </div>

                        {/* Hero Stats */}
                        <HeroStats students={stats.students} courses={stats.courses} teachers={stats.teachers} />

                    </div>

                    {/* Right Side */}
                    <div className="relative flex justify-center items-center">

                        {/* Glow Background */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute w-80 h-80 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full blur-3xl opacity-50"></div>
                        </div>

                        {/* Main Card */}
                        <div className="relative">
                            <div className="absolute inset-4 bg-gradient-to-br from-blue-100 to-gray-100 rounded-3xl blur"></div>
                            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-80 h-80 lg:w-96 lg:h-96">

                                <Image
                                    src="/images/hero.svg"
                                    alt="Student Learning"
                                    width={440}
                                    height={440}
                                    priority
                                    className="w-full h-full object-cover"
                                />

                            </div>

                            {/* Floating Card - Students */}
                            <div className="absolute -left-6 top-16 bg-white rounded-2xl shadow-lg px-4 py-3 backdrop-blur-sm border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm4 2a1 1 0 0 1 1 1v1.5c0 .3-.2.5-.5.5h-9c-.3 0-.5-.2-.5-.5V11a1 1 0 0 1 1-1h8z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-800">{stats.students}K+</p>
                                        <p className="text-xs text-slate-500">Students</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card - Courses */}
                            <div className="absolute -right-6 top-12 bg-white rounded-2xl shadow-lg px-4 py-3 backdrop-blur-sm border border-purple-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-purple-600" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 2l3 1.5v3l-3 1.5-3-1.5v-3L8 2m0-1L3.5 3v4L8 8.5l4.5-2.5V3L8 1z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-800">{stats.courses}+</p>
                                        <p className="text-xs text-slate-500">Courses</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card - Success Rate */}
                            <div className="absolute -right-4 bottom-12 bg-white rounded-2xl shadow-lg px-4 py-3 backdrop-blur-sm border border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 1 1-1.06-1.06l7.25-7.25a.75.75 0 0 1 1.06 0Z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-800">98%</p>
                                        <p className="text-xs text-slate-500">Success Rate</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card - Rating */}
                            <div className="absolute -left-4 bottom-8 bg-white rounded-2xl shadow-lg px-4 py-3 backdrop-blur-sm border border-yellow-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 1l2.39 4.83h5.35l-4.32 3.15 1.65 5.02L8 10.83l-4.32 3.15 1.65-5.02L.26 5.83h5.35L8 1z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-800">4.9★</p>
                                        <p className="text-xs text-slate-500">Learning</p>
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