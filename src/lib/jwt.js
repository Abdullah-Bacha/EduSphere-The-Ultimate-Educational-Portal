import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const JWT_SECRET =
    process.env.JWT_SECRET || "my_super_secret_key";

export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
    });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}