"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Award, BookOpen, Users, Star, Calendar } from "lucide-react";

export default function TeacherProfilePage() {
    const params = useParams();
    const [teacher, setTeacher] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!params.id) return;
        fetchTeacherProfile();
    }, [params.id]);

    async function fetchTeacherProfile() {
        try {
            const res = await fetch(`/api/teachers/${params.id}/public`);
            const data = await res.json();

            console.log("Teacher API Response:", data);

            if (data.success) {
                console.log("Teacher Data:", data.result);
                console.log("Courses Data:", data.courses);
                setTeacher(data.result);
                setCourses(data.courses || []);
            } else {
                setError(data.message || "Teacher not found");
            }
        } catch (err) {
            setError("Failed to load teacher profile");
            console.error("Teacher Profile Error:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-20">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-slate-200 rounded w-32"></div>
                        <div className="flex gap-8">
                            <div className="h-64 w-64 bg-slate-200 rounded-2xl flex-shrink-0"></div>
                            <div className="flex-1 space-y-4">
                                <div className="h-12 bg-slate-200 rounded-lg w-2/3"></div>
                                <div className="h-20 bg-slate-200 rounded-lg"></div>
                                <div className="h-10 bg-slate-200 rounded-lg w-1/3"></div>
                            </div>
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
                    <Link href="/teachers" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold">
                        <ArrowLeft size={20} />
                        Back to Teachers
                    </Link>
                    <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200">{error}</div>
                </div>
            </div>
        );
    }

    if (!teacher) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
            {/* Header Navigation */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
                <div className="max-w-6xl mx-auto px-6 py-3">
                    <Link href="/teachers" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition">
                        <ArrowLeft size={18} />
                        Back to Teachers
                    </Link>
                </div>
            </div>

            {/* Profile Section */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Left - Profile Info */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Profile Image */}
                            <div className="md:col-span-1">
                                <div className="rounded-2xl overflow-hidden shadow-xl h-80 bg-gradient-to-br from-blue-100 to-indigo-100">
                                    {teacher.image ? (
                                        <img
                                            src={teacher.image}
                                            alt={teacher.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-blue-200">
                                            <Award size={80} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="md:col-span-1 flex flex-col justify-between">
                                <div>
                                    <div className="mb-4">
                                        <span className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-200/60">
                                            👨‍🏫 Professional Teacher
                                        </span>
                                    </div>

                                    <h1 className="text-4xl font-bold text-slate-900 mb-3">
                                        {teacher.name}
                                    </h1>

                                    {teacher.bio && (
                                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                            {teacher.bio}
                                        </p>
                                    )}
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-3 pt-6 border-t border-slate-200">
                                    {teacher.email && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                                <Mail size={18} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                                                <p className="font-semibold text-slate-900 text-sm">{teacher.email}</p>
                                            </div>
                                        </div>
                                    )}

                                    {teacher.phone && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                                                <Phone size={18} className="text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider">Phone</p>
                                                <p className="font-semibold text-slate-900 text-sm">{teacher.phone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {teacher.address && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                                                <MapPin size={18} className="text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
                                                <p className="font-semibold text-slate-900 text-sm">{teacher.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200">
                            <div className="bg-white rounded-xl p-6 border border-slate-200/60 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mx-auto mb-3">
                                    <BookOpen size={24} className="text-blue-600" />
                                </div>
                                <p className="text-2xl font-bold text-slate-900">{courses.length}</p>
                                <p className="text-sm text-slate-600 mt-1">Courses</p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-slate-200/60 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 mx-auto mb-3">
                                    <Star size={24} className="text-emerald-600 fill-emerald-600" />
                                </div>
                                <p className="text-2xl font-bold text-slate-900">N/A</p>
                                <p className="text-sm text-slate-600 mt-1">Rating</p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-slate-200/60 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 mx-auto mb-3">
                                    <Users size={24} className="text-amber-600" />
                                </div>
                                <p className="text-2xl font-bold text-slate-900">-</p>
                                <p className="text-sm text-slate-600 mt-1">Students</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Quick Info */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Teacher Info</h3>

                            <div className="space-y-5">
                                {teacher.gender && (
                                    <div className="pb-5 border-b border-slate-200">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Gender</p>
                                        <p className="text-slate-900 font-semibold mt-2">{teacher.gender}</p>
                                    </div>
                                )}

                                {teacher.dateOfBirth && (
                                    <div className="pb-5 border-b border-slate-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar size={16} className="text-blue-600" />
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Date of Birth</p>
                                        </div>
                                        <p className="text-slate-900 font-semibold mt-2">
                                            {new Date(teacher.dateOfBirth).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                <div className="pb-5 border-b border-slate-200">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Status</p>
                                    <div className="mt-2">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                            teacher.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}>
                                            {teacher.status || "Active"}
                                        </span>
                                    </div>
                                </div>

                                {teacher.isFeatured && (
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">⭐ Featured Teacher</p>
                                        <p className="text-sm text-blue-600 mt-2">This is one of our top-rated teachers</p>
                                    </div>
                                )}
                            </div>

                            {/* Message Button */}
                            <button className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Contact Teacher
                            </button>
                        </div>
                    </div>
                </div>

                {/* Teacher's Courses */}
                {courses.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-slate-200">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">Courses by {teacher.name.split(" ")[0]}</h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.slice(0, 6).map((course) => (
                                <Link href={`/courses/${course._id}`} key={course._id} className="group">
                                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-slate-100/60 h-full">
                                        <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                                            {course.thumbnail && (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold mb-2">
                                                {course.category}
                                            </span>
                                            <h4 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                                                {course.title}
                                            </h4>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-blue-600">${course.price}</span>
                                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold">
                                                    {course.level}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {courses.length > 6 && (
                            <div className="text-center mt-8">
                                <Link href={`/courses?instructor=${teacher.name}`} className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700">
                                    View All Courses
                                    <span>→</span>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
