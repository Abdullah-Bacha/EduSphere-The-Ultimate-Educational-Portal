import mongoose from "mongoose";

const WebsiteSettingSchema = new mongoose.Schema(
    {
        siteName: {
            type: String,
            default: "EduSphere",
        },

        heroBadge: {
            type: String,
            default: "🎓 Admissions Open 2026",
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
            default: "contact@edusphere.com",
        },

        contactPhone: {
            type: String,
            default: "+1 (555) 123-4567",
        },

        contactAddress: {
            type: String,
            default: "123 University Avenue, Education City",
        },

        footerDescription: {
            type: String,
            default:
                "Empowering students worldwide with quality education through our modern learning platform.",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.WebsiteSetting ||
    mongoose.model("WebsiteSetting", WebsiteSettingSchema);
