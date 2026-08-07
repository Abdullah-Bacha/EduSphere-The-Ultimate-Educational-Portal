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
        if (process.env.NODE_ENV === "development") {
            console.log("✅ MongoDB already connected");
        }
        return cached.conn;
    }

    // Create new connection
    if (!cached.promise) {
        if (process.env.NODE_ENV === "development") {
            console.log("🔄 Connecting to MongoDB...");
        }

        const options = {
            serverSelectionTimeoutMS: 45000,
            socketTimeoutMS: 60000,
            maxPoolSize: 10,
            minPoolSize: 2,
            retryWrites: true,
            retryReads: true,
            family: 4,
            ssl: true,
            authSource: "admin",
        };

        cached.promise = mongoose.connect(MONGODB_URI, options);
    }

    try {
        cached.conn = await cached.promise;

        if (process.env.NODE_ENV === "development") {
            console.log("✅ MongoDB Connected Successfully");
        }

        return cached.conn;
    } catch (error) {
        console.error("[MongoDB Error]", error.message);
        cached.promise = null;
        throw error;
    }
}