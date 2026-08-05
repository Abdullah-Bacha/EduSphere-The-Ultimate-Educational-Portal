import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Lesson title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        videoUrl: {
            type: String,
            trim: true,
            default: "",
        },
        content: {
            type: String, // Rich text or markdown reading content
            default: "",
        },
        duration: {
            type: String,
            default: "10 mins",
        },
        order: {
            type: Number,
            required: true,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);
