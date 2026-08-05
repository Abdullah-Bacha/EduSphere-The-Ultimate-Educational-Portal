import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Course from "@/models/Course";
import Category from "@/models/Category";
import ContactMessage from "@/models/ContactMessage";
import { getWebsiteSettings } from "@/services/websiteSettingService";
import { getTestimonials } from "@/services/testimonialService";
import { getDashboardStats } from "@/services/dashboardService";

export async function getPublicStats() {
    const stats = await getDashboardStats();

    return {
        students: stats.totalStudents,
        courses: stats.totalCourses,
        teachers: stats.totalTeachers,
        categories: stats.totalCategories,
    };
}

export async function getFeaturedCourses(limit = 6) {
    await dbConnect();

    const docs = await Course.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return docs.map((doc) => ({
        ...doc,
        _id: String(doc._id),
    }));
}

export async function getFeaturedTeachers(limit = 4) {
    await dbConnect();

    const docs = await User.find({
        role: "teacher",
        status: "Active",
    })
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(limit)
        .select("name email bio image isFeatured createdAt")
        .lean();

    return docs.map((doc) => ({
        ...doc,
        _id: String(doc._id),
    }));
}

export async function getPublicCategories(limit = 8) {
    await dbConnect();

    const docs = await Category.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return docs.map((doc) => ({
        ...doc,
        _id: String(doc._id),
    }));
}

export async function getPublishedCourses(search = "") {
    await dbConnect();

    const query = { isPublished: true };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { instructor: { $regex: search, $options: "i" } },
        ];
    }

    const docs = await Course.find(query).sort({ createdAt: -1 }).lean();

    return docs.map((doc) => ({
        ...doc,
        _id: String(doc._id),
    }));
}

export async function getPublicTeachers(search = "") {
    await dbConnect();

    const query = {
        role: "teacher",
        status: "Active",
    };

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { bio: { $regex: search, $options: "i" } },
        ];
    }

    const docs = await User.find(query)
        .sort({ isFeatured: -1, createdAt: -1 })
        .select("name email bio image isFeatured createdAt")
        .lean();

    return docs.map((doc) => ({
        ...doc,
        _id: String(doc._id),
    }));
}

export async function submitContactMessage(data) {
    await dbConnect();

    const name = (data?.name || "").trim();
    const email = (data?.email || "").trim();
    const message = (data?.message || "").trim();
    const subject = (data?.subject || "").trim();

    if (!name || !email || !message) {
        throw new Error("Name, email, and message are required.");
    }

    const doc = await ContactMessage.create({
        name,
        email,
        subject: subject || undefined,
        message,
    });

    return {
        _id: String(doc._id),
        name: doc.name,
        email: doc.email,
        subject: doc.subject,
        message: doc.message,
        status: doc.status,
        createdAt: doc.createdAt,
    };
}

export async function getHomePageData() {
    const [
        stats,
        settings,
        featuredCourses,
        featuredTeachers,
        testimonials,
        categories,
    ] = await Promise.all([
        getPublicStats(),
        getWebsiteSettings(),
        getFeaturedCourses(),
        getFeaturedTeachers(),
        getTestimonials(true),
        getPublicCategories(),
    ]);

    return {
        stats,
        settings,
        featuredCourses,
        featuredTeachers,
        testimonials,
        categories,
    };
}
