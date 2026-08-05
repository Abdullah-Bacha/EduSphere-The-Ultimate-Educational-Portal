import dbConnect from "@/lib/dbConnect";
import ContactMessage from "@/models/ContactMessage";

export async function createContactMessage(data) {
    await dbConnect();
    const message = await ContactMessage.create(data);
    return message;
}

export async function getContactMessages({ search = "", status = "" } = {}) {
    await dbConnect();
    const query = {};
    
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { subject: { $regex: search, $options: "i" } },
        ];
    }
    
    if (status === "read") query.read = true;
    if (status === "unread") query.read = false;
    
    const messages = await ContactMessage.find(query)
        .sort({ createdAt: -1 })
        .lean();
    
    return messages;
}

export async function getContactMessageStats() {
    await dbConnect();
    const total = await ContactMessage.countDocuments();
    const read = await ContactMessage.countDocuments({ read: true });
    const unread = total - read;
    
    return { total, read, unread };
}
