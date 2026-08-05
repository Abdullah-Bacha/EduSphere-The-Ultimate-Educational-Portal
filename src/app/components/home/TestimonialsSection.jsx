import { getTestimonials } from "@/services/testimonialService";

function Avatar({ name, image }) {
    if (image) {
        return <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover" />;
    }
    const initial = name?.charAt(0)?.toUpperCase() || "S";
    return (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold">
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
        <section className="py-24 bg-gray-50">

            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">

                    <span className="text-blue-600 uppercase font-semibold tracking-widest">
                        Testimonials
                    </span>

                    <h2 className="text-4xl font-bold mt-3">
                        What Our Students Say
                    </h2>

                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        Hear from students who have transformed their careers
                        through our university.
                    </p>

                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {testimonials.slice(0, 6).map((item) => (

                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 transition"
                        >

                            <div className="flex items-center gap-4">

                                <Avatar name={item.name} image={item.image} />

                                <div>

                                    <h3 className="font-bold text-lg">
                                        {item.name}
                                    </h3>

                                    <p className="text-sm text-blue-600">
                                        {item.role}
                                    </p>

                                </div>

                            </div>

                            <div className="flex mt-5 text-yellow-400 text-xl">

                                {"★".repeat(item.rating || 5)}
                                {"☆".repeat(5 - (item.rating || 5))}

                            </div>

                            <p className="text-gray-600 mt-5 leading-7">

                                "{item.content}"

                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}
