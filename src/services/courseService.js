import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import User from "@/models/User";
import { normalizeCoursePayload } from "@/validations/courseValidation";

// Resolves the `teacher` ObjectId reference from the `instructor` name so
// every course carries a real relationship, not just a display string.
async function resolveTeacherId(instructorName) {
    if (!instructorName) return null;

    const teacher = await User.findOne({
        name: instructorName,
        role: "teacher",
    })
        .select("_id")
        .lean();

    return teacher ? teacher._id : null;
}

export async function getAllCourses() {
    await dbConnect();

    const docs = await Course.find()
        .sort({ createdAt: -1 })
        .lean();

    return docs.map((doc) => serializeCourse(doc));
}

export async function getCourseById(id) {
    await dbConnect();

    if (!mongoose.isValidObjectId(id)) {
        return null;
    }

    const doc = await Course.findById(id).lean();
    return doc ? serializeCourse(doc) : null;
}

export async function createCourse(data) {
    await dbConnect();

    const payload = normalizeCoursePayload(data);
    payload.teacher = await resolveTeacherId(payload.instructor);

    const course = await Course.create(payload);
    return serializeCourse(course);
}

export async function updateCourse(id, data) {
    await dbConnect();

    if (!mongoose.isValidObjectId(id)) {
        return null;
    }

    const payload = normalizeCoursePayload(data);
    payload.teacher = await resolveTeacherId(payload.instructor);

    const existing = await Course.findById(id).select("isPublished").lean();
    const wasPublished = existing?.isPublished;

    const updated = await Course.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    if (!updated) return null;

    if (!wasPublished && updated.isPublished) {
        const enrolledStudents = await User.find({
            role: "student",
            enrolledCourses: updated._id,
        })
            .select("_id")
            .lean();

        if (enrolledStudents.length > 0) {
            const { notifyUsers } = await import("@/services/notificationService");
            await notifyUsers(
                enrolledStudents.map((s) => s._id),
                {
                    title: "Course published",
                    message: `"${updated.title}" is now live.`,
                    link: `/dashboard/student/my-courses/${updated._id}`,
                }
            );
        }
    }

    return serializeCourse(updated);
}

export async function deleteCourse(id) {
    await dbConnect();

    if (!mongoose.isValidObjectId(id)) {
        return false;
    }

    const course = await Course.findByIdAndDelete(id);
    return Boolean(course);
}

function serializeValue(value) {
    if (value === null || value === undefined) return value;
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.map(serializeValue);

    if (typeof value === "object") {
        if (typeof value.toJSON === "function" && value.toJSON !== Object.prototype.toJSON) {
            return value.toJSON();
        }

        if (Buffer.isBuffer(value)) {
            return value.toString("base64");
        }

        if (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null) {
            return Object.fromEntries(
                Object.entries(value).map(([key, nestedValue]) => [key, serializeValue(nestedValue)])
            );
        }

        return String(value);
    }

    return value;
}

function serializeCourse(doc) {
    const obj = doc.toObject ? doc.toObject() : doc;
    const serialized = serializeValue(obj);

    return {
        ...serialized,
        _id: String(serialized._id || obj._id),
        createdAt: serialized.createdAt ? new Date(serialized.createdAt).toISOString() : null,
        updatedAt: serialized.updatedAt ? new Date(serialized.updatedAt).toISOString() : null,
    };
}

export { serializeCourse };


// Course-side enrollment: lists every student with a flag for whether
// they're currently enrolled in this course (for the bulk-enroll UI).
export async function getCourseEnrollment(courseId) {
    await dbConnect();

    if (!mongoose.isValidObjectId(courseId)) {
        return null;
    }

    const course = await Course.findById(courseId).select("title").lean();
    if (!course) return null;

    const students = await User.find({ role: "student" })
        .select("name email status enrolledCourses")
        .sort({ name: 1 })
        .lean();

    const result = students.map((student) => ({
        _id: String(student._id),
        name: student.name,
        email: student.email,
        status: student.status,
        enrolled: (student.enrolledCourses || []).some(
            (id) => String(id) === String(courseId)
        ),
    }));

    return { course: { _id: String(course._id), title: course.title }, students: result };
}

// Bulk-enrolls/removes students for a single course in one call — the
// course-centric counterpart to the per-student "Assign Courses" screen.
// Newly enrolled students get a notification automatically.
export async function setCourseEnrollment(courseId, studentIds = []) {
    await dbConnect();

    if (!mongoose.isValidObjectId(courseId)) {
        throw new Error("Invalid course ID.");
    }

    const course = await Course.findById(courseId).select("title").lean();
    if (!course) {
        throw new Error("Course not found.");
    }

    const ids = Array.from(new Set((studentIds || []).map(String)));

    const alreadyEnrolled = await User.find({
        role: "student",
        _id: { $in: ids },
        enrolledCourses: course._id,
    })
        .select("_id")
        .lean();
    const alreadyEnrolledIds = new Set(alreadyEnrolled.map((s) => String(s._id)));
    const newlyEnrolledIds = ids.filter((id) => !alreadyEnrolledIds.has(id));

    await User.updateMany(
        { role: "student", _id: { $in: ids } },
        { $addToSet: { enrolledCourses: course._id } }
    );

    await User.updateMany(
        { role: "student", _id: { $nin: ids } },
        { $pull: { enrolledCourses: course._id } }
    );

    if (newlyEnrolledIds.length > 0) {
        const { notifyUsers } = await import("@/services/notificationService");
        await notifyUsers(newlyEnrolledIds, {
            title: "Enrolled in a new course",
            message: `You have been enrolled in "${course.title}".`,
            link: `/dashboard/student/my-courses/${course._id}`,
        });
    }

    return getCourseEnrollment(courseId);
}

export async function getFeaturedCourses(limit = 6) {
    await dbConnect();

    const docs = await Course.find({
        isPublished: true,
        approvalStatus: "Approved",
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return docs.map((doc) => serializeCourse(doc));
}

// Public course catalog: only published + approved courses, with search,
// category/level filters, pagination, and the distinct category list for
// building a filter dropdown.
export async function getPublishedCourses({
    search = "",
    category = "",
    level = "",
    page = 1,
    limit = 9,
} = {}) {
    await dbConnect();

    const query = {
        isPublished: true,
        approvalStatus: "Approved",
    };

    if (search) {
        query.title = { $regex: search, $options: "i" };
    }
    if (category) {
        query.category = category;
    }
    if (level) {
        query.level = level;
    }

    const skip = (page - 1) * limit;

    const [docs, total, categories] = await Promise.all([
        Course.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Course.countDocuments(query),
        Course.distinct("category", { isPublished: true, approvalStatus: "Approved" }),
    ]);

    return {
        courses: docs.map((doc) => serializeCourse(doc)),
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        categories: categories.filter(Boolean).sort(),
    };
}