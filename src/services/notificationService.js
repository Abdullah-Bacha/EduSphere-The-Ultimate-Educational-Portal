import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

function serializeDoc(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : { ...doc };
    return {
        ...obj,
        _id: obj._id.toString(),
        id: obj._id.toString(),
        user: obj.user.toString(),
        createdAt: obj.createdAt ? obj.createdAt.toISOString() : null,
        updatedAt: obj.updatedAt ? obj.updatedAt.toISOString() : null,
    };
}

// Creates a single notification for one user. Used everywhere a workflow
// needs to automatically alert a student or teacher (new lesson, graded
// assignment, published quiz result, certificate issued, etc).
export async function createNotification({ userId, title, message, link = "" }) {
    if (!userId || !title || !message) return null;

    await dbConnect();

    const notification = await Notification.create({
        user: userId,
        title,
        message,
        link,
    });

    return serializeDoc(notification);
}

// Creates the same notification for a list of user ids (e.g. every student
// enrolled in a course). Failures for individual inserts are swallowed so
// one bad id doesn't block the rest of the batch.
export async function notifyUsers(userIds = [], { title, message, link = "" } = {}) {
    if (!Array.isArray(userIds) || userIds.length === 0 || !title || !message) {
        return [];
    }

    await dbConnect();

    const docs = userIds
        .filter(Boolean)
        .map((userId) => ({ user: userId, title, message, link }));

    if (docs.length === 0) return [];

    const created = await Notification.insertMany(docs, { ordered: false }).catch(
        () => []
    );

    return created.map(serializeDoc);
}

export async function getStudentNotifications(studentId) {
    await dbConnect();
    const notifications = await Notification.find({ user: studentId })
        .sort({ createdAt: -1 });
    return notifications.map(serializeDoc);
}

export async function markNotificationAsRead(studentId, notificationId) {
    await dbConnect();
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: studentId },
        { isRead: true },
        { new: true }
    );
    return serializeDoc(notification);
}

export async function markAllNotificationsAsRead(studentId) {
    await dbConnect();
    await Notification.updateMany(
        { user: studentId, isRead: false },
        { isRead: true }
    );
    return { success: true };
}

export async function deleteNotification(userId, notificationId) {
    await dbConnect();
    const result = await Notification.deleteOne({ _id: notificationId, user: userId });
    return { success: result.deletedCount > 0 };
}
