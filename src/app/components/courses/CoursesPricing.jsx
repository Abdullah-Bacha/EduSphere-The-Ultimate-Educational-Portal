import Link from "next/link";
import Container from "@/app/components/ui/Container";
import { Check } from "lucide-react";
import { getWebsiteSettings } from "@/services/websiteSettingService";

export default async function CoursesPricing() {
    const settings = await getWebsiteSettings();
    const plans = settings.pricingPlans.map((plan) => ({
        ...plan,
        cta: { label: plan.ctaLabel, href: plan.ctaHref },
        highlight: plan.highlighted,
    }));

    return (
        <section
            className="relative overflow-hidden py-24"
            style={{
                backgroundImage:
                    "linear-gradient(151deg, #f9fafb 0%, rgba(247,249,252,0.65) 50%, rgba(239,246,255,0.3) 100%)",
            }}
        >
            <div className="absolute -left-24 -top-24 w-80 h-80 rounded-full bg-blue-100/30 blur-[64px]" />

            <Container className="relative">
                <div className="text-center mb-14">
                    <span className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold">
                        Simple Pricing
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Choose the Right Learning Plan
                    </h2>
                    <p className="mt-3 text-gray-500 max-w-lg mx-auto">
                        Flexible plans designed for different learning goals.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-7 items-start">
                    {plans.map((plan) =>
                        plan.highlight ? (
                            <div
                                key={plan.name}
                                className="relative rounded-[25px] overflow-hidden shadow-[0_0_0_4px_rgba(142,197,255,0.3),0_26px_52px_-12px_rgba(142,197,255,0.5)] lg:-mt-3 lg:mb-3"
                                style={{ backgroundImage: "linear-gradient(129deg, #155dfc 0%, #432dd7 100%)" }}
                            >
                                <div className="bg-white/20 py-2 text-center">
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                                        ✦ Most Popular
                                    </span>
                                </div>
                                <div className="p-8">
                                    <p className="text-sm font-bold uppercase tracking-wider text-blue-200">{plan.name}</p>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                                        <span className="text-blue-200">{plan.period}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-blue-100">{plan.description}</p>

                                    <ul className="mt-7 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2.5 text-sm text-blue-50">
                                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 shrink-0">
                                                    <Check size={13} className="text-white" />
                                                </span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={plan.cta.href}
                                        className="mt-8 block text-center rounded-2xl bg-white py-3 font-semibold text-blue-600 shadow-lg hover:shadow-xl transition-shadow"
                                    >
                                        {plan.cta.label}
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div
                                key={plan.name}
                                className="rounded-[24px] border border-gray-100 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
                            >
                                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">{plan.name}</p>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                                    <span className="text-gray-400">{plan.period}</span>
                                </div>
                                <p className="mt-1 text-sm text-gray-400">{plan.description}</p>

                                <ul className="mt-7 space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-600">
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 shrink-0">
                                                <Check size={13} className="text-blue-600" />
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={plan.cta.href}
                                    className="mt-8 block text-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white hover:shadow-lg transition-shadow"
                                >
                                    {plan.cta.label}
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </Container>
        </section>
    );
}
