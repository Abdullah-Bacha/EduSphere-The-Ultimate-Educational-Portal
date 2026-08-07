import Image from "next/image";
import Container from "../ui/Container";
import Link from "next/link";
import { CheckCircle2, Lock, Star, Award, Users } from "lucide-react";
import { Video, BookOpen, Clock, Headphones } from "lucide-react";
export default function AboutSection() {
    return (
        <section className="py-16 bg-white">
            <Container>
                <div className="grid lg:grid-cols-2 gap-8 items-start mt-18">
                    {/* Left Side - Image with Feature Boxes */}
                    <div className="flex flex-col items-center">
                        {/* Main Image Container with Overlays */}
                        <div className="relative w-72 h-96 flex items-center justify-center">
                            {/* Left Side Feature Boxes */}
                            <div className="absolute -left-24 top-0 space-y-2 z-30 flex flex-col">
                                <div className="bg-white rounded-full px-3 py-1.5 shadow-md border border-gray-200 flex items-center gap-2 text-xs font-medium whitespace-nowrap hover:shadow-lg transition-shadow">
                                    <Lock size={14} className="text-blue-600 flex-shrink-0" />
                                    <span className="text-gray-900">Secure & Safe</span>
                                </div>
                                <div className="bg-white rounded-full px-3 py-1.5 shadow-md border border-gray-200 flex items-center gap-2 text-xs font-medium whitespace-nowrap hover:shadow-lg transition-shadow">
                                    <Star size={14} className="text-amber-500 flex-shrink-0" />
                                    <span className="text-gray-900">Quality Education</span>
                                </div>
                                <div className="bg-white rounded-full px-3 py-1.5 shadow-md border border-gray-200 flex items-center gap-2 text-xs font-medium whitespace-nowrap hover:shadow-lg transition-shadow">
                                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                                    <span className="text-gray-900">Certified Courses</span>
                                </div>
                                <div className="bg-white rounded-full px-3 py-1.5 shadow-md border border-gray-200 flex items-center gap-2 text-xs font-medium whitespace-nowrap hover:shadow-lg transition-shadow">
                                    <Users size={14} className="text-indigo-600 flex-shrink-0" />
                                    <span className="text-gray-900">Expert Teachers</span>
                                </div>
                            </div>

                            {/* Right Side Feature Boxes */}
                            <div className="absolute -right-24 top-0 space-y-2 z-30 flex flex-col">
                                <div className="bg-white rounded-full px-3 py-1.5 shadow-md border border-gray-200 flex items-center gap-2 text-xs font-medium whitespace-nowrap hover:shadow-lg transition-shadow">
                                    <Video size={14} className="text-blue-600 flex-shrink-0" />
                                    <span className="text-gray-900">Live Classes</span>
                                </div>
                                <div className="bg-white rounded-full px-3 py-1.5 shadow-md border border-gray-200 flex items-center gap-2 text-xs font-medium whitespace-nowrap hover:shadow-lg transition-shadow">
                                    <BookOpen size={14} className="text-amber-500 flex-shrink-0" />
                                    <span className="text-gray-900">Online Catalog</span>
                                </div>
                                <div className="bg-white rounded-full px-3 py-1.5 shadow-md border border-gray-200 flex items-center gap-2 text-xs font-medium whitespace-nowrap hover:shadow-lg transition-shadow">
                                    <Clock size={14} className="text-emerald-600 flex-shrink-0" />
                                    <span className="text-gray-900">Flexible Learning</span>
                                </div>
                                <div className="bg-white rounded-full px-3 py-1.5 shadow-md border border-gray-200 flex items-center gap-2 text-xs font-medium whitespace-nowrap hover:shadow-lg transition-shadow">
                                    <Headphones size={14} className="text-indigo-600 flex-shrink-0" />
                                    <span className="text-gray-900">Student Support</span>
                                </div>
                            </div>

                            {/* Main Image */}
                            <Image
                                src="/images/Student learning.png"
                                alt="About University - Student"
                                width={400}
                                height={500}
                                className="relative z-10 w-full h-full object-cover"
                                priority
                            />
                        </div>

                        {/* Stats Boxes - Below Image */}
                        <div className=" -mt-14 w-full max-w-sm bg-blue-600 text-white rounded-2xl p-2 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-center gap-8">
                                {/* Left Stat */}
                                <div className="text-center">
                                    <div className="text-2xl font-bold">10+</div>
                                    <div className="text-xs mt-1 text-blue-100">Years of Excellence</div>
                                </div>

                                {/* Separator */}
                                <div className="h-12 w-0.5 bg-blue-400"></div>

                                {/* Right Stat */}
                                <div className="text-center">
                                    <div className="text-2xl font-bold">50K+</div>
                                    <div className="text-xs mt-1 text-blue-100">Happy Students</div>
                                </div>
                            </div>
                        </div>












                    </div>

                    {/* Right Side - Content */}
                    <div className="flex flex-col justify-start lg:pl-8">
                        <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200 w-fit">
                            About Us
                        </span>

                        <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-black leading-tight">
                            Empowering Students Through <span className="text-blue-600">Modern Education</span>
                        </h2>

                        <p className="mt-4 text-gray-600 leading-relaxed text-sm">
                            Our Learning Management System is a modern, flexible, and interactive platform designed to provide high-quality education to students worldwide. We believe in accessible, practical education that prepares students for real-world challenges.
                        </p>

                        {/* Checklist */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={16} className="text-blue-600" />
                                </div>
                                <span className="text-gray-700 font-medium text-sm">Experienced Faculty Members</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={16} className="text-blue-600" />
                                </div>
                                <span className="text-gray-700 font-medium text-sm">Industry-Oriented Courses</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={16} className="text-blue-600" />
                                </div>
                                <span className="text-gray-700 font-medium text-sm">Online Learning Platform</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={16} className="text-blue-600" />
                                </div>
                                <span className="text-gray-700 font-medium text-sm">International Certifications</span>
                            </div>
                        </div>

                        {/* Learn More Button */}
                        <Link href="/about">
                            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all hover:shadow-lg flex items-center gap-2 w-fit text-sm">
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