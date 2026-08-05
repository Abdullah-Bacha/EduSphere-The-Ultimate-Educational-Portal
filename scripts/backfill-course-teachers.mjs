/**
 * One-time backfill: sets Course.teacher (ObjectId) for any existing course
 * that only has the legacy `instructor` name string.
 *
 * New courses created after this change already get `teacher` set
 * automatically by courseService.js — this script only needs to run once
 * against data created before the fix.
 *
 * Usage:
 *   node scripts/backfill-course-teachers.mjs
 *
 * Reads MONGODB_URI from .env.local
 */
import { readFileSync } from "fs";
import mongoose from "mongoose";

function loadEnv() {
    try {
        const content = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
        for (const line of content.split(/\r?\n/)) {
            const match = line.match(/^([^#=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim();
                if (!process.env[key]) process.env[key] = value;
            }
        }
    } catch {
        // .env.local not found, rely on already-set environment variables
    }
}

async function main() {
    loadEnv();

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("MONGODB_URI is not set. Add it to .env.local or the environment.");
        process.exit(1);
    }

    await mongoose.connect(uri);

    const User = mongoose.connection.collection("users");
    const Course = mongoose.connection.collection("courses");

    const courses = await Course.find({
        $or: [{ teacher: { $exists: false } }, { teacher: null }],
    }).toArray();

    console.log(`Found ${courses.length} course(s) missing a teacher reference.`);

    let updated = 0;
    let skipped = 0;

    for (const course of courses) {
        const teacherUser = await User.findOne({
            name: course.instructor,
            role: "teacher",
        });

        if (!teacherUser) {
            console.warn(
                `  Skipping "${course.title}" — no teacher user found matching instructor name "${course.instructor}".`
            );
            skipped += 1;
            continue;
        }

        await Course.updateOne(
            { _id: course._id },
            { $set: { teacher: teacherUser._id } }
        );
        updated += 1;
    }

    console.log(`Done. Updated ${updated} course(s), skipped ${skipped}.`);
    await mongoose.disconnect();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
