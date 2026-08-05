import CoursesCatalog from "./CoursesCatalog";

export const metadata = {
    title: "Courses",
    description:
        "Browse professional courses at LMS University, taught by experienced instructors across web development, programming, and more.",
};

export default function CoursesPage() {
    return (
        <main className="pt-20">

            <section className="bg-slate-900 text-white py-20">

                <div className="max-w-7xl mx-auto px-6 text-center">

                    <h1 className="text-5xl font-bold">
                        Our Courses
                    </h1>

                    <p className="mt-5 text-slate-300 max-w-2xl mx-auto">
                        Explore our professional courses designed to help you
                        build real-world skills and achieve your career goals.
                    </p>

                </div>

            </section>

            <CoursesCatalog />

        </main>
    );
}