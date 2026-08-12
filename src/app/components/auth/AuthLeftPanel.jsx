import { Award, BookOpen, Sparkles, TrendingUp, Wifi } from "lucide-react";

const DEFAULT_BULLETS = [
    { icon: BookOpen, text: "Easy course access" },
    { icon: TrendingUp, text: "Track your learning progress" },
    { icon: Wifi, text: "Learn anytime, anywhere" },
];

export default function AuthLeftPanel({
    heading1,
    heading2,
    description,
    bullets = DEFAULT_BULLETS,
    footerTitle = "Designed for modern learning teams",
    footerText = "Every interaction is tuned for clarity, trust, and a premium learning experience.",
}) {
    return (
        <div
            className="relative hidden w-full flex-col overflow-hidden lg:flex lg:w-[44%]"
            style={{
                backgroundImage:
                    "linear-gradient(127deg, rgb(6,13,31) 0%, rgb(7,15,36) 7%, rgb(8,18,41) 14%, rgb(9,20,47) 21%, rgb(10,23,52) 29%, rgb(11,25,58) 36%, rgb(12,27,63) 43%, rgb(13,30,69) 50%, rgb(12,28,66) 60%, rgb(12,26,63) 70%, rgb(11,25,59) 80%, rgb(11,23,56) 90%, rgb(10,21,53) 100%)",
            }}
        >
            <div className="pointer-events-none absolute bottom-[10%] left-[20%] size-[260px] rounded-full bg-[rgba(21,93,252,0.2)] blur-[64px]" />
            <div className="pointer-events-none absolute left-[-80px] top-[15%] size-[200px] rounded-full bg-[rgba(79,57,246,0.15)] blur-[64px]" />
            <div className="pointer-events-none absolute right-[-40px] top-0 size-[160px] rounded-full bg-[rgba(81,162,255,0.08)] blur-[40px]" />

            <div className="relative flex h-full flex-col justify-center gap-4 overflow-y-auto px-8 py-6 xl:px-10">
                {/* Image + floating badges */}
                <div className="relative mx-auto w-full max-w-[190px] shrink-0">
                    <div className="absolute -left-6 top-0 z-10 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1.5 backdrop-blur-md">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#155dfc]/25 text-[#7db4ff]">
                            <BookOpen size={12} />
                        </div>
                        <div>
                            <p className="text-[10.5px] font-semibold leading-tight text-white">12 Courses</p>
                            <p className="text-[9px] leading-tight text-white/50">Enrolled</p>
                        </div>
                    </div>

                    <div className="absolute -right-8 top-10 z-10 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1.5 backdrop-blur-md">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/25 text-emerald-300">
                            <Award size={12} />
                        </div>
                        <div>
                            <p className="text-[10.5px] font-semibold leading-tight text-white">Certificate</p>
                            <p className="text-[9px] leading-tight text-emerald-300">Earned ✓</p>
                        </div>
                    </div>

                    <div className="relative shadow-[0px_-8px_64px_0px_rgba(99,102,241,0.3)]">
                        <img
                            src="/images/login-student.png"
                            alt="Student holding books"
                            className="pointer-events-none relative z-0 mx-auto size-full max-w-[160px] object-contain"
                        />
                    </div>

                    <div className="absolute -bottom-3 right-1 z-10 w-[120px] rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-2 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <span className="text-[9.5px] font-medium text-white/60">Progress</span>
                            <span className="text-[9.5px] font-semibold text-[#7db4ff]">85%</span>
                        </div>
                        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-[#155dfc] to-[#7db4ff]" />
                        </div>
                    </div>
                </div>

                {/* Copy */}
                <div className="mt-3 shrink-0">
                    <h2 className="text-[19px] font-extrabold leading-tight text-white xl:text-[21px]">
                        {heading1}{" "}
                        <span className="bg-gradient-to-r from-[#5b9dff] to-[#a78bfa] bg-clip-text text-transparent">
                            {heading2}
                        </span>
                    </h2>
                    <p className="mt-1.5 text-[12px] leading-5 text-white/60">{description}</p>

                    <ul className="mt-2.5 space-y-1.5">
                        {bullets.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-center gap-2 text-[12px] text-white/80">
                                <Icon size={13} className="shrink-0 text-[#7db4ff]" />
                                {text}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-3 border-t border-white/10 pt-2.5">
                        <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.6px] text-white">
                            <Sparkles size={12} className="text-[#fbbf24]" />
                            {footerTitle}
                        </p>
                        <p className="mt-1 text-[11px] leading-[15px] text-white/45">{footerText}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
