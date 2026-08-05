"use client";

import {
    FileText,
    Users,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    BookOpen,
    Award,
    UserPlus
} from "lucide-react";

export default function ActivityIcon({ type, size = 16 }) {
    const iconProps = { size, className: "text-slate-600" };
    const coloredIconProps = { size, className: "" };

    const getActivityIcon = () => {
        switch (type) {
            case "submission":
                return <FileText {...coloredIconProps} className="text-blue-600" />;
            case "graded":
                return <CheckCircle2 {...coloredIconProps} className="text-green-600" />;
            case "enrollment":
                return <UserPlus {...coloredIconProps} className="text-purple-600" />;
            case "message":
                return <MessageSquare {...coloredIconProps} className="text-indigo-600" />;
            case "course_created":
                return <BookOpen {...coloredIconProps} className="text-orange-600" />;
            case "quiz_completed":
                return <Award {...coloredIconProps} className="text-yellow-600" />;
            case "pending":
                return <AlertCircle {...coloredIconProps} className="text-amber-600" />;
            case "students":
                return <Users {...coloredIconProps} className="text-cyan-600" />;
            default:
                return <FileText {...iconProps} />;
        }
    };

    return getActivityIcon();
}
