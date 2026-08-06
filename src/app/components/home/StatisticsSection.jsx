import { Users, GraduationCap, BookOpen, FolderOpen } from "lucide-react";
import User from "@/models/User";
import Course from "@/models/Course";
import Category from "@/models/Category";
import dbConnect from "@/lib/dbConnect";

async function getStats() {
    await dbConnect();

    const [students, teachers, courses, categories] =
        await Promise.all([
            User.countDocuments({
                role: "student",
            }),

            User.countDocuments({
                role: "teacher",
            }),

            Course.countDocuments(),

            Category.countDocuments(),
        ]);

    return {
        students,
        teachers,
        courses,
        categories,
    };
}

export default async function StatisticsSection() {
    const stats = await getStats();

    const items = [
        {
            title: "Students",
            value: stats.students,
            icon: Users,
        },
        {
            title: "Teachers",
            value: stats.teachers,
            icon: GraduationCap,
        },
        {
            title: "Courses",
            value: stats.courses,
            icon: BookOpen,
        },
        {
            title: "Categories",
            value: stats.categories,
            icon: FolderOpen,
        },
    ];

    return (
        <section className="py-24 bg-gradient-to-r from-[var(--accent)] to-indigo-700">

            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">

                    <span className="text-white/80 uppercase tracking-widest font-semibold text-sm">
                        Our Achievement
                    </span>

                    <h2 className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-6">
                        University In Numbers
                    </h2>

                    <p className="text-white/70 text-base max-w-2xl mx-auto leading-relaxed">
                        Thousands of learners trust our university to build their future through quality education.
                    </p>

                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

                    {items.map((item) => {

                        const Icon = item.icon;

                        return (

                            <div
                                key={item.title}
                                className="bg-white/10 backdrop-blur-md rounded-[var(--radius-lg)] p-8 text-center border border-white/20 hover:-translate-y-1 transition duration-300"
                            >

                                <div className="flex justify-center mb-5">

                                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center">

                                        <Icon
                                            className="text-[var(--accent)]"
                                            size={32}
                                        />

                                    </div>

                                </div>

                                <h3 className="text-5xl font-bold text-white">

                                    {item.value}+

                                </h3>

                                <p className="text-blue-100 mt-3 text-lg">

                                    {item.title}

                                </p>

                            </div>

                        );
                    })}

                </div>

            </div>

        </section>
    );
}