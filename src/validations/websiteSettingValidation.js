const STRING_FIELDS = [
    "siteName",
    "siteTagline",
    "siteLogo",
    "heroBadge",
    "heroTitle",
    "heroHighlight",
    "heroDescription",
    "heroImage",
    "aboutTitle",
    "aboutDescription",
    "ctaTitle",
    "ctaDescription",
    "contactEmail",
    "contactPhone",
    "contactAddress",
    "footerDescription",
    "socialFacebook",
    "socialInstagram",
    "socialTwitter",
    "socialLinkedin",
];

const ARRAY_FIELDS = ["aboutFeatures", "trustedCompanies"];

function normalizeFaqs(faqs) {
    if (!Array.isArray(faqs)) return [];
    return faqs
        .map((faq) => ({
            question: String(faq?.question ?? "").trim(),
            answer: String(faq?.answer ?? "").trim(),
        }))
        .filter((faq) => faq.question && faq.answer);
}

function normalizePricingPlans(plans) {
    if (!Array.isArray(plans)) return [];
    return plans
        .map((plan) => ({
            name: String(plan?.name ?? "").trim(),
            price: String(plan?.price ?? "").trim(),
            period: String(plan?.period ?? "").trim(),
            description: String(plan?.description ?? "").trim(),
            features: Array.isArray(plan?.features)
                ? plan.features.map((f) => String(f ?? "").trim()).filter(Boolean)
                : [],
            ctaLabel: String(plan?.ctaLabel ?? "").trim(),
            ctaHref: String(plan?.ctaHref ?? "").trim(),
            highlighted: Boolean(plan?.highlighted),
        }))
        .filter((plan) => plan.name);
}

export function normalizeWebsiteSettingPayload(data) {
    const payload = {};

    for (const field of STRING_FIELDS) {
        if (data?.[field] !== undefined) {
            payload[field] = String(data[field] ?? "").trim();
        }
    }

    for (const field of ARRAY_FIELDS) {
        if (data?.[field] !== undefined) {
            payload[field] = Array.isArray(data[field])
                ? data[field].map((item) => String(item ?? "").trim()).filter(Boolean)
                : [];
        }
    }

    if (data?.faqs !== undefined) {
        payload.faqs = normalizeFaqs(data.faqs);
    }

    if (data?.pricingPlans !== undefined) {
        payload.pricingPlans = normalizePricingPlans(data.pricingPlans);
    }

    return payload;
}

export function validateWebsiteSettingPayload(data) {
    const errors = [];
    const payload = normalizeWebsiteSettingPayload(data);

    if (payload.siteName !== undefined && !payload.siteName) {
        errors.push("Site name is required.");
    }

    if (payload.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.contactEmail)) {
        errors.push("Contact email must be a valid email address.");
    }

    return { valid: errors.length === 0, errors, payload };
}
