import Link from "next/link";
import Container from "../ui/Container";
import { ArrowRight, BookOpen, UserPlus } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-24 bg-slate-950">
            <Container className="max-w-4xl text-center">
                <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                    Get started today
                </span>

                <h2 className="mt-6 text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
                    Ready to start your
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        learning journey?
                    </span>
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-400">
                    Join thousands of students already building skills on LMS University.
                    Expert instructors, flexible pacing, and a certificate at the end.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
                    >
                        <UserPlus size={16} />
                        Create free account
                    </Link>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
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
