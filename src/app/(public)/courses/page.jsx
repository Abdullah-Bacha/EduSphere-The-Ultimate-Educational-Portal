import CoursesCatalog from "./CoursesCatalog";
import FeaturedCourseBanner from "@/app/components/courses/FeaturedCourseBanner";
import CourseBenefits from "@/app/components/courses/CourseBenefits";
import CoursesPricing from "@/app/components/courses/CoursesPricing";
import FAQSection from "@/app/components/home/FAQSection";
import CTASection from "@/app/components/home/CTASection";
import FooterSection from "@/app/components/home/FooterSection";
import { GraduationCap, BookOpen } from "lucide-react";
import { getWebsiteSettings } from "@/services/websiteSettingService";

export const metadata = {
    title: "Courses",
    description:
        "Browse professional courses at LMS University, taught by experienced instructors across web development, programming, and more.",
};

export default async function CoursesPage() {
    const settings = await getWebsiteSettings();

    return (
        <main>
            <CoursesCatalog />

            <FeaturedCourseBanner />

            <CourseBenefits />

            <CoursesPricing />

            <FAQSection
                badge="Frequently Asked Questions"
                title="Questions? We're Here to Help."
                description="Everything you need to know before you get started."
                faqs={settings.faqs}
            />

            <CTASection
                badge="Start Now"
                title="Start Learning Today"
                description="Choose a course, build practical skills, and take the next step toward your career."
                primaryHref="/courses"
                primaryLabel="Explore Courses"
                primaryIcon={BookOpen}
                secondaryHref="/register"
                secondaryLabel="Join LMS University"
                secondaryIcon={GraduationCap}
            />

            <FooterSection />
        </main>
    );
}
