const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lms-nextjs-rho.vercel.app";

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: [
                    "/",
                    "/about",
                    "/courses",
                    "/teachers",
                    "/contact",
                    "/login",
                    "/register",
                    "/privacy-policy",
                    "/terms-of-service",
                ],
                disallow: ["/dashboard", "/api"],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
