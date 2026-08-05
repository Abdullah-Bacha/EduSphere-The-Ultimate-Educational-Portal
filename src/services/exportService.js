import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Course from "@/models/Course";

function escapeCell(value) {
    const s = value == null ? "" : String(value);
    if (/[",\n]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}

function toCsv(columns, rows) {
    const header = columns.map((c) => escapeCell(c.label)).join(",");
    const body = rows
        .map((row) => columns.map((c) => escapeCell(row[c.key])).join(","))
        .join("\n");
    return `${header}\n${body}`;
}

function dateOnly(value) {
    return value ? new Date(value).toISOString().split("T")[0] : "";
}

export async function exportCsv(type) {
    await dbConnect();

    if (type === "students" || type === "teachers") {
        const role = type === "students" ? "student" : "teacher";
        const docs = await User.find({ role })
            .sort({ createdAt: -1 })
            .select("name email phone gender status createdAt")
            .lean();

        const rows = docs.map((d) => ({
            name: d.name,
            email: d.email,
            phone: d.phone || "",
            gender: d.gender || "",
            status: d.status || "Active",
            joined: dateOnly(d.createdAt),
        }));

        const columns = [
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "gender", label: "Gender" },
            { key: "status", label: "Status" },
            { key: "joined", label: "Joined" },
        ];

        return { filename: `${type}.csv`, csv: toCsv(columns, rows) };
    }

    if (type === "courses") {
        const docs = await Course.find()
            .sort({ createdAt: -1 })
            .select("title instructor category price level isPublished approvalStatus createdAt")
            .lean();

        const rows = docs.map((d) => ({
            title: d.title,
            instructor: d.instructor,
            category: d.category,
            price: d.price || 0,
            level: d.level,
            published: d.isPublished ? "Yes" : "No",
            status: d.approvalStatus || "Approved",
            created: dateOnly(d.createdAt),
        }));

        const columns = [
            { key: "title", label: "Title" },
            { key: "instructor", label: "Instructor" },
            { key: "category", label: "Category" },
            { key: "price", label: "Price" },
            { key: "level", label: "Level" },
            { key: "published", label: "Published" },
            { key: "status", label: "Approval" },
            { key: "created", label: "Created" },
        ];

        return { filename: "courses.csv", csv: toCsv(columns, rows) };
    }

    throw new Error("Invalid export type.");
}
