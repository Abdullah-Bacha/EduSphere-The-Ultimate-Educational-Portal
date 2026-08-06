import Image from "next/image";
import Container from "../ui/Container";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function AboutSection() {
    return (
        <>
            {/* Trusted By Section */}
            <section className="py-12 bg-white border-b border-gray-200">
                <Container>
                    <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-500 mb-8">
                        Trusted by Leading Organizations
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12">
                        <span className="text-lg font-semibold text-gray-400">Google</span>
                        <span className="text-lg font-semibold text-gray-400">Microsoft</span>
                        <span className="text-lg font-semibold text-gray-400">Amazon</span>
                        <span className="text-lg font-semibold text-gray-400">Meta</span>
                        <span className="text-lg font-semibold text-gray-400">IBM</span>
                        <span className="text-lg font-semibold text-gray-400">Oracle</span>
                    </div>
                </Container>
            </section>

            {/* Main About Section */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Side - Image with Floating Cards */}
                        <div className="relative flex justify-center">
                            <div className="relative w-80 h-96">
                                {/* Main Image */}
                                <div className="relative z-20 w-full h-full flex items-center justify-center">
                                    <Image
                                        src="/images/hero.svg"
                                        alt="About University"
                                        width={320}
                                        height={400}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* Floating Card - Top Left */}
                                <div className="absolute top-0 left-0 bg-blue-50 rounded-xl p-3 shadow-lg z-10 border border-blue-100 max-w-xs">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">🔒</div>
                                        <span className="font-medium text-gray-700">Secure & Safe Learning</span>
                                    </div>
                                </div>

                                {/* Floating Card - Top Right */}
                                <div className="absolute top-16 right-0 bg-yellow-50 rounded-xl p-3 shadow-lg z-10 border border-yellow-100 max-w-xs">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">⭐</div>
                                        <span className="font-medium text-gray-700">Quality Education</span>
                                    </div>
                                </div>

                                {/* Floating Card - Middle Right */}
                                <div className="absolute top-1/3 -right-8 bg-green-50 rounded-xl p-3 shadow-lg z-10 border border-green-100 max-w-xs">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                                        <span className="font-medium text-gray-700">Certified Courses</span>
                                    </div>
                                </div>

                                {/* Floating Card - Bottom Left */}
                                <div className="absolute bottom-8 left-0 bg-purple-50 rounded-xl p-3 shadow-lg z-10 border border-purple-100 max-w-xs">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">👨‍🏫</div>
                                        <span className="font-medium text-gray-700">Expert Teachers</span>
                                    </div>
                                </div>

                                {/* Stats at Bottom */}
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 flex gap-4 w-full px-4">
                                    <div className="flex-1 bg-blue-600 text-white rounded-xl p-3 text-center shadow-lg">
                                        <div className="text-lg font-bold">10+</div>
                                        <div className="text-xs">Years of Excellence</div>
                                    </div>
                                    <div className="flex-1 bg-blue-600 text-white rounded-xl p-3 text-center shadow-lg">
                                        <div className="text-lg font-bold">50K+</div>
                                        <div className="text-xs">Happy Students</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Content */}
                        <div>
                            <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200">
                                About Us
                            </span>

                            <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-black">
                                Empowering Students Through <span className="text-blue-600">Modern Education</span>
                            </h2>

                            <p className="mt-6 text-gray-600 leading-relaxed text-base">
                                Our Learning Management System is a modern, flexible, and interactive platform designed to provide high-quality education to students worldwide. We believe in accessible, practical education that prepares students for real-world challenges.
                            </p>

                            {/* Checklist */}
                            <div className="mt-10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">Experienced Faculty Members</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">Industry-Oriented Courses</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">Online Learning Platform</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">International Certifications</span>
                                </div>
                            </div>

                            {/* Learn More Button */}
                            <Link href="/about">
                                <button className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all hover:shadow-lg flex items-center gap-2">
                                    Learn More
                                    <span>→</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
}