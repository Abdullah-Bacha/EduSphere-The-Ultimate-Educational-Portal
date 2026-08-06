import FeaturedTeachers from "@/app/components/home/FeaturedTeachers";

export const metadata = {
    title: "Teachers",
    description:
        "Meet the experienced, dedicated teachers at LMS University who help students master in-demand skills.",
};

export default function TeachersPage() {
    return (
        <main className="pt-20">

            <section className="bg-[var(--text-primary)] text-white py-24">

                <div className="max-w-7xl mx-auto px-6 text-center">

                    <h1 className="text-5xl lg:text-6xl font-bold">
                        Our Teachers
                    </h1>

                    <p className="mt-6 text-white/70 max-w-2xl mx-auto leading-relaxed text-lg">
                        Meet our experienced teachers who are dedicated to providing quality education and practical learning.
                    </p>

                </div>

            </section>

            <FeaturedTeachers />

        </main>
    );
}