import mongoose from "mongoose";

const AssignmentSubmissionSchema = new mongoose.Schema(
    {
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            default: "",
        },
        fileUrl: {
            type: String,
            default: "",
        },
        fileName: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["Submitted", "Graded"],
            default: "Submitted",
        },
        marksAwarded: {
            type: Number,
            default: null,
        },
        feedback: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

AssignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.models.AssignmentSubmission ||
    mongoose.model("AssignmentSubmission", AssignmentSubmissionSchema);
