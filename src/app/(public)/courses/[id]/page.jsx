"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, BarChart3, Users, ArrowLeft, ShoppingCart, Star, CheckCircle, Globe } from "lucide-react";
import CourseEnrollModal from "@/app/components/CourseEnrollModal";

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [enrolled, setEnrolled] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);

    useEffect(() => {
        if (!params.id) return;
        fetchCourseDetails();
    }, [params.id]);

    async function fetchCourseDetails() {
        try {
            const res = await fetch(`/api/courses/${params.id}`);
            const data = await res.json();

            if (data.success) {
                setCourse(data.result);
                checkEnrollmentStatus();
            } else {
                setError(data.message || "Course not found");
            }
        } catch (err) {
            setError("Failed to load course details");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function checkEnrollmentStatus() {
        try {
            const res = await fetch("/api/student/my-courses");
            if (res.ok) {
                const data = await res.json();
                const isEnrolled = data.data?.some(c => c._id === params.id);
                setEnrolled(isEnrolled || false);
            }
        } catch (err) {
            console.error("Error checking enrollment:", err);
        }
    }

    function handleEnrollClick() {
        setShowEnrollModal(true);
    }

    function handleEnrollSuccess() {
        setShowEnrollModal(false);
        setEnrolled(true);
        router.push(`/dashboard/student/lessons?courseId=${params.id}`);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-20">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-slate-200 rounded w-32"></div>
                        <div className="h-96 bg-slate-200 rounded-2xl"></div>
                        <div className="h-12 bg-slate-200 rounded-lg w-2/3"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-20">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <Link href="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold">
                        <ArrowLeft size={20} />
                        Back to Courses
                    </Link>
                    <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200">{error}</div>
                </div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
            {/* Header Navigation */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
                <div className="max-w-6xl mx-auto px-6 py-3">
                    <Link href="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition">
                        <ArrowLeft size={18} />
                        Back to Courses
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Content */}
                        <div className="lg:col-span-2">
                            {/* Course Image */}
                            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-96 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>

                            {/* Course Title & Meta */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-200/60">
                                        {course.category}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-bold">
                                        ⭐ {course.level} Level
                                    </span>
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                                    {course.title}
                                </h1>

                                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                    {course.description}
                                </p>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                            <Users size={24} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">Instructor</p>
                                            {course.teacher ? (
                                                <Link href={`/teachers/${course.teacher}`} className="font-bold text-blue-600 hover:text-blue-700 transition">
                                                    {course.instructor}
                                                </Link>
                                            ) : (
                                                <p className="font-bold text-slate-900">{course.instructor}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                                            <Clock size={24} className="text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">Duration</p>
                                            <p className="font-bold text-slate-900">{course.duration}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                                            <BarChart3 size={24} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">Difficulty</p>
                                            <p className="font-bold text-slate-900">{course.level}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Course Features */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">What You'll Learn</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        "Master core concepts and fundamentals",
                                        "Build real-world projects",
                                        "Learn industry best practices",
                                        "Get hands-on experience",
                                        "Receive expert guidance",
                                        "Earn certificate upon completion"
                                    ].map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200/60">
                                            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700 text-sm font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Course Details */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-6 border border-slate-200/60">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Globe size={20} className="text-blue-600" />
                                        <h3 className="font-bold text-slate-900">Course Type</h3>
                                    </div>
                                    <p className="text-slate-600">Online Self-Paced</p>
                                </div>

                                <div className="bg-white rounded-xl p-6 border border-slate-200/60">
                                    <div className="flex items-center gap-3 mb-3">
                                        <BookOpen size={20} className="text-indigo-600" />
                                        <h3 className="font-bold text-slate-900">Certification</h3>
                                    </div>
                                    <p className="text-slate-600">Certificate of Completion</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar - Enrollment Card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                                {/* Price Section */}
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white">
                                    <p className="text-sm opacity-90 mb-2">Course Price</p>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-4xl font-bold">${course.price}</span>
                                        {course.price > 0 && (
                                            <span className="text-sm line-through opacity-75">
                                                ${Math.round(course.price * 1.3)}
                                            </span>
                                        )}
                                    </div>
                                    {course.price > 0 && (
                                        <p className="text-xs opacity-90">Save ${Math.round(course.price * 0.3)} (23% off)</p>
                                    )}
                                </div>

                                {/* Enrollment Section */}
                                <div className="p-8">
                                    {enrolled ? (
                                        <Link
                                            href={`/dashboard/student/lessons?courseId=${course._id}`}
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
                                        >
                                            <BookOpen size={20} />
                                            Go to Lessons
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleEnrollClick}
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
                                        >
                                            <ShoppingCart size={20} />
                                            Enroll Now
                                        </button>
                                    )}

                                    {/* Benefits */}
                                    <div className="space-y-3 pt-6 border-t border-slate-200">
                                        <div className="flex items-center gap-3 text-sm">
                                            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                                            <span className="text-slate-700">Lifetime access</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                                            <span className="text-slate-700">Self-paced learning</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                                            <span className="text-slate-700">Certificate included</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                                            <span className="text-slate-700">Full course materials</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    {course.isPublished && (
                                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                                            <p className="text-xs font-bold text-green-700 uppercase tracking-wider">✓ Course Active</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enroll Modal */}
            {showEnrollModal && (
                <CourseEnrollModal
                    courseId={course._id}
                    courseName={course.title}
                    onClose={() => setShowEnrollModal(false)}
                    onEnrollSuccess={handleEnrollSuccess}
                />
            )}
        </div>
    );
}
