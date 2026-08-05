import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "application/zip",
];

export async function POST(request) {
    try {
        await requireAuth();

        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
            return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ success: false, message: "File too large (max 10 MB)" }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ success: false, message: "File type not allowed" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const uploadDir = path.join(process.cwd(), "public", "uploads", "assignments");
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, safeName), buffer);

        const url = `/uploads/assignments/${safeName}`;
        return NextResponse.json({ success: true, result: { url, name: file.name, size: file.size } });
    } catch (error) {
        const status = error.message === "Unauthorized" ? 401 : 500;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}
