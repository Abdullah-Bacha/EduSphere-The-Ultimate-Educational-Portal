import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Assignment title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        totalMarks: {
            type: Number,
            default: 100,
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

export default mongoose.models.Assignment ||
    mongoose.model("Assignment", AssignmentSchema);
