
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

export default async function DashboardPage() {

    const user = await getAuthUser();

    if (!user) {
        redirect("/login");
    }

    switch (user.role) {

        case "admin":
            redirect("/dashboard/admin");

        case "teacher":
            redirect("/dashboard/teacher");

        case "student":
            redirect("/dashboard/student");

        default:
            redirect("/login");
    }
}

