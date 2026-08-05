import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
            maxlength: [120, "Course title cannot exceed 120 characters"],
        },

        description: {
            type: String,
            required: [true, "Course description is required"],
            trim: true,
            maxlength: [2000, "Course description cannot exceed 2000 characters"],
        },

        instructor: {
            type: String,
            required: [true, "Instructor name is required"],
            trim: true,
            maxlength: [100, "Instructor name cannot exceed 100 characters"],
        },

        // Proper ObjectId reference to the teacher User document.
        // Resolved automatically from `instructor` (name) at write time in
        // courseService so existing name-based UI/flows keep working while
        // relationships stay properly referenced.
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            maxlength: [80, "Category cannot exceed 80 characters"],
        },

        price: {
            type: Number,
            min: [0, "Price must be at least 0"],
            default: 0,
        },

        thumbnail: {
            type: String,
            default: "/images/course-placeholder.svg",
            trim: true,
        },

        duration: {
            type: String,
            required: [true, "Duration is required"],
            default: "8 Weeks",
            trim: true,
            maxlength: [80, "Duration cannot exceed 80 characters"],
        },

        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
        },

        isPublished: {
            type: Boolean,
            default: true,
        },

        archived: {
            type: Boolean,
            default: false,
        },

        // Admin moderation state. Defaults to "Approved" so existing courses
        // and admin-created courses stay live; admins can move a course to
        // "Pending" or "Rejected" from the Approvals panel.
        approvalStatus: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Approved",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Course ||
    mongoose.model("Course", CourseSchema);
