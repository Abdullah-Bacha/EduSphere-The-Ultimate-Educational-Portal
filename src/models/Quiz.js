import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Quiz title is required"],
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        timeLimit: {
            type: Number, // in minutes
            default: 15,
        },
        questions: [
            {
                questionText: {
                    type: String,
                    required: true,
                },
                options: [
                    {
                        type: String,
                        required: true,
                    },
                ],
                correctOptionIndex: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
