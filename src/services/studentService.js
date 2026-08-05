import dbConnect from "../lib/dbConnect";
import User from "../models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { sanitizeUser, sanitizeUsers } from "@/lib/serializeUser";
import Course from "@/models/Course";
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

export async function getStudents(search = "") {
    await dbConnect();

    const query = {
        role: "student",
    };

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
        ];
    }

    const students = await User.find(query).sort({ createdAt: -1 });
    return sanitizeUsers(students);
}

export async function getStudentById(id) {
    await dbConnect();

    if (!isValidObjectId(id)) {
        return null;
    }

    const student = await User.findOne({
        _id: id,
        role: "student",
    });

    return student ? sanitizeUser(student) : null;
}

export async function createStudent(data) {
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

    const studentData = {
        name: data.name,
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
        role: "student",
        phone: data.phone || "",
        gender: data.gender || "",
        dateOfBirth: data.dateOfBirth || null,
        address: data.address || "",
        status: data.status || "Active",
    };

    const student = await User.create(studentData);
    return sanitizeUser(student);
}

export async function updateStudent(id, data) {
    await dbConnect();

    if (!isValidObjectId(id)) {
        return null;
    }

    const updateData = {
        name: data.name,
        email: data.email,
        phone: data.phone ?? "",
        gender: data.gender ?? "",
        dateOfBirth: data.dateOfBirth || null,
        address: data.address ?? "",
        status: data.status || "Active",
        role: "student",
    };

    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }

    const student = await User.findOneAndUpdate(
        {
            _id: id,
            role: "student",
        },
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    return student ? sanitizeUser(student) : null;
}

export async function deleteStudent(id) {
    await dbConnect();

    if (!isValidObjectId(id)) {
        return null;
    }

    const student = await User.findOneAndDelete({
        _id: id,
        role: "student",
    });

    return student ? sanitizeUser(student) : null;
}
export async function getStudentCourses(userId) {
    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const courses = await Course.find({
        _id: {
            $in: user.enrolledCourses,
        },
    });

    return courses;
}

export async function bulkStudentAction(ids, action) {
    await dbConnect();

    const valid = (Array.isArray(ids) ? ids : []).filter((id) =>
        isValidObjectId(id)
    );

    if (valid.length === 0) {
        return { modified: 0 };
    }

    if (action === "delete") {
        const res = await User.deleteMany({
            _id: { $in: valid },
            role: "student",
        });
        return { modified: res.deletedCount };
    }

    if (action === "activate" || action === "deactivate") {
        const status = action === "activate" ? "Active" : "Inactive";
        const res = await User.updateMany(
            { _id: { $in: valid }, role: "student" },
            { status }
        );
        return { modified: res.modifiedCount };
    }

    throw new Error("Invalid action");
}

export async function enrollCourses(studentId, courseIds) {
    await dbConnect();

    if (!isValidObjectId(studentId)) {
        throw new Error("Invalid Student ID");
    }

    const student = await User.findOneAndUpdate(
        {
            _id: studentId,
            role: "student",
        },
        {
            enrolledCourses: courseIds,
        },
        {
            new: true,
        }
    );

    if (!student) {
        throw new Error("Student not found");
    }

    return sanitizeUser(student);
}   