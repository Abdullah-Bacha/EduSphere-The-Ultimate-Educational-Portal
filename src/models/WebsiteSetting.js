import mongoose from "mongoose";

const WebsiteSettingSchema = new mongoose.Schema(
    {
        siteName: {
            type: String,
            default: "LMS University",
        },

        siteTagline: {
            type: String,
            default: "Learning Management System",
        },

        siteLogo: {
            type: String,
            default: "",
        },

        heroBadge: {
            type: String,
            default: "Welcome to LMS University",
        },

        heroTitle: {
            type: String,
            default: "Learn Today, Lead Tomorrow",
        },

        heroHighlight: {
            type: String,
            default: "Lead Tomorrow",
        },

        heroDescription: {
            type: String,
            default:
                "Join thousands of students learning through our modern Learning Management System with expert instructors, practical courses, and industry-ready skills.",
        },

        heroImage: {
            type: String,
            default: "",
        },

        aboutTitle: {
            type: String,
            default: "Empowering Students Through Modern Education",
        },

        aboutDescription: {
            type: String,
            default:
                "Our Learning Management System provides a modern, flexible and interactive environment where students can learn from experienced instructors, access high-quality courses and build practical skills for their future careers.",
        },

        aboutFeatures: {
            type: [String],
            default: [
                "Experienced Faculty Members",
                "Industry-Oriented Courses",
                "Online Learning Platform",
                "International Certifications",
            ],
        },

        trustedCompanies: {
            type: [String],
            default: [
                "Google",
                "Microsoft",
                "Amazon",
                "Meta",
                "IBM",
                "Oracle",
            ],
        },

        whyChooseUs: {
            type: [
                {
                    title: String,
                    description: String,
                    icon: String,
                },
            ],
            default: [
                {
                    title: "Expert Instructors",
                    description:
                        "Learn from industry professionals with years of teaching and real-world experience.",
                    icon: "👨‍🏫",
                },
                {
                    title: "Flexible Learning",
                    description:
                        "Study at your own pace with 24/7 access to courses and learning materials.",
                    icon: "⏰",
                },
                {
                    title: "Certified Programs",
                    description:
                        "Earn recognized certificates upon course completion to boost your career.",
                    icon: "🏆",
                },
                {
                    title: "Community Support",
                    description:
                        "Join a vibrant community of learners and get help whenever you need it.",
                    icon: "🤝",
                },
            ],
        },

        ctaTitle: {
            type: String,
            default: "Ready to Start Your Learning Journey?",
        },

        ctaDescription: {
            type: String,
            default:
                "Join our community of learners and take the first step toward your career goals today.",
        },

        contactEmail: {
            type: String,
            default: "info@lmsuniversity.com",
        },

        contactPhone: {
            type: String,
            default: "+92 300 1234567",
        },

        contactAddress: {
            type: String,
            default: "Takht Bhai, Mardan, Pakistan",
        },

        footerDescription: {
            type: String,
            default:
                "A modern learning management system designed to provide quality education with experienced teachers and professional courses.",
        },

        socialFacebook: {
            type: String,
            default: "",
        },

        socialInstagram: {
            type: String,
            default: "",
        },

        socialTwitter: {
            type: String,
            default: "",
        },

        socialLinkedin: {
            type: String,
            default: "https://linkedin.com/in/abdullah-bacha",
        },

        faqs: {
            type: [
                {
                    question: String,
                    answer: String,
                },
            ],
            default: [
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
            ],
        },

        pricingPlans: {
            type: [
                {
                    name: String,
                    price: String,
                    period: String,
                    description: String,
                    features: [String],
                    ctaLabel: String,
                    ctaHref: String,
                    highlighted: Boolean,
                },
            ],
            default: [
                {
                    name: "Basic",
                    price: "$19",
                    period: "/month",
                    description: "For learners getting started.",
                    features: [
                        "Access to selected courses",
                        "Course materials",
                        "Quizzes",
                        "Progress tracking",
                        "Course completion certificate",
                    ],
                    ctaLabel: "Get Started",
                    ctaHref: "/register",
                    highlighted: false,
                },
                {
                    name: "Professional",
                    price: "$39",
                    period: "/month",
                    description: "For learners serious about career-ready skills.",
                    features: [
                        "Access to all courses",
                        "Live classes",
                        "Practical projects",
                        "Instructor support",
                        "Certificates",
                        "Progress tracking",
                    ],
                    ctaLabel: "Start Learning",
                    ctaHref: "/register",
                    highlighted: true,
                },
                {
                    name: "Institution",
                    price: "Custom",
                    period: "",
                    description: "For universities and organizations.",
                    features: [
                        "Institutional course access",
                        "Student management",
                        "Instructor tools",
                        "Learning analytics",
                        "Dedicated support",
                        "Custom learning programs",
                    ],
                    ctaLabel: "Contact Us",
                    ctaHref: "/contact",
                    highlighted: false,
                },
            ],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.WebsiteSetting ||
    mongoose.model("WebsiteSetting", WebsiteSettingSchema);
