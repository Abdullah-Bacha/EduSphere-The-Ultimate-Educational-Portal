import { requireAdmin } from "@/lib/auth";
import TeachersView from "./TeachersView";

export default async function TeachersPage() {
    await requireAdmin();

    return <TeachersView />;
}
