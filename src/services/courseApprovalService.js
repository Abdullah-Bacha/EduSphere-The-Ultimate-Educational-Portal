import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import mongoose from "mongoose";

const STATUSES = ["Pending", "Approved", "Rejected"];

export async function getCoursesForApproval() {
    await dbConnect();

    const docs = await Course.find()
        .sort({ createdAt: -1 })
        .select("title instructor category price isPublished approvalStatus createdAt")
        .lean();

    const rows = docs.map((d) => ({
        _id: String(d._id),
        title: d.title,
        instructor: d.instructor,
        category: d.category,
        price: d.price || 0,
        isPublished: d.isPublished,
        approvalStatus: d.approvalStatus || "Approved",
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : null,
    }));

    const counts = {
        total: rows.length,
        pending: rows.filter((r) => r.approvalStatus === "Pending").length,
        approved: rows.filter((r) => r.approvalStatus === "Approved").length,
        rejected: rows.filter((r) => r.approvalStatus === "Rejected").length,
    };

    return { rows, counts };
}

export async function setCourseApproval(id, status) {
    await dbConnect();

    if (!mongoose.isValidObjectId(id)) {
        return null;
    }

    if (!STATUSES.includes(status)) {
        throw new Error("Invalid status value.");
    }

    const update = { approvalStatus: status };
    // Keep visibility in sync: approved courses are published, rejected ones
    // are hidden. Pending leaves the current visibility untouched.
    if (status === "Approved") update.isPublished = true;
    if (status === "Rejected") update.isPublished = false;

    const updated = await Course.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
    }).lean();

    if (!updated) return null;

    return {
        _id: String(updated._id),
        approvalStatus: updated.approvalStatus,
        isPublished: updated.isPublished,
    };
}
