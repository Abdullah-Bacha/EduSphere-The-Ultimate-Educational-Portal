import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not set. Make sure .env.local exists with MONGODB_URI");
    process.exit(1);
}

const courseSchema = new mongoose.Schema({}, { strict: false });
const Course = mongoose.model("Course", courseSchema, "courses");

// Available course images from public/images
const COURSE_THUMBNAILS = [
    "/images/image 8.png",
    "/images/image 10.png",
    "/images/image 11.png",
];

async function backfillThumbnails() {
    try {
        console.log("🔄 Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("✅ Connected to MongoDB");

        console.log("🔍 Fetching first 6 courses...");
        const courses = await Course.find({}).limit(6);

        if (courses.length === 0) {
            console.log("⚠️  No courses found");
            await mongoose.disconnect();
            process.exit(0);
        }

        console.log(`📚 Found ${courses.length} courses. Updating thumbnails...`);

        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            const thumbnailIndex = i % COURSE_THUMBNAILS.length;
            const thumbnail = COURSE_THUMBNAILS[thumbnailIndex];

            await Course.findByIdAndUpdate(course._id, { thumbnail });
            console.log(
                `✅ [${i + 1}/${courses.length}] "${course.title.substring(0, 30)}" → ${thumbnail}`
            );
        }

        console.log("\n✅ Thumbnail backfill complete!");
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        try {
            await mongoose.disconnect();
        } catch (e) {
            // ignore
        }
        process.exit(1);
    }
}

backfillThumbnails();
