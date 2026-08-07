import Link from "next/link";
import { getFeaturedCourses } from "@/services/courseService";
import { BookOpen, Clock, BarChart3, Star, Users, ArrowRight } from "lucide-react";

export default async function FeaturedCourses() {
    const courses = await getFeaturedCourses(6);

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center gap-2 mb-4 bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
                            Featured Courses
                        </span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6">
                        Learn From Our Most Popular Courses
                    </h2>

                    <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
                        Explore our latest professional courses designed by experienced instructors to help you master in-demand skills.
                    </p>
                </div>

                {/* Course Cards Grid - 3 columns for featured courses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {courses.map((course) => (
                        <Link
                            href={`/courses/${course._id}`}
                            key={course._id}
                            className="group h-full"
                        >
                            <div className="h-full bg-[var(--surface)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col border border-[var(--border)]">

                                {/* Image Container - Smaller Height */}
                                <div className="relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 h-40">
                                    <img
                                        src={course.thumbnail || "/images/course-placeholder.svg"}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                                    />
                                    {/* Level Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur text-blue-600 px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                                            ⭐ {course.level}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-4 flex-1 flex flex-col">

                                    {/* Category Badge */}
                                    <div className="mb-3">
                                        <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide border border-blue-200/50">
                                            {course.category}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition leading-snug">
                                        {course.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-600 text-xs mb-3 line-clamp-2 flex-1">
                                        {course.description}
                                    </p>

                                    {/* Quick Info - Compact */}
                                    <div className="space-y-2 mb-4 py-3 border-t border-b border-slate-100 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                                                <Users size={14} className="text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-slate-500 text-xs uppercase tracking-widest">By</p>
                                                <p className="font-semibold text-slate-900 truncate text-xs">{course.instructor}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 flex-shrink-0">
                                                <Clock size={14} className="text-amber-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-slate-500 text-xs uppercase tracking-widest">Duration</p>
                                                <p className="font-semibold text-slate-900 truncate text-xs">{course.duration}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer - Price & Button */}
                                    <div className="flex items-center justify-between gap-3 pt-2">
                                        <div className="flex-1">
                                            {course.price > 0 ? (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-lg font-bold text-slate-900">
                                                        ${course.price}
                                                    </span>
                                                    <span className="text-xs text-slate-400 line-through">
                                                        ${Math.round(course.price * 1.3)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm font-bold text-green-600">
                                                    Free
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-110">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <Link
                        href="/courses"
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
                    >
                        <span>View All Courses</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
