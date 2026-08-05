"use client";

// Shared metric-card row used across the admin report pages.
// items: [{ label, value, icon: LucideIcon, tint: "text-x bg-y" }]
export default function StatGrid({ items = [], columns = 4 }) {
    const colClass =
        {
            2: "sm:grid-cols-2",
            3: "sm:grid-cols-3",
            4: "sm:grid-cols-2 lg:grid-cols-4",
            5: "sm:grid-cols-2 lg:grid-cols-5",
        }[columns] || "sm:grid-cols-2 lg:grid-cols-4";

    return (
        <div className={`grid grid-cols-2 gap-4 ${colClass}`}>
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <div
                        key={item.label}
                        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">
                                {item.label}
                            </span>
                            {Icon ? (
                                <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.tint || "bg-slate-100 text-slate-600"}`}
                                >
                                    <Icon size={16} />
                                </span>
                            ) : null}
                        </div>
                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {item.value}
                        </p>
                        {item.hint ? (
                            <p className="mt-0.5 text-xs text-gray-400">{item.hint}</p>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}
