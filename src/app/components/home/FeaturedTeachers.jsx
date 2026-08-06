import Link from "next/link";
import { getFeaturedTeachers } from "@/services/teacherService";
import { Mail, Phone, MapPin, Award, ArrowRight } from "lucide-react";

export default async function FeaturedTeachers() {
    const teachers = await getFeaturedTeachers(4);

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center gap-2 mb-4 bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
                            Our Teachers
                        </span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6">
                        Learn From Expert Teachers
                    </h2>

                    <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
                        Meet our experienced and dedicated teachers committed to helping students succeed in their learning journey.
                    </p>
                </div>

                {/* Teachers Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {teachers.map((teacher) => (
                        <Link
                            href={`/teachers/${teacher._id}`}
                            key={teacher._id}
                            className="group h-full"
                        >
                            <div className="h-full bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-[var(--border)] overflow-hidden flex flex-col">

                                {/* Image Container */}
                                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden flex items-center justify-center">
                                    {teacher.image && teacher.image.trim() !== "" ? (
                                        <img
                                            src={teacher.image}
                                            alt={teacher.name}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextElementSibling.style.display = "flex";
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full flex items-center justify-center text-blue-300 bg-gradient-to-br from-blue-100 to-indigo-100 ${teacher.image && teacher.image.trim() !== "" ? 'hidden' : ''}`}>
                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">

                                    {/* Name */}
                                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition line-clamp-2">
                                        {teacher.name || "Teacher"}
                                    </h3>

                                    {/* Bio/Specialty */}
                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1">
                                        {teacher.bio || "Professional Instructor"}
                                    </p>

                                    {/* Contact Info - No Underlines */}
                                    <div className="space-y-2 py-4 border-t border-b border-slate-100/60 mb-4">
                                        {teacher.phone && (
                                            <div className="flex items-center gap-2 text-xs text-slate-700">
                                                <Phone size={14} className="text-blue-600 flex-shrink-0" />
                                                <span className="font-medium">{teacher.phone}</span>
                                            </div>
                                        )}
                                        {teacher.email && (
                                            <div className="flex items-center gap-2 text-xs text-slate-700">
                                                <Mail size={14} className="text-blue-600 flex-shrink-0" />
                                                <span className="font-medium truncate">{teacher.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Badge */}
                                    {teacher.isFeatured && (
                                        <div className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border border-blue-200/50 mb-4 self-start">
                                            ⭐ Expert Teacher
                                        </div>
                                    )}

                                    {/* CTA - No Underline */}
                                    <div className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition mt-auto">
                                        <span>View Profile</span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <Link
                        href="/teachers"
                        className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-8 py-3.5 rounded-[var(--radius-md)] font-semibold transition-all duration-200 hover:shadow-md"
                    >
                        View All Teachers
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
