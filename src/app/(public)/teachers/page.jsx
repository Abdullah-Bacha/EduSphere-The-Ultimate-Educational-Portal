import TeacherDirectory from "@/app/components/teachers/TeacherDirectory";
import WhyOurTeachers from "@/app/components/teachers/WhyOurTeachers";
import StatisticsSection from "@/app/components/home/StatisticsSection";
import CTASection from "@/app/components/home/CTASection";
import FooterSection from "@/app/components/home/FooterSection";
import { getTeachersWithStats } from "@/services/teacherService";
import { BookOpen, Users } from "lucide-react";

export const metadata = {
    title: "Teachers",
    description:
        "Meet the experienced, dedicated teachers at LMS University who help students master in-demand skills.",
};

export default async function TeachersPage() {
    const teachers = await getTeachersWithStats();

    return (
        <main>
            <TeacherDirectory teachers={teachers} />

            <StatisticsSection />

            <WhyOurTeachers />

            <CTASection
                badge="Join Us"
                title="Learn From the Best"
                description="Join thousands of learners and start building practical skills with experienced instructors at LMS University."
                primaryHref="/courses"
                primaryLabel="Explore Courses"
                primaryIcon={BookOpen}
                secondaryHref="/teachers"
                secondaryLabel="Meet Our Teachers"
                secondaryIcon={Users}
                background="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
            />

            <FooterSection />
        </main>
    );
}
