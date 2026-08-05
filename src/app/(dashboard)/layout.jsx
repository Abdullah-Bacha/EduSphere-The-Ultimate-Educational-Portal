import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import DashboardLayout from "../components/layout/DashboardLayout";

export default async function Layout({ children }) {
    const user = await getAuthUser();

    if (!user) {
        redirect("/login");
    }

    return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
