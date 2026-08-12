import Link from "next/link";
import Container from "@/app/components/ui/Container";
import { Star, Users, Clock, Check, ArrowRight } from "lucide-react";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import User from "@/models/User";

const perks = [
    "Project-based curriculum",
    "Lifetime access to materials",
    "Certificate of completion",
    "Instructor Q&A support",
];

async function getFeaturedCourse() {
    await dbConnect();

    const course = await Course.findOne({ isPublished: true, approvalStatus: "Approved" })
        .sort({ createdAt: -1 })
        .lean();

    if (!course) return null;

    const enrolledCount = await User.countDocuments({ enrolledCourses: course._id });

    return {
        ...course,
        _id: String(course._id),
        enrolledCount,
    };
}

export default async function FeaturedCourseBanner() {
    const course = await getFeaturedCourse();

    if (!course) {
        return null;
    }

    const stack = [course.category, course.level];
    const stats = [
        { icon: Star, value: "4.9", label: "Rating" },
        { icon: Users, value: course.enrolledCount > 0 ? `${course.enrolledCount}+` : "New", label: "Students" },
        { icon: Clock, value: course.duration, label: "Duration" },
    ];

    return (
        <section
            className="py-20"
            style={{
                backgroundImage:
                    "linear-gradient(155deg, #f9fafb 0%, rgba(246,249,252,0.7) 50%, rgba(239,246,255,0.4) 100%)",
            }}
        >
            <Container>
                <div className="text-center mb-12">
                    <span className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold">
                        Featured Course
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Build Skills That Employers Are Looking For
                    </h2>
                </div>

                <div className="rounded-[24px] border border-gray-100 shadow-[0_20px_25px_-5px_rgba(219,234,254,0.4),0_8px_10px_-6px_rgba(219,234,254,0.4)] overflow-hidden grid lg:grid-cols-2">
                    <div
                        className="relative p-10 flex flex-col justify-center overflow-hidden"
                        style={{ backgroundImage: "linear-gradient(145deg, #155dfc 0%, #4f39f6 50%, #193cb8 100%)" }}
                    >
                        <div className="absolute -top-12 right-24 w-48 h-48 rounded-full bg-white/10" />
                        <div className="absolute bottom-8 -left-12 w-60 h-60 rounded-full bg-white/5" />

                        <div className="relative">
                            <span className="inline-block mb-4 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold">
                                ⭐ Featured Pick
                            </span>
                            <h3 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                                {course.title}
                            </h3>
                            <p className="mt-3 text-blue-100 text-sm leading-relaxed max-w-md line-clamp-3">
                                {course.description}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-8">
                                {stack.map((item) => (
                                    <span key={item} className="px-3 py-1 rounded-[10px] bg-white/15 text-white text-xs font-semibold">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-blue-50 ring-2 ring-blue-100 shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400">Instructor</p>
                                <p className="text-sm font-bold text-gray-900">{course.instructor}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6">
                            {stats.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={stat.label} className="bg-gray-50 rounded-2xl p-3 text-center">
                                        <Icon size={16} className="mx-auto text-blue-600" fill="currentColor" />
                                        <p className="mt-1 text-sm font-extrabold text-gray-900">{stat.value}</p>
                                        <p className="text-xs text-gray-400">{stat.label}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <ul className="mt-6 space-y-2">
                            {perks.map((perk) => (
                                <li key={perk} className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check size={16} className="text-emerald-500 shrink-0" />
                                    {perk}
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center justify-between mt-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                    {course.price > 0 ? `$${course.price}` : "Free"}
                                </span>
                            </div>
                            <Link
                                href={`/courses/${course._id}`}
                                className="inline-flex items-center gap-2 rounded-[14px] bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 text-white font-semibold hover:shadow-lg transition-shadow"
                            >
                                Explore Course
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
