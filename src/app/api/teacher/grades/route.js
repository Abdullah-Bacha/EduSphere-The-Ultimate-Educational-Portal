import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/auth";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const { studentId, assignmentId, grade } = await req.json();

        if (!studentId || !assignmentId || grade === undefined) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify teacher owns this assignment
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return NextResponse.json(
                { success: false, message: "Assignment not found" },
                { status: 404 }
            );
        }

        // Update or create grade
        const submission = await AssignmentSubmission.findOneAndUpdate(
            { student: studentId, assignment: assignmentId },
            { marksAwarded: grade, status: "Graded" },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({
            success: true,
            data: { submission },
        });
    } catch (error) {
        console.error("Grade error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const teacher = await requireTeacher();
        await dbConnect();

        const courseId = req.nextUrl.searchParams.get("courseId");
        const assignmentId = req.nextUrl.searchParams.get("assignmentId");

        const query = {};
        if (assignmentId) query.assignment = assignmentId;

        const submissions = await AssignmentSubmission.find(query)
            .populate("student", "name email")
            .populate("assignment", "title")
            .lean();

        return NextResponse.json({
            success: true,
            data: { submissions },
        });
    } catch (error) {
        console.error("Get grades error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";
