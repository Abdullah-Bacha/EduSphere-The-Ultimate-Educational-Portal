import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
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
        issueDate: {
            type: Date,
            default: Date.now,
        },
        certificateId: {
            type: String,
            required: true,
            unique: true,
        },
        grade: {
            type: String, // e.g. "A", "Pass", "100%"
            default: "Completed",
        },
    },
    {
        timestamps: true,
    }
);

CertificateSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.models.Certificate ||
    mongoose.model("Certificate", CertificateSchema);
