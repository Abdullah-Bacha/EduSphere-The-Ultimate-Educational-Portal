import StatisticsSection from "../components/home/StatisticsSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTASection from "../components/home/CTASection";
import FooterSection from "../components/home/FooterSection";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import FeaturedCourses from "../components/home/FeaturedCourses";
import FeaturedTeachers from "../components/home/FeaturedTeachers";

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

      <AboutSection />

      <WhyChooseUs />

      <FeaturedCourses />

      <FeaturedTeachers />

      <StatisticsSection />

      <TestimonialsSection />

      <CTASection />

      <FooterSection />
    </>
  );
}