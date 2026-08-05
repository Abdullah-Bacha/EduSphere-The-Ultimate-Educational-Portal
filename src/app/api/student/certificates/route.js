import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth";
import { 
    getStudentCertificates, 
    generateCertificate 
} from "@/services/certificateService";

export async function GET() {
    try {
        const student = await requireStudent();
        const certificates = await getStudentCertificates(student.id);

        return NextResponse.json({
            success: true,
            result: certificates,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const student = await requireStudent();
        const body = await request.json();
        const { courseId } = body;

        if (!courseId) {
            return NextResponse.json(
                { success: false, message: "Course ID is required" },
                { status: 400 }
            );
        }

        const certificate = await generateCertificate(student.id, courseId);

        return NextResponse.json({
            success: true,
            result: certificate,
            message: "Certificate generated successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: error.message.includes("not fully completed") ? 400 : 500 }
        );
    }
}
