import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Course from "@/models/Course";
import Category from "@/models/Category";

export async function globalSearch(q) {
    const term = (q || "").trim();

    if (!term) {
        return { students: [], teachers: [], courses: [], categories: [] };
    }

    await dbConnect();

    const rx = { $regex: term, $options: "i" };

    const [students, teachers, courses, categories] = await Promise.all([
        User.find({ role: "student", $or: [{ name: rx }, { email: rx }] })
            .select("name email status")
            .limit(8)
            .lean(),
        User.find({ role: "teacher", $or: [{ name: rx }, { email: rx }] })
            .select("name email status")
            .limit(8)
            .lean(),
        Course.find({
            $or: [{ title: rx }, { category: rx }, { instructor: rx }],
        })
            .select("title category instructor")
            .limit(8)
            .lean(),
        Category.find({ name: rx }).select("name").limit(8).lean(),
    ]);

    const mapUser = (u) => ({
        _id: String(u._id),
        name: u.name,
        email: u.email,
        status: u.status,
    });

    return {
        students: students.map(mapUser),
        teachers: teachers.map(mapUser),
        courses: courses.map((c) => ({
            _id: String(c._id),
            title: c.title,
            category: c.category,
            instructor: c.instructor,
        })),
        categories: categories.map((c) => ({
            _id: String(c._id),
            name: c.name,
        })),
    };
}
