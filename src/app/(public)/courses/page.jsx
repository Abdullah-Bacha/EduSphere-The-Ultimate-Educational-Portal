import CoursesCatalog from "./CoursesCatalog";

export const metadata = {
    title: "Courses",
    description:
        "Browse professional courses at LMS University, taught by experienced instructors across web development, programming, and more.",
};

export default function CoursesPage() {
    return (
        <main className="pt-20">

            <section className="bg-[var(--text-primary)] text-white py-24">

                <div className="max-w-7xl mx-auto px-6 text-center">

                    <h1 className="text-5xl lg:text-6xl font-bold">
                        Our Courses
                    </h1>

                    <p className="mt-6 text-white/70 max-w-2xl mx-auto leading-relaxed text-lg">
                        Explore our professional courses designed to help you build real-world skills and achieve your career goals.
                    </p>

                </div>

            </section>

            <CoursesCatalog />

        </main>
    );
}