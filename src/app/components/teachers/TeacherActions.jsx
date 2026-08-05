import Link from "next/link";
import { useConfirm } from "@/app/components/ui/ConfirmProvider";

export default function TeacherActions({ teacher, onDelete }) {
    const { confirm } = useConfirm();
    if (!teacher) {
        return null;
    }

    return (
        <div className="inline-flex items-center justify-end gap-3.5">
            {/* View Action */}
            <Link
                href={`/dashboard/teachers/view/${teacher._id}`}
                className="group flex flex-col items-center justify-center gap-1 min-w-[42px] hover:scale-105 transition-all duration-200"
            >
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-sm group-hover:shadow-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-blue-600 transition-colors tracking-wide">View</span>
            </Link>

            {/* Edit Action */}
            <Link
                href={`/dashboard/teachers/edit/${teacher._id}`}
                className="group flex flex-col items-center justify-center gap-1 min-w-[42px] hover:scale-105 transition-all duration-200"
            >
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200 shadow-sm group-hover:shadow-amber-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-amber-600 transition-colors tracking-wide">Edit</span>
            </Link>

            {/* Delete Action */}
            <button
                type="button"
                onClick={async () => {
                    const ok = await confirm(`Are you sure you want to delete "${teacher.name}"?`, {
                        title: "Delete teacher",
                    });
                    if (ok) {
                        onDelete(teacher._id);
                    }
                }}
                className="group flex flex-col items-center justify-center gap-1 min-w-[42px] hover:scale-105 active:scale-95 transition-all duration-200"
            >
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-200 shadow-sm group-hover:shadow-rose-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-rose-600 transition-colors tracking-wide">Delete</span>
            </button>
        </div>
    );
}
