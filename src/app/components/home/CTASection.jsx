import Link from "next/link";
import Container from "../ui/Container";
import { ArrowRight, BookOpen, UserPlus } from "lucide-react";

export default function CTASection({
    badge = "Get started today",
    title = "Start Your Learning Journey Today",
    description = "Join thousands of students transforming their futures. Expert-led courses, flexible learning, and industry-recognized certificates await.",
    primaryHref = "/register",
    primaryLabel = "Create free account",
    primaryIcon: PrimaryIcon = UserPlus,
    secondaryHref = "/courses",
    secondaryLabel = "Browse courses",
    secondaryIcon: SecondaryIcon = BookOpen,
    background = "bg-blue-600",
}) {
    return (
        <section className={`py-24 ${background}`}>
            <Container className="max-w-4xl text-center">
                <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70">
                    {badge}
                </span>

                <h2 className="mt-8 text-4xl lg:text-5xl font-bold tracking-tight text-white">
                    {title}
                </h2>

                <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-white/60">
                    {description}
                </p>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href={primaryHref}
                        className="inline-flex items-center gap-2 rounded-lg bg-white text-blue-600 hover:bg-gray-50 px-8 py-3.5 font-semibold transition-all hover:shadow-lg"
                    >
                        <PrimaryIcon size={16} />
                        {primaryLabel}
                    </Link>
                    <Link
                        href={secondaryHref}
                        className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-transparent hover:bg-white/10 px-8 py-3.5 font-semibold text-white transition-all"
                    >
                        <SecondaryIcon size={16} />
                        {secondaryLabel}
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </Container>
        </section>
    );
}
