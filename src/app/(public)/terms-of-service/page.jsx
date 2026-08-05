import Container from "@/app/components/ui/Container";

export const metadata = {
    title: "Terms of Service",
    description: "The terms and conditions for using the LMS University platform.",
};

const sections = [
    {
        title: "Acceptance of Terms",
        body: "By creating an account or using LMS University, you agree to these Terms of Service. If you do not agree, please do not use the platform.",
    },
    {
        title: "Accounts",
        body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must provide accurate information when registering.",
    },
    {
        title: "Course Content & Conduct",
        body: "Courses, lessons, assignments, and quizzes are provided for personal, non-commercial learning purposes. You agree not to redistribute course materials, impersonate other users, or attempt to disrupt the platform.",
    },
    {
        title: "Teacher Responsibilities",
        body: "Teachers are responsible for the accuracy and quality of the content they publish, and for grading student submissions fairly and in a timely manner.",
    },
    {
        title: "Payments & Enrollment",
        body: "Where courses have a price, enrollment is confirmed only after successful payment. Refund eligibility, if any, will be communicated at the time of purchase.",
    },
    {
        title: "Termination",
        body: "We may suspend or terminate accounts that violate these terms, misuse the platform, or engage in abusive behavior toward other users.",
    },
    {
        title: "Limitation of Liability",
        body: "LMS University is provided \"as is\" without warranties of any kind. We are not liable for any indirect or incidental damages arising from your use of the platform.",
    },
    {
        title: "Changes to These Terms",
        body: "We may revise these Terms of Service periodically. Continued use of the platform after changes are posted means you accept the revised terms.",
    },
];

export default function TermsOfServicePage() {
    return (
        <main className="pt-20">
            <section className="bg-slate-900 text-white py-20">
                <Container className="text-center">
                    <h1 className="text-5xl font-bold">Terms of Service</h1>
                    <p className="mt-5 text-slate-300 max-w-2xl mx-auto">
                        The rules and guidelines for using LMS University.
                    </p>
                </Container>
            </section>

            <section className="py-20 bg-white">
                <Container className="max-w-3xl">
                    <p className="text-sm text-slate-400 mb-10">Last updated: {new Date().getFullYear()}</p>
                    <div className="space-y-10">
                        {sections.map((s) => (
                            <div key={s.title}>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h2>
                                <p className="text-slate-600 leading-7">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        </main>
    );
}
