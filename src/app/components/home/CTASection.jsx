import Link from "next/link";
import Container from "../ui/Container";
import { ArrowRight, BookOpen, UserPlus } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-24 bg-blue-600">
            <Container className="max-w-4xl text-center">
                <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70">
                    Get started today
                </span>

                <h2 className="mt-8 text-4xl lg:text-5xl font-bold tracking-tight text-white">
                    Ready to start your learning journey?
                </h2>

                <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-white/60">
                    Join thousands of students already building skills on LMS University. Expert instructors, flexible pacing, and a certificate at the end.
                </p>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-8 py-3.5 font-semibold text-white transition-all hover:shadow-lg"
                    >
                        <UserPlus size={16} />
                        Create free account
                    </Link>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/20 bg-white/10 hover:bg-white/20 px-8 py-3.5 font-semibold text-white transition-all"
                    >
                        <BookOpen size={16} />
                        Browse courses
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </Container>
        </section>
    );
}
