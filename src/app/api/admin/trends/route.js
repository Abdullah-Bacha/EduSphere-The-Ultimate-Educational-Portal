import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import User from "@/models/User";
import Course from "@/models/Course";
import Certificate from "@/models/Certificate";
import dbConnect from "@/lib/dbConnect";

export const dynamic = "force-dynamic";

function monthLabel(date) {
    return date.toLocaleString("en-US", { month: "short", year: "2-digit" });
}

function last6Months() {
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        months.push({
            label: monthLabel(d),
            start: new Date(d.getFullYear(), d.getMonth(), 1),
            end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
        });
    }
    return months;
}

export async function GET() {
    try {
        await requireAdmin();
        await dbConnect();

        const months = last6Months();

        const [studentCounts, teacherCounts, courseCounts, certCounts] = await Promise.all([
            Promise.all(months.map(m => User.countDocuments({ role: "student", createdAt: { $gte: m.start, $lte: m.end } }))),
            Promise.all(months.map(m => User.countDocuments({ role: "teacher", createdAt: { $gte: m.start, $lte: m.end } }))),
            Promise.all(months.map(m => Course.countDocuments({ createdAt: { $gte: m.start, $lte: m.end } }))),
            Promise.all(months.map(m => Certificate.countDocuments({ issueDate: { $gte: m.start, $lte: m.end } }))),
        ]);

        const trend = months.map((m, i) => ({
            month: m.label,
            students: studentCounts[i],
            teachers: teacherCounts[i],
            courses: courseCounts[i],
            certificates: certCounts[i],
        }));

        return NextResponse.json({ success: true, result: { trend } });
    } catch (error) {
        const status = error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}
