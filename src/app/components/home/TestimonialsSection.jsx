import { getTestimonials } from "@/services/testimonialService";

function Avatar({ name, image }) {
    if (image) {
        return <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover" />;
    }
    const initial = name?.charAt(0)?.toUpperCase() || "S";
    return (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent)] to-indigo-600 text-white flex items-center justify-center text-xl font-bold">
            {initial}
        </div>
    );
}

export default async function TestimonialsSection() {
    const testimonials = await getTestimonials(true);

    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-[var(--bg-main)]">

            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">

                    <span className="text-[var(--accent)] uppercase font-semibold tracking-widest text-sm">
                        Testimonials
                    </span>

                    <h2 className="text-4xl lg:text-5xl font-bold mt-4 text-[var(--text-primary)]">
                        What Our Students Say
                    </h2>

                    <p className="text-[var(--text-secondary)] mt-6 max-w-2xl mx-auto leading-relaxed text-base">
                        Hear from students who have transformed their careers through our university.
                    </p>

                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {testimonials.slice(0, 6).map((item) => (

                        <div
                            key={item._id}
                            className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-8 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
                        >

                            <div className="flex items-center gap-4">

                                <Avatar name={item.name} image={item.image} />

                                <div>

                                    <h3 className="font-semibold text-base text-[var(--text-primary)]">
                                        {item.name}
                                    </h3>

                                    <p className="text-sm text-[var(--text-secondary)]">
                                        {item.role}
                                    </p>

                                </div>

                            </div>

                            <div className="flex mt-5 text-yellow-400 text-lg">

                                {"★".repeat(item.rating || 5)}
                                {"☆".repeat(5 - (item.rating || 5))}

                            </div>

                            <p className="text-[var(--text-secondary)] mt-5 leading-7 text-sm">

                                "{item.content}"

                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}
