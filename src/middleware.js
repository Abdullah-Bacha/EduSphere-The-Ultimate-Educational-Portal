import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request) {

    const token = request.cookies.get("token")?.value;
    const pathname = request.nextUrl.pathname;

    // Login required
    if (!token) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    try {

        const { payload } = await jwtVerify(token, secret);

        const role = payload.role;

        // Redirect /dashboard -> role dashboard
        if (pathname === "/dashboard") {
            return NextResponse.redirect(
                new URL(`/dashboard/${role}`, request.url)
            );
        }

        // Admin only
        if (
            (pathname === "/dashboard/admin" || pathname.startsWith("/dashboard/admin/")) &&
            role !== "admin"
        ) {
            return NextResponse.redirect(
                new URL(`/dashboard/${role}`, request.url)
            );
        }

        // Teacher only
        if (
            (pathname === "/dashboard/teacher" || pathname.startsWith("/dashboard/teacher/")) &&
            role !== "teacher"
        ) {
            return NextResponse.redirect(
                new URL(`/dashboard/${role}`, request.url)
            );
        }

        // Student only
        if (
            (pathname === "/dashboard/student" || pathname.startsWith("/dashboard/student/")) &&
            role !== "student"
        ) {
            return NextResponse.redirect(
                new URL(`/dashboard/${role}`, request.url)
            );
        }

        // Shared routes: admin + teacher only (course management, settings)
        const adminAndTeacherOnly = ["/dashboard/courses", "/dashboard/settings"];
        if (
            adminAndTeacherOnly.some(
                (base) => pathname === base || pathname.startsWith(`${base}/`)
            ) &&
            role !== "admin" &&
            role !== "teacher"
        ) {
            return NextResponse.redirect(
                new URL(`/dashboard/${role}`, request.url)
            );
        }

        // Shared routes: admin only (user & category management)
        const adminOnly = ["/dashboard/students", "/dashboard/teachers"];
        if (
            adminOnly.some(
                (base) => pathname === base || pathname.startsWith(`${base}/`)
            ) &&
            role !== "admin"
        ) {
            return NextResponse.redirect(
                new URL(`/dashboard/${role}`, request.url)
            );
        }

        return NextResponse.next();

    } catch (error) {

        return NextResponse.redirect(
            new URL("/login", request.url)
        );

    }
}

export const config = {
    matcher: [
        "/dashboard/:path*",
    ],
};