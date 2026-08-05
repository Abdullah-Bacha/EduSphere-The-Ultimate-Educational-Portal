import dbConnect from "@/lib/dbConnect";
import Certificate from "@/models/Certificate";
import User from "@/models/User";
import Course from "@/models/Course";
import mongoose from "mongoose";

// User and Course are imported so their schemas are registered for populate().
void User;
void Course;

export async function getAllCertificates(search = "") {
    await dbConnect();

    const docs = await Certificate.find()
        .sort({ issueDate: -1 })
        .populate({ path: "student", select: "name email" })
        .populate({ path: "course", select: "title category instructor" })
        .lean();

    let list = docs.map((d) => ({
        _id: String(d._id),
        certificateId: d.certificateId,
        grade: d.grade,
        issueDate: d.issueDate ? new Date(d.issueDate).toISOString() : null,
        student: d.student
            ? {
                  _id: String(d.student._id),
                  name: d.student.name,
                  email: d.student.email,
              }
            : null,
        course: d.course
            ? {
                  _id: String(d.course._id),
                  title: d.course.title,
                  category: d.course.category,
                  instructor: d.course.instructor,
              }
            : null,
    }));

    if (search) {
        const term = search.toLowerCase();
        list = list.filter(
            (c) =>
                c.certificateId?.toLowerCase().includes(term) ||
                c.student?.name?.toLowerCase().includes(term) ||
                c.student?.email?.toLowerCase().includes(term) ||
                c.course?.title?.toLowerCase().includes(term)
        );
    }

    return list;
}

export async function getCertificateStats() {
    await dbConnect();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, thisMonth, distinctCourses] = await Promise.all([
        Certificate.countDocuments(),
        Certificate.countDocuments({ issueDate: { $gte: monthStart } }),
        Certificate.distinct("course"),
    ]);

    return {
        total,
        thisMonth,
        courses: distinctCourses.length,
    };
}

export async function revokeCertificate(id) {
    await dbConnect();

    if (!mongoose.isValidObjectId(id)) {
        return false;
    }

    const deleted = await Certificate.findByIdAndDelete(id);
    return Boolean(deleted);
}
