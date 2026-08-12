import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";

const DEFAULT_TESTIMONIALS = [
    {
        name: "Sarah Ahmed",
        role: "Web Development Student",
        message:
            "LMS University gave me the flexibility to learn at my own pace while still having access to expert instructors. The practical projects helped me feel much more confident about my skills.",
        rating: 5,
        approved: true,
    },
    {
        name: "Hamza Ali",
        role: "Data Analytics Student",
        message:
            "The courses are structured really well, and the combination of live classes, quizzes, and practical assignments made learning much easier.",
        rating: 5,
        approved: true,
    },
    {
        name: "Ayesha Khan",
        role: "UI/UX Design Student",
        message:
            "I loved being able to learn from home while following a clear course structure. The instructors were supportive and the learning experience felt very practical.",
        rating: 5,
        approved: true,
    },
];

function serialize(doc) {
    return { ...doc, _id: String(doc._id) };
}

export async function getTestimonials() {
    await dbConnect();

    const count = await Testimonial.countDocuments();
    if (count === 0) {
        await Testimonial.insertMany(DEFAULT_TESTIMONIALS);
    }

    const testimonials = await Testimonial.find({ approved: true })
        .sort({ createdAt: -1 })
        .lean();
    return testimonials.map(serialize);
}

export async function getAllTestimonials() {
    await dbConnect();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
    return testimonials.map(serialize);
}

export async function createTestimonial(data) {
    await dbConnect();
    const testimonial = await Testimonial.create(data);
    return serialize(testimonial.toObject());
}

export async function updateTestimonial(id, data) {
    await dbConnect();
    const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    return testimonial ? serialize(testimonial) : null;
}

export async function deleteTestimonial(id) {
    await dbConnect();
    await Testimonial.findByIdAndDelete(id);
}
