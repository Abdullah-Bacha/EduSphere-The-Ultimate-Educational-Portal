export const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];
export const DEFAULT_COURSE_THUMBNAIL = "/images/course-placeholder.svg";

export function normalizeCoursePayload(data) {
    const price = Number(data?.price);

    return {
        title: String(data?.title ?? "").trim(),
        description: String(data?.description ?? "").trim(),
        instructor: String(data?.instructor ?? "").trim(),
        category: String(data?.category ?? "").trim(),
        price: Number.isFinite(price) ? price : data?.price,
        duration: String(data?.duration ?? "").trim(),
        thumbnail:
            String(data?.thumbnail ?? "").trim() || DEFAULT_COURSE_THUMBNAIL,
        level: String(data?.level ?? "").trim(),
        isPublished:
            typeof data?.isPublished === "boolean" ? data.isPublished : true,
    };
}

export function validateCoursePayload(data) {
    const errors = [];

    if (!data || typeof data !== "object") {
        errors.push("Course payload must be an object.");
        return {
            valid: false,
            errors,
        };
    }

    const payload = normalizeCoursePayload(data);

    if (!payload.title) {
        errors.push("Title is required.");
    }

    if (!payload.description) {
        errors.push("Description is required.");
    }

    if (!payload.instructor) {
        errors.push("Instructor is required.");
    }

    if (!payload.category) {
        errors.push("Category is required.");
    }

    if (!Number.isFinite(payload.price) || payload.price < 0) {
        errors.push("Price must be a number equal to or greater than 0.");
    }

    if (!payload.duration) {
        errors.push("Duration is required.");
    }

    if (!COURSE_LEVELS.includes(payload.level)) {
        errors.push("Level must be Beginner, Intermediate, or Advanced.");
    }

    return {
        valid: errors.length === 0,
        errors,
        payload,
    };
}
