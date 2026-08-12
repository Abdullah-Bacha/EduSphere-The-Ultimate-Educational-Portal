import { Quote, Star } from "lucide-react";
import { getTestimonials } from "@/services/testimonialService";

export default async function StudentStories() {
    const testimonials = await getTestimonials();
    const stories = testimonials.slice(0, 3).map((t) => ({
        id: t._id,
        rating: t.rating,
        content: t.message,
        name: t.name,
        role: t.role,
    }));

    if (stories.length === 0) {
        return null;
    }

    return (
        <section className="relative overflow-hidden py-24 bg-gradient-to-b from-[#f4f6ff] to-white">
            {/* Decorative quote watermarks */}
            <Quote
                className="absolute -top-4 left-6 text-blue-100 opacity-70"
                size={120}
                strokeWidth={1.5}
                fill="currentColor"
            />
            <Quote
                className="absolute -bottom-10 -right-4 text-blue-100 opacity-70 rotate-180"
                size={120}
                strokeWidth={1.5}
                fill="currentColor"
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-14">
                    <span className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full text-sm font-semibold text-blue-600 bg-blue-100">
                        Student Stories
                    </span>

                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                        What Our Students Say
                    </h2>

                    <p className="mt-4 max-w-2xl mx-auto text-gray-500 leading-relaxed">
                        Real experiences from learners building their skills and careers with
                        LMS University.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {stories.map((story) => (
                        <div
                            key={story.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6 flex flex-col"
                        >
                            <Quote
                                className="text-blue-100 mb-2"
                                size={32}
                                strokeWidth={1.5}
                                fill="currentColor"
                            />

                            <div className="flex gap-1 mb-3">
                                {Array.from({ length: story.rating }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className="text-amber-400"
                                        fill="currentColor"
                                    />
                                ))}
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed flex-1">
                                &quot;{story.content}&quot;
                            </p>

                            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50" />
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">
                                        {story.name}
                                    </p>
                                    <p className="text-xs text-blue-600">{story.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
