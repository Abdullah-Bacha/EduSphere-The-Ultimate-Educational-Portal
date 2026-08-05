import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/ui/ToastProvider";
import { ConfirmProvider } from "./components/ui/ConfirmProvider";
import ThemeInitializer from "./components/ui/ThemeInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lms-nextjs-rho.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LMS University | Modern Learning Management System",
    template: "%s | LMS University",
  },
  description:
    "Learn today, lead tomorrow. Join LMS University for expert-led courses, practical skills, and a modern learning management platform for students and teachers.",
  openGraph: {
    title: "LMS University",
    description:
      "A modern learning management system with expert instructors and professional courses.",
    url: siteUrl,
    siteName: "LMS University",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col">
        <ThemeInitializer />
        <ToastProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
