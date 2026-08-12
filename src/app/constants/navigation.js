import {
    House,
    CircleHelp,
    BookOpen,
    Users,
    Mail,
    LayoutDashboard,
    GraduationCap,
    FolderOpen,
    Settings,
    Sparkles,
    Play,
    ClipboardList,
    Brain,
    Bell,
    UserCircle,
    BarChart2,
    Award,
    Search,
    ShieldCheck,
    UserCheck,
    TrendingUp,
    BookMarked,
    Megaphone,
    BarChart3,
    MessageSquare,
    MessageSquareQuote,
    Globe,
} from "lucide-react";

export const publicNavigation = [
    {
        title: "Home",
        href: "/",
        icon: House,
    },
    {
        title: "About",
        href: "/about",
        icon: CircleHelp,
    },
    {
        title: "Courses",
        href: "/courses",
        icon: BookOpen,
    },
    {
        title: "Teachers",
        href: "/teachers",
        icon: Users,
    },
    {
        title: "Contact",
        href: "/contact",
        icon: Mail,
    },
];

export const studentNavigation = [
    {
        name: "Dashboard",
        href: "/dashboard/student",
        icon: LayoutDashboard,
    },
    {
        name: "My Courses",
        href: "/dashboard/student/my-courses",
        icon: BookOpen,
    },
    {
        name: "Lessons",
        href: "/dashboard/student/lessons",
        icon: Play,
    },
    {
        name: "Assignments",
        href: "/dashboard/student/assignments",
        icon: ClipboardList,
    },
    {
        name: "Quizzes",
        href: "/dashboard/student/quizzes",
        icon: Brain,
    },
    {
        name: "Progress",
        href: "/dashboard/student/progress",
        icon: BarChart2,
    },
    {
        name: "Certificates",
        href: "/dashboard/student/certificates",
        icon: Award,
    },
    {
        name: "Notifications",
        href: "/dashboard/student/notifications",
        icon: Bell,
    },
    {
        name: "Messages",
        href: "/dashboard/student/messages",
        icon: MessageSquare,
    },
    {
        name: "Feedback",
        href: "/dashboard/student/feedback",
        icon: MessageSquareQuote,
    },
    {
        name: "Profile",
        href: "/dashboard/student/profile",
        icon: UserCircle,
    },
];

export const adminNavigation = [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Students", href: "/dashboard/students", icon: Users },
    { name: "Teachers", href: "/dashboard/teachers", icon: GraduationCap },
    { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
    { name: "Categories", href: "/dashboard/admin/categories", icon: FolderOpen },
    { name: "Website Settings", href: "/dashboard/admin/website-settings", icon: Globe },
    { name: "Announcements", href: "/dashboard/admin/announcements", icon: Bell },
    { name: "Search", href: "/dashboard/admin/search", icon: Search },
    { name: "Certificates", href: "/dashboard/admin/certificates", icon: Award },
    { name: "Enrollments", href: "/dashboard/admin/enrollments", icon: UserCheck },
    { name: "Assessments", href: "/dashboard/admin/assessments", icon: Brain },
    { name: "Approvals", href: "/dashboard/admin/approvals", icon: ShieldCheck },
    { name: "Progress", href: "/dashboard/admin/progress", icon: BarChart2 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const teacherNavigation = [
    { name: "Dashboard", href: "/dashboard/teacher", icon: LayoutDashboard },
    { name: "My Courses", href: "/dashboard/teacher/courses", icon: BookOpen },
    { name: "Students", href: "/dashboard/teacher/students", icon: Users },

    // New Phase 2 Features
    { name: "Student Performance", href: "/dashboard/teacher/students-performance", icon: TrendingUp },
    { name: "Grade Book", href: "/dashboard/teacher/grade-book", icon: BookMarked },
    { name: "Announcements", href: "/dashboard/teacher/announcements", icon: Megaphone },
    { name: "Analytics & Reports", href: "/dashboard/teacher/analytics", icon: BarChart3 },
    { name: "Messages", href: "/dashboard/teacher/messages", icon: MessageSquare },

    { name: "Lessons", href: "/dashboard/teacher/lessons", icon: Play },
    { name: "Assignments", href: "/dashboard/teacher/assignments", icon: ClipboardList },
    { name: "Quizzes", href: "/dashboard/teacher/quizzes", icon: Brain },
    { name: "Notifications", href: "/dashboard/teacher/notifications", icon: Bell },
    { name: "Profile", href: "/dashboard/teacher/profile", icon: UserCircle },
    { name: "Settings", href: "/dashboard/teacher/settings", icon: Settings },
];