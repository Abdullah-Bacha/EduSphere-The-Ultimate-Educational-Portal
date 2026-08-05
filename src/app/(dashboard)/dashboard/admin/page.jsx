import { requireAdmin } from "@/lib/auth";
import {
    Users,
    GraduationCap,
    BookOpen,
    FolderOpen,
    Sparkles,
    FileText,
    ClipboardList,
    HelpCircle,
    Award,
    TrendingUp,
} from "lucide-react";

import StatCard from "@/app/components/dashboard/StatCard";
import AnalyticsChart from "@/app/components/dashboard/AnalyticsChart";
import AdminTrendsChart from "@/app/components/dashboard/AdminTrendsChart";
import RecentUsersChart from "@/app/components/dashboard/RecentUsersChart";
import RecentCoursesChart from "@/app/components/dashboard/RecentCoursesChart";
import PageHeader from "@/app/components/ui/PageHeader";

import {
    getDashboardStats,
    getRecentUsers,
    getRecentCourses,
} from "@/services/dashboardService";

export default async function AdminDashboard() {
    await requireAdmin();

    const stats = await getDashboardStats();
    const recentUsers = await getRecentUsers();
    const recentCourses = await getRecentCourses();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Admin Dashboard"
                description="A premium operational view of your learning ecosystem, people, and growth signals."
                breadcrumb="Operations"
                icon={<Sparkles size={20} />}
                className="border-white/10 bg-[#111827]/90 text-slate-100 shadow-[0_24px_70px_-34px_rgba(2,8,23,0.95)]"
                iconClassName="bg-cyan-500/15 text-cyan-300"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard title="Total Students" value={stats.totalStudents} icon={<Users size={18} />} />
                <StatCard title="Active Teachers" value={stats.totalTeachers} icon={<GraduationCap size={18} />} />
                <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={18} />} />
                <StatCard title="Active Courses" value={stats.totalCourses} icon={<BookOpen size={18} />} />
                <StatCard title="Categories" value={stats.totalCategories} icon={<FolderOpen size={18} />} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard title="Lessons" value={stats.totalLessons} icon={<FileText size={18} />} />
                <StatCard title="Assignments" value={stats.totalAssignments} icon={<ClipboardList size={18} />} />
                <StatCard title="Quizzes" value={stats.totalQuizzes} icon={<HelpCircle size={18} />} />
                <StatCard title="Certificates Issued" value={stats.totalCertificates} icon={<Award size={18} />} />
                <StatCard
                    title="Avg. Completion Rate"
                    value={`${stats.averageCompletionRate}%`}
                    icon={<TrendingUp size={18} />}
                />
            </div>

            <AnalyticsChart
                data={[
                    { name: "Students", value: stats.totalStudents },
                    { name: "Teachers", value: stats.totalTeachers },
                    { name: "Courses", value: stats.totalCourses },
                    { name: "Categories", value: stats.totalCategories },
                    { name: "Lessons", value: stats.totalLessons },
                    { name: "Assignments", value: stats.totalAssignments },
                    { name: "Quizzes", value: stats.totalQuizzes },
                    { name: "Certificates", value: stats.totalCertificates },
                ]}
            />

            <AdminTrendsChart />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <RecentUsersChart users={recentUsers} />
                <RecentCoursesChart courses={recentCourses} />
            </div>
        </div>
    );
}