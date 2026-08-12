import dbConnect from "../lib/dbConnect";
import User from "../models/User";
import Course from "../models/Course";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { sanitizeUser, sanitizeUsers } from "@/lib/serializeUser";

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

export async function getTeachers(search = "") {
    await dbConnect();

    const query = {
        role: "teacher",
    };

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { bio: { $regex: search, $options: "i" } },
        ];
    }

    const teachers = await User.find(query).sort({ createdAt: -1 });
    return sanitizeUsers(teachers);
}

export async function getTeacherById(id) {
    await dbConnect();

    if (!isValidObjectId(id)) {
        return null;
    }

    const teacher = await User.findOne({
        _id: id,
        role: "teacher",
    });

    return teacher ? sanitizeUser(teacher) : null;
}

export async function createTeacher(data) {
    await dbConnect();

    if (!data.name || !data.email || !data.password) {
        throw new Error("Name, email, and password are required");
    }

    const exists = await User.findOne({
        email: data.email,
    });

    if (exists) {
        throw new Error("Email already exists");
    }

    const teacherData = {
        name: data.name,
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
        role: "teacher",
        phone: data.phone || "",
        bio: data.bio || "",
        image: data.image || "",
        status: data.status || "Active",
        isFeatured: Boolean(data.isFeatured),
    };

    const teacher = await User.create(teacherData);
    return sanitizeUser(teacher);
}

export async function updateTeacher(id, data) {
    await dbConnect();

    if (!isValidObjectId(id)) {
        return null;
    }

    const updateData = {
        name: data.name,
        email: data.email,
        phone: data.phone ?? "",
        bio: data.bio ?? "",
        image: data.image ?? "",
        status: data.status || "Active",
        isFeatured: Boolean(data.isFeatured),
        role: "teacher",
    };

    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }

    const teacher = await User.findOneAndUpdate(
        {
            _id: id,
            role: "teacher",
        },
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    return teacher ? sanitizeUser(teacher) : null;
}

export async function deleteTeacher(id) {
    await dbConnect();

    if (!isValidObjectId(id)) {
        return null;
    }

    const teacher = await User.findOneAndDelete({
        _id: id,
        role: "teacher",
    });

    return teacher ? sanitizeUser(teacher) : null;
}

export async function getTeacherNames() {
    await dbConnect();

    const teachers = await User.find({ role: "teacher", status: "Active" })
        .select("name")
        .sort({ name: 1 })
        .lean();

    return teachers.map((teacher) => teacher.name);
}


// Public teacher directory with real per-teacher course/student counts
// (course count from Course.teacher, student count from distinct students
// whose enrolledCourses intersects that teacher's course ids).
export async function getTeachersWithStats(search = "") {
    await dbConnect();

    const query = { role: "teacher" };
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { bio: { $regex: search, $options: "i" } },
        ];
    }

    const teachers = await User.find(query).sort({ createdAt: -1 }).lean();
    if (teachers.length === 0) return [];

    const teacherIds = teachers.map((t) => t._id);
    const courses = await Course.find({ teacher: { $in: teacherIds } })
        .select("teacher")
        .lean();

    const courseIdsByTeacher = new Map();
    for (const course of courses) {
        const key = course.teacher.toString();
        if (!courseIdsByTeacher.has(key)) courseIdsByTeacher.set(key, []);
        courseIdsByTeacher.get(key).push(course._id);
    }

    const allCourseIds = courses.map((c) => c._id);
    const studentCounts = allCourseIds.length
        ? await User.aggregate([
              { $match: { role: "student", enrolledCourses: { $in: allCourseIds } } },
              { $unwind: "$enrolledCourses" },
              { $match: { enrolledCourses: { $in: allCourseIds } } },
              { $group: { _id: "$enrolledCourses", count: { $sum: 1 } } },
          ])
        : [];

    const studentCountByCourse = new Map(
        studentCounts.map((row) => [row._id.toString(), row.count])
    );

    return sanitizeUsers(teachers).map((teacher) => {
        const teacherCourseIds = courseIdsByTeacher.get(teacher._id.toString()) || [];
        const studentCount = teacherCourseIds.reduce(
            (sum, courseId) => sum + (studentCountByCourse.get(courseId.toString()) || 0),
            0
        );
        return {
            ...teacher,
            courseCount: teacherCourseIds.length,
            studentCount,
        };
    });
}

export async function getFeaturedTeachers(limit = 4) {
    await dbConnect();

    const teachers = await User.find({
        role: "teacher",
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return sanitizeUsers(teachers);
}