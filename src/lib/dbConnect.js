import { connectDB } from "./db";

export default async function dbConnect() {
	return connectDB();
}