import { NextResponse } from "next/server";
import Testimonial from "@/models/Testimonial";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
    try {
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: "Invalid course ID" }, { status: 400 });
        }

        await dbConnect();

        const reviews = await Testimonial.find({ course: id, isActive: true })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const serialized = reviews.map((r) => ({
            _id: r._id.toString(),
            name: r.name,
            content: r.content,
            rating: r.rating,
            createdAt: r.createdAt?.toISOString(),
        }));

        const avgRating = serialized.length
            ? Math.round((serialized.reduce((sum, r) => sum + r.rating, 0) / serialized.length) * 10) / 10
            : 0;

        return NextResponse.json({
            success: true,
            result: { reviews: serialized, avgRating, totalReviews: serialized.length },
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
