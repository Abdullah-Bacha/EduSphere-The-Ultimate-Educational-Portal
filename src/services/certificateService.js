import dbConnect from "@/lib/dbConnect";
import Certificate from "@/models/Certificate";
import Progress from "@/models/Progress";
import Course from "@/models/Course";
import User from "@/models/User";
import mongoose from "mongoose";

const POPULATE_OPTS = [
    { path: "course", select: "title instructor duration category" },
    { path: "student", select: "name email" },
];

function serializeDoc(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : { ...doc };
    return {
        ...obj,
        _id: obj._id.toString(),
        id: obj._id.toString(),
        student: obj.student && typeof obj.student === "object"
            ? { _id: obj.student._id.toString(), name: obj.student.name, email: obj.student.email }
            : obj.student?.toString?.() ?? null,
        course: obj.course ? {
            _id: obj.course._id.toString(),
            id: obj.course._id.toString(),
            title: obj.course.title,
            instructor: obj.course.instructor,
            duration: obj.course.duration,
            category: obj.course.category,
        } : null,
        issueDate: obj.issueDate ? obj.issueDate.toISOString() : null,
        createdAt: obj.createdAt ? obj.createdAt.toISOString() : null,
        updatedAt: obj.updatedAt ? obj.updatedAt.toISOString() : null,
    };
}

export async function getStudentCertificates(studentId) {
    await dbConnect();
    const certificates = await Certificate.find({ student: studentId })
        .populate(POPULATE_OPTS);
    return certificates.map(serializeDoc);
}

export async function generateCertificate(studentId, courseId) {
    await dbConnect();

    // Verify progress is 100%
    const progress = await Progress.findOne({ student: studentId, course: courseId });
    if (!progress || progress.completionPercentage < 100) {
        throw new Error("Course is not fully completed yet");
    }

    // Check if certificate already exists
    const existing = await Certificate.findOne({ student: studentId, course: courseId })
        .populate(POPULATE_OPTS);
    if (existing) {
        return serializeDoc(existing);
    }

    // Generate unique ID
    const studentShort = studentId.substring(studentId.length - 4).toUpperCase();
    const courseShort = courseId.substring(courseId.length - 4).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const certificateId = `LMS-${studentShort}-${courseShort}-${rand}`;

    const cert = await Certificate.create({
        student: studentId,
        course: courseId,
        certificateId,
        grade: "A+"
    });

    const populated = await Certificate.findById(cert._id).populate(POPULATE_OPTS);

    return serializeDoc(populated);
}
