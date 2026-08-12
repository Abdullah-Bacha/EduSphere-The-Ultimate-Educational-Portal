import Container from "@/app/components/ui/Container";
import { GraduationCap, Navigation, Plus, Minus } from "lucide-react";
import { getWebsiteSettings } from "@/services/websiteSettingService";

export default async function ContactMap() {
    const settings = await getWebsiteSettings();
    const address = settings.contactAddress;
    const siteName = settings.siteName;
    const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    return (
        <section
            className="py-20"
            style={{
                backgroundImage:
                    "linear-gradient(152deg, #f9fafb 0%, rgba(247,249,252,0.65) 50%, rgba(239,246,255,0.3) 100%)",
            }}
        >
            <Container>
                <div className="text-center mb-12">
                    <span className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold">
                        Find Us
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Visit {siteName}
                    </h2>
                    <p className="mt-3 text-gray-500">Located in {address}.</p>
                </div>

                <div className="relative rounded-[24px] overflow-hidden border border-gray-100 shadow-sm h-[460px] bg-[#e9eef5]">
                    {/* Faux street grid */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(90deg, transparent, transparent 149px, rgba(148,163,184,0.35) 149px, rgba(148,163,184,0.35) 152px), repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(148,163,184,0.35) 79px, rgba(148,163,184,0.35) 82px)",
                        }}
                    />
                    <div className="absolute left-[15%] top-[35%] w-20 h-10 bg-emerald-100/60 rounded-sm" />
                    <div className="absolute left-[65%] top-[55%] w-24 h-14 bg-emerald-100/60 rounded-sm" />
                    <div className="absolute left-[35%] top-[15%] w-16 h-8 bg-slate-300/40 rounded-sm" />
                    <div className="absolute left-[8%] top-[65%] w-16 h-8 bg-slate-300/40 rounded-sm" />

                    {/* Pin */}
                    <div className="absolute left-[46%] top-[45%] -translate-x-1/2 -translate-y-1/2">
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                <GraduationCap size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Info card */}
                    <div className="absolute left-[52%] top-[28%] w-52 bg-white rounded-2xl shadow-lg p-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <GraduationCap size={16} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-900">{siteName}</p>
                                <p className="text-[11px] text-gray-400">Main Campus</p>
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-gray-500">{address}</p>
                        <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 rounded-lg w-full justify-center hover:shadow-md transition-shadow"
                        >
                            <Navigation size={12} />
                            Get Directions
                        </a>
                    </div>

                    {/* Zoom controls */}
                    <div className="absolute left-4 bottom-4 flex flex-col rounded-lg overflow-hidden shadow-sm border border-gray-200">
                        <button
                            type="button"
                            className="w-9 h-9 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 border-b border-gray-200"
                            aria-label="Zoom in"
                        >
                            <Plus size={16} />
                        </button>
                        <button
                            type="button"
                            className="w-9 h-9 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50"
                            aria-label="Zoom out"
                        >
                            <Minus size={16} />
                        </button>
                    </div>

                    <span className="absolute right-4 bottom-4 text-[11px] text-gray-400 bg-white/80 px-2 py-1 rounded">
                        © {siteName} Map View
                    </span>
                </div>
            </Container>
        </section>
    );
}
