export function sanitizeUser(user) {
    if (!user) return null;

    const obj = user.toObject ? user.toObject() : { ...user };

    delete obj.password;

    return {
        ...obj,
        id: String(obj._id),
        _id: String(obj._id),

        createdAt: obj.createdAt
            ? new Date(obj.createdAt).toISOString()
            : null,

        updatedAt: obj.updatedAt
            ? new Date(obj.updatedAt).toISOString()
            : null,

        enrolledCourses: obj.enrolledCourses
            ? obj.enrolledCourses.map((courseId) => String(courseId))
            : [],
    };
}

export function sanitizeUsers(users) {
    return users.map((user) => sanitizeUser(user));
}
