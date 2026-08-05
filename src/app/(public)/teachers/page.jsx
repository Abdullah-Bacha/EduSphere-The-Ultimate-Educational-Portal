import FeaturedTeachers from "@/app/components/home/FeaturedTeachers";

export const metadata = {
    title: "Teachers",
    description:
        "Meet the experienced, dedicated teachers at LMS University who help students master in-demand skills.",
};

export default function TeachersPage() {
    return (
        <main className="pt-20">

            <section className="bg-slate-900 text-white py-20">

                <div className="max-w-7xl mx-auto px-6 text-center">

                    <h1 className="text-5xl font-bold">
                        Our Teachers
                    </h1>

                    <p className="mt-5 text-slate-300 max-w-2xl mx-auto">
                        Meet our experienced teachers who are dedicated to
                        providing quality education and practical learning.
                    </p>

                </div>

            </section>

            <FeaturedTeachers />

        </main>
    );
}