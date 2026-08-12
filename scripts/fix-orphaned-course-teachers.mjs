/**
 * One-time fix: re-links Course.teacher to the current teacher User._id by
 * matching the legacy `instructor` name string, for courses whose stored
 * teacher ObjectId no longer matches any existing teacher (e.g. after a
 * teacher account was deleted and recreated).
 *
 * Usage:
 *   node scripts/fix-orphaned-course-teachers.mjs
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
    await mongoose.connect(process.env.MONGODB_URI);

    const courses = await mongoose.connection.collection("courses").find({}).toArray();
    const teachers = await mongoose.connection.collection("users").find({ role: "teacher" }).toArray();
    const teacherByName = new Map(teachers.map((t) => [t.name, t._id]));

    let fixed = 0;
    let skipped = 0;

    for (const course of courses) {
        const correctId = teacherByName.get(course.instructor);
        if (!correctId) {
            console.log(`Skipped "${course.title}": no teacher user matches instructor "${course.instructor}".`);
            skipped++;
            continue;
        }
        if (!course.teacher || course.teacher.toString() !== correctId.toString()) {
            await mongoose.connection.collection("courses").updateOne(
                { _id: course._id },
                { $set: { teacher: correctId } }
            );
            console.log(`Fixed "${course.title}": teacher -> ${correctId.toString()} (${course.instructor})`);
            fixed++;
        }
    }

    console.log(`Done. Fixed ${fixed} course(s), skipped ${skipped}.`);
    await mongoose.disconnect();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
