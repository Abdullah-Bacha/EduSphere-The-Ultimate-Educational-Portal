import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import User from "@/models/User";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lms-nextjs-rho.vercel.app";

export default async function sitemap() {
    await dbConnect();

    const [courses, teachers] = await Promise.all([
        Course.find({ isPublished: true }).select("_id updatedAt").lean(),
        User.find({ role: "teacher" }).select("_id updatedAt").lean(),
    ]);

    const staticRoutes = [
        "",
        "/about",
        "/courses",
        "/teachers",
        "/contact",
        "/login",
        "/register",
        "/privacy-policy",
        "/terms-of-service",
    ].map(
        (route) => ({
            url: `${siteUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: route === "" ? "weekly" : "monthly",
            priority: route === "" ? 1 : 0.7,
        })
    );

    const courseRoutes = courses.map((c) => ({
        url: `${siteUrl}/courses/${c._id}`,
        lastModified: c.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
    }));

    const teacherRoutes = teachers.map((t) => ({
        url: `${siteUrl}/teachers/${t._id}`,
        lastModified: t.updatedAt || new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
    }));

    return [...staticRoutes, ...courseRoutes, ...teacherRoutes];
}
