import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
    };
}

export async function connectDB() {
    // Already connected
    if (cached.conn) {
        console.log("✅ MongoDB already connected");
        return cached.conn;
    }

    // Create new connection
    if (!cached.promise) {
        console.log("🔄 Connecting to MongoDB...");
        console.log(
            "URI:",
            MONGODB_URI.replace(/\/\/(.*):(.*)@/, "//****:****@")
        );

        const options = {
            serverSelectionTimeoutMS: 10000, // 10 seconds
        };

        cached.promise = mongoose.connect(MONGODB_URI, options);
    }

    try {
        cached.conn = await cached.promise;

        console.log("✅ MongoDB Connected Successfully");

        return cached.conn;
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Cause:", error.cause);
        console.error(error);

        cached.promise = null;

        throw error;
    }
}