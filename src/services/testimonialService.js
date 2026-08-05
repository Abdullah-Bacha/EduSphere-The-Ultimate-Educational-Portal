import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";

export async function getTestimonials() {
    await dbConnect();
    const testimonials = await Testimonial.find({ approved: true })
        .sort({ createdAt: -1 })
        .lean();
    return testimonials;
}

export async function createTestimonial(data) {
    await dbConnect();
    const testimonial = await Testimonial.create({
        ...data,
        approved: false,
    });
    return testimonial;
}
