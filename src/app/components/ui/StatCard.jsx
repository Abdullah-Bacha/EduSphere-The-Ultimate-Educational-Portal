/**
 * StatCard — a clickable metric tile for dashboards.
 *
 * Props:
 *  title    — string
 *  value    — number | string
 *  icon     — ReactNode (Lucide icon or similar)
 *  href     — optional link
 *  accent   — CSS color string (e.g. "#6366f1")
 *  accentBg — CSS color string for icon bg (e.g. "rgba(99,102,241,0.10)")
 *  trend    — optional { value: string, up: bool } e.g. { value: "+3", up: true }
 */

import Link from "next/link";

export default function StatCard({
    title,
    value,
    icon,
    href,
    accent    = "#6366f1",
    accentBg  = "rgba(99,102,241,0.08)",
    trend,
    className = "",
}) {
    const content = (
        <div
            style={{
                background: "#ffffff",
                borderRadius: 14,
                padding: "20px 22px",
                boxShadow: "0 0 0 1px #e2e8f0, 0 2px 8px -2px rgba(0,0,0,0.06)",
                transition: "box-shadow 180ms ease, transform 180ms ease",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                cursor: href ? "pointer" : "default",
            }}
            className={`stat-card-inner ${className}`}
            onMouseEnter={e => {
                if (href) {
                    e.currentTarget.style.boxShadow = "0 0 0 1px #c7d2fe, 0 4px 16px -4px rgba(99,102,241,0.14)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                }
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 0 0 1px #e2e8f0, 0 2px 8px -2px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {/* Icon */}
            <div
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: accentBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: accent,
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>

            {/* Value + Title */}
            <div>
                <p
                    style={{
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "#64748b",
                        marginBottom: 4,
                    }}
                >
                    {title}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span
                        style={{
                            fontSize: "1.75rem",
                            fontWeight: 800,
                            color: "#0f172a",
                            lineHeight: 1,
                            letterSpacing: "-0.03em",
                        }}
                    >
                        {value ?? "—"}
                    </span>

                    {trend && (
                        <span
                            style={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: trend.up ? "#16a34a" : "#dc2626",
                                background: trend.up ? "#f0fdf4" : "#fff1f2",
                                padding: "1px 6px",
                                borderRadius: 99,
                            }}
                        >
                            {trend.value}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href} style={{ textDecoration: "none", display: "block" }}>{content}</Link>;
    }

    return content;
}
