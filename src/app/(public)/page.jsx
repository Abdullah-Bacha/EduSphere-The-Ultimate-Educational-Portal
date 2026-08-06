import StatisticsSection from "../components/home/StatisticsSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTASection from "../components/home/CTASection";
import FooterSection from "../components/home/FooterSection";
import HeroSection from "../components/home/HeroSection";
import TrustedCompanies from "../components/home/TrustedCompanies";
import AboutSection from "../components/home/AboutSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import FeaturedCourses from "../components/home/FeaturedCourses";
import FeaturedTeachers from "../components/home/FeaturedTeachers";
import FAQSection from "../components/home/FAQSection";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Home",
  description:
    "Learn today, lead tomorrow. Explore expert-led courses and grow your skills with LMS University's modern learning platform.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <TrustedCompanies />

      <AboutSection />

      <WhyChooseUs />

      <FeaturedCourses />

      <FeaturedTeachers />

      <StatisticsSection />

      <TestimonialsSection />

      <FAQSection />

      <CTASection />

      <FooterSection />
    </>
  );
}