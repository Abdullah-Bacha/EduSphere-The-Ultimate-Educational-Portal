import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Course from "@/models/Course";

// Enrollment is stored on the student (User.enrolledCourses). We aggregate
// those references to derive per-course enrollment counts, then join course
// metadata (title, price, category) on top.
export async function getEnrollmentOverview() {
    await dbConnect();

    const [courses, agg, studentsEnrolled] = await Promise.all([
        Course.find()
            .select("title instructor category price isPublished")
            .sort({ createdAt: -1 })
            .lean(),
        User.aggregate([
            { $match: { role: "student" } },
            { $unwind: "$enrolledCourses" },
            { $group: { _id: "$enrolledCourses", count: { $sum: 1 } } },
        ]),
        User.countDocuments({
            role: "student",
            "enrolledCourses.0": { $exists: true },
        }),
    ]);

    const countMap = new Map(agg.map((a) => [String(a._id), a.count]));

    const rows = courses.map((c) => ({
        _id: String(c._id),
        title: c.title,
        instructor: c.instructor,
        category: c.category,
        price: c.price || 0,
        isPublished: c.isPublished,
        enrolled: countMap.get(String(c._id)) || 0,
    }));

    const totalEnrollments = rows.reduce((sum, r) => sum + r.enrolled, 0);

    return {
        rows,
        totalEnrollments,
        totalCourses: rows.length,
        activeCourses: rows.filter((r) => r.enrolled > 0).length,
        studentsEnrolled,
    };
}

export async function getRevenueReport() {
    const { rows, totalEnrollments } = await getEnrollmentOverview();

    const withRevenue = rows.map((r) => ({
        ...r,
        revenue: r.price * r.enrolled,
    }));

    const totalRevenue = withRevenue.reduce((sum, r) => sum + r.revenue, 0);
    const paidEnrollments = withRevenue
        .filter((r) => r.price > 0)
        .reduce((sum, r) => sum + r.enrolled, 0);

    const topCourses = [...withRevenue]
        .filter((r) => r.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 8);

    const categoryMap = {};
    withRevenue.forEach((r) => {
        categoryMap[r.category] = (categoryMap[r.category] || 0) + r.revenue;
    });
    const byCategory = Object.entries(categoryMap)
        .map(([category, revenue]) => ({ category, revenue }))
        .filter((c) => c.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue);

    const avgPrice = rows.length
        ? Math.round(rows.reduce((sum, r) => sum + r.price, 0) / rows.length)
        : 0;

    return {
        totalRevenue,
        paidEnrollments,
        totalEnrollments,
        avgPrice,
        topCourses,
        byCategory,
    };
}
