import dbConnect from "@/lib/dbConnect";
import Progress from "@/models/Progress";
import User from "@/models/User";
import Course from "@/models/Course";

// User and Course are imported so their schemas are registered for populate().
void User;
void Course;

export async function getProgressOverview() {
    await dbConnect();

    const records = await Progress.find()
        .sort({ completionPercentage: 1, lastAccessed: -1 })
        .populate({ path: "student", select: "name email" })
        .populate({ path: "course", select: "title category" })
        .lean();

    const rows = records
        .filter((r) => r.student && r.course)
        .map((r) => ({
            _id: String(r._id),
            student: r.student.name,
            email: r.student.email,
            course: r.course.title,
            category: r.course.category,
            completion: r.completionPercentage || 0,
            lastAccessed: r.lastAccessed
                ? new Date(r.lastAccessed).toISOString()
                : null,
        }));

    const total = rows.length;
    const avg = total
        ? Math.round(rows.reduce((sum, r) => sum + r.completion, 0) / total)
        : 0;

    return {
        rows,
        total,
        avg,
        completed: rows.filter((r) => r.completion >= 100).length,
        atRisk: rows.filter((r) => r.completion < 30).length,
    };
}
