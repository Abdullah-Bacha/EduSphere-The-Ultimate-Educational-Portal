import Image from "next/image";
import Container from "../ui/Container";
import Link from "next/link";
import { CheckCircle2, Lock, Star, Award, Users } from "lucide-react";

export default function AboutSection() {
    return (
        <section className="py-24 bg-white">
            <Container>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Image with Feature Boxes */}
                    <div className="relative">
                        {/* Feature Boxes - Left Sidebar */}
                        <div className="absolute left-0 top-0 space-y-3 z-30">
                            <div className="bg-white rounded-full px-4 py-2 shadow-md border border-gray-200 flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                                <Lock size={16} className="text-blue-600" />
                                <span>Secure & Safe Learning</span>
                            </div>
                            <div className="bg-white rounded-full px-4 py-2 shadow-md border border-gray-200 flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                                <Star size={16} className="text-yellow-500" />
                                <span>Quality Education</span>
                            </div>
                            <div className="bg-white rounded-full px-4 py-2 shadow-md border border-gray-200 flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                                <CheckCircle2 size={16} className="text-green-600" />
                                <span>Certified Courses</span>
                            </div>
                            <div className="bg-white rounded-full px-4 py-2 shadow-md border border-gray-200 flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                                <Users size={16} className="text-purple-600" />
                                <span>Expert Teachers</span>
                            </div>
                        </div>

                        {/* Main Image Container */}
                        <div className="relative w-full h-96 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl"></div>
                            <Image
                                src="/images/hero2.svg"
                                alt="About University - Student"
                                width={400}
                                height={450}
                                className="relative z-10 w-full h-full object-contain p-8"
                                priority
                            />
                        </div>

                        {/* Stats Boxes - Bottom */}
                        <div className="flex gap-4 mt-6">
                            <div className="flex-1 bg-blue-600 text-white rounded-2xl p-4 text-center shadow-lg">
                                <div className="text-2xl font-bold">10+</div>
                                <div className="text-sm">Years of Excellence</div>
                            </div>
                            <div className="flex-1 bg-blue-600 text-white rounded-2xl p-4 text-center shadow-lg">
                                <div className="text-2xl font-bold">50K+</div>
                                <div className="text-sm">Happy Students</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="pl-8">
                        <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200">
                            About Us
                        </span>

                        <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-black leading-tight">
                            Empowering Students Through <span className="text-blue-600">Modern Education</span>
                        </h2>

                        <p className="mt-6 text-gray-600 leading-relaxed text-base">
                            Our Learning Management System is a modern, flexible, and interactive platform designed to provide high-quality education to students worldwide. We believe in accessible, practical education that prepares students for real-world challenges.
                        </p>

                        {/* Checklist */}
                        <div className="mt-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={18} className="text-blue-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Experienced Faculty Members</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={18} className="text-blue-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Industry-Oriented Courses</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={18} className="text-blue-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Online Learning Platform</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={18} className="text-blue-600" />
                                </div>
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
    );
}