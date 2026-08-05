"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "../ui/Container";

const faqs = [
    {
        question: "How do I enroll in a course?",
        answer:
            "Create a free account, browse our course catalog, and click \"Enroll\" on any course page. Once enrolled, the course appears in your student dashboard.",
    },
    {
        question: "Do I get a certificate after completing a course?",
        answer:
            "Yes. Once you complete all lessons, assignments, and quizzes in a course, a certificate is automatically generated and available from your dashboard.",
    },
    {
        question: "Can I access courses on my phone?",
        answer:
            "Yes, the platform is fully responsive and works on desktop, tablet, and mobile browsers — no app download required.",
    },
    {
        question: "How do I contact my instructor?",
        answer:
            "Every enrolled course gives you access to a direct messaging inbox with your instructor from your student dashboard, so you can ask questions any time.",
    },
    {
        question: "What if I need a refund?",
        answer:
            "Refund eligibility depends on the course and how much progress you've made. Reach out to us on the Contact page and our team will help.",
    },
    {
        question: "Can I become an instructor on LMS University?",
        answer:
            "We're always looking for experienced instructors. Send us a message from the Contact page with your background and the courses you'd like to teach.",
    },
];

function FAQItem({ faq, isOpen, onToggle }) {
    return (
        <div className="border-b border-slate-200 py-5">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between text-left gap-4"
            >
                <span className="font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown
                    size={20}
                    className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            {isOpen && (
                <p className="mt-3 text-slate-600 leading-7 text-sm">{faq.answer}</p>
            )}
        </div>
    );
}

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-24 bg-white">
            <Container className="max-w-3xl">
                <div className="text-center mb-14">
                    <span className="text-blue-600 uppercase font-semibold tracking-widest text-sm">
                        FAQ
                    </span>
                    <h2 className="text-4xl font-bold text-slate-900 mt-3">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-500 mt-4">
                        Everything you need to know before you get started.
                    </p>
                </div>

                <div>
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={faq.question}
                            faq={faq}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
}
