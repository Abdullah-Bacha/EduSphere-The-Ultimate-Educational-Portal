import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        completedLessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Lesson",
            },
        ],
        completedQuizzes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Quiz", // To be implemented in Phase 3
            },
        ],
        completionPercentage: {
            type: Number,
            default: 0,
        },
        lastAccessed: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure a student has only one progress record per course
ProgressSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.models.Progress ||
    mongoose.model("Progress", ProgressSchema);
