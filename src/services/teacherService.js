import dbConnect from "../lib/dbConnect";
import User from "../models/User";
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


export async function getFeaturedTeachers(limit = 4) {
    await dbConnect();

    const teachers = await User.find({
        role: "teacher",
        status: "Active",
        isFeatured: true,
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return sanitizeUsers(teachers);
}