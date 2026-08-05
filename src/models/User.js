import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["student", "teacher", "admin"],
            default: "student",
        },

        phone: {
            type: String,
            default: "",
            trim: true,
        },

        gender: {
            type: String,
            enum: ["Male", "Female", ""],
            default: "",
        },

        dateOfBirth: {
            type: Date,
            default: null,
        },

        address: {
            type: String,
            default: "",
            trim: true,
        },

        image: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
            trim: true,
            maxlength: 500,
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User =
    mongoose.models.User || mongoose.model("User", userSchema);

export default User;
