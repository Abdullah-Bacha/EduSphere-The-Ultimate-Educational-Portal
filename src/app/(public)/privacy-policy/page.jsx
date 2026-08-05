import Container from "@/app/components/ui/Container";

export const metadata = {
    title: "Privacy Policy",
    description: "Learn how LMS University collects, uses, and protects your personal information.",
};

const sections = [
    {
        title: "Information We Collect",
        body: "When you register for an account, enroll in a course, or contact us, we collect information such as your name, email address, phone number, and any messages you send us. We also automatically collect basic usage data (like pages visited and course progress) to operate the platform.",
    },
    {
        title: "How We Use Your Information",
        body: "We use your information to create and manage your account, deliver course content, track your learning progress, communicate with you about your courses, and respond to support requests. We do not sell your personal information to third parties.",
    },
    {
        title: "Data Storage & Security",
        body: "Your data is stored in a secured database and access is restricted to authorized systems and personnel. Passwords are stored using industry-standard hashing and are never stored in plain text.",
    },
    {
        title: "Cookies",
        body: "We use essential cookies (such as your login session) to keep you signed in and to remember your preferences. We do not use third-party advertising cookies.",
    },
    {
        title: "Your Rights",
        body: "You can review and update your profile information at any time from your dashboard settings. To request deletion of your account or data, contact us using the details on our Contact page.",
    },
    {
        title: "Changes to This Policy",
        body: "We may update this Privacy Policy from time to time. Continued use of the platform after changes are posted constitutes acceptance of the updated policy.",
    },
];

export default function PrivacyPolicyPage() {
    return (
        <main className="pt-20">
            <section className="bg-slate-900 text-white py-20">
                <Container className="text-center">
                    <h1 className="text-5xl font-bold">Privacy Policy</h1>
                    <p className="mt-5 text-slate-300 max-w-2xl mx-auto">
                        How we collect, use, and protect your information on LMS University.
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
