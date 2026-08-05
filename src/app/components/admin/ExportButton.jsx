"use client";

import { Download } from "lucide-react";

// Triggers a CSV download from the admin export endpoint. The browser handles
// the download via the endpoint's Content-Disposition header.
export default function ExportButton({ type, label = "Export CSV", className = "" }) {
    return (
        <a
            href={`/api/admin/export?type=${type}`}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 ${className}`}
        >
            <Download size={16} />
            {label}
        </a>
    );
}
