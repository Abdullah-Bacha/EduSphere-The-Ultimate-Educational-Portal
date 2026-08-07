import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { handleApiError, ValidationError, AuthError } from "@/lib/apiError";

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
            throw new ValidationError("No file provided");
        }

        if (!file.name || typeof file.name !== "string") {
            throw new ValidationError("Invalid file name");
        }

        if (file.size > MAX_SIZE) {
            throw new ValidationError("File too large (max 10 MB)");
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            throw new ValidationError("File type not allowed. Allowed types: PDF, Images, Documents, Zip");
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
        if (!ext.match(/^[a-z0-9]{2,5}$/i)) {
            throw new ValidationError("Invalid file extension");
        }

        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const uploadDir = path.join(process.cwd(), "public", "uploads", "assignments");
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, safeName), buffer);

        const url = `/uploads/assignments/${safeName}`;
        return NextResponse.json({ success: true, result: { url, name: file.name, size: file.size } }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}
