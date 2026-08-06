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
                    Start Your Learning Journey Today
                </h2>

                <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-white/60">
                    Join thousands of students transforming their futures. Expert-led courses, flexible learning, and industry-recognized certificates await.
                </p>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 rounded-lg bg-white text-blue-600 hover:bg-gray-50 px-8 py-3.5 font-semibold transition-all hover:shadow-lg"
                    >
                        <UserPlus size={16} />
                        Create free account
                    </Link>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-transparent hover:bg-white/10 px-8 py-3.5 font-semibold text-white transition-all"
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
