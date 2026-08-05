import { requireAdmin } from "@/lib/auth";
import StudentsView from "./StudentsView";

export default async function StudentsPage() {
    await requireAdmin();

    return <StudentsView />;
}
