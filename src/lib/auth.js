import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sanitizeUser } from "@/lib/serializeUser";

export async function getAuthUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    const decoded = verifyToken(token);

    if (!decoded?.id) {
        return null;
    }

    await dbConnect();

    const user = await User.findById(decoded.id);

    if (!user) {
        return null;
    }

    return sanitizeUser(user);
}

export async function requireAuth() {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    return user;
}

export async function requireAdmin() {
    const user = await requireAuth();

    if (user.role !== "admin") {
        throw new Error("Forbidden");
    }

    return user;
}

export async function requireTeacher() {
    const user = await requireAuth();

    if (user.role !== "teacher") {
        throw new Error("Forbidden");
    }

    return user;
}

export async function requireStudent() {
    const user = await requireAuth();

    if (user.role !== "student") {
        throw new Error("Forbidden");
    }

    return user;
}

export async function requireRole(role) {
    const user = await requireAuth();

    if (user.role !== role) {
        throw new Error("Forbidden");
    }

    return user;
}

export async function requireRoles(roles = []) {
    const user = await requireAuth();

    if (!roles.includes(user.role)) {
        throw new Error("Forbidden");
    }

    return user;
}