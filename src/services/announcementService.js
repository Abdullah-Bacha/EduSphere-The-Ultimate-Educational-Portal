import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { notifyUsers } from "@/services/notificationService";
import { sendEmail, announcementEmail } from "@/services/emailService";

const AUDIENCES = ["all", "student", "teacher"];

// Sends the same notification to every user in the chosen audience.
// audience: "all" (students + teachers) | "student" | "teacher".
export async function sendAnnouncement({ title, message, audience = "all", link = "" }) {
    await dbConnect();

    const cleanTitle = (title || "").trim();
    const cleanMessage = (message || "").trim();

    if (!cleanTitle || !cleanMessage) {
        throw new Error("Title and message are required.");
    }

    if (!AUDIENCES.includes(audience)) {
        throw new Error("Invalid audience.");
    }

    const roleQuery =
        audience === "all"
            ? { role: { $in: ["student", "teacher"] } }
            : { role: audience };

    const users = await User.find(roleQuery).select("_id email").lean();
    const ids = users.map((u) => String(u._id));

    if (ids.length === 0) {
        return { count: 0, audience };
    }

    const cleanLink = (link || "").trim();

    await notifyUsers(ids, {
        title: cleanTitle,
        message: cleanMessage,
        link: cleanLink,
    });

    // Send emails in background (fire-and-forget)
    const emailTemplate = announcementEmail({ title: cleanTitle, message: cleanMessage, link: cleanLink });
    for (const user of users) {
        if (user.email) sendEmail({ to: user.email, ...emailTemplate });
    }

    return { count: ids.length, audience };
}

// Quick counts so the admin knows how many people each audience reaches.
export async function getAudienceCounts() {
    await dbConnect();

    const [students, teachers] = await Promise.all([
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "teacher" }),
    ]);

    return {
        all: students + teachers,
        student: students,
        teacher: teachers,
    };
}
