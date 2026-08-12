"use client";

import { useEffect, useRef, useState } from "react";
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    Upload,
    X,
    Plus,
    Globe,
    Sparkles,
    Info,
    Megaphone,
    Phone,
    Layout,
    HelpCircle,
    Tags,
} from "lucide-react";

const DEFAULT_FORM = {
    siteName: "",
    siteTagline: "",
    siteLogo: "",
    heroBadge: "",
    heroTitle: "",
    heroHighlight: "",
    heroDescription: "",
    heroImage: "",
    aboutTitle: "",
    aboutDescription: "",
    aboutFeatures: [],
    ctaTitle: "",
    ctaDescription: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    footerDescription: "",
    socialFacebook: "",
    socialInstagram: "",
    socialTwitter: "",
    socialLinkedin: "",
    faqs: [],
    pricingPlans: [],
};

function Field({ label, hint, children }) {
    return (
        <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">{label}</label>
            {children}
            {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
        </div>
    );
}

function TextInput(props) {
    return (
        <input
            {...props}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
        />
    );
}

function TextArea(props) {
    return (
        <textarea
            {...props}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors resize-y"
        />
    );
}

function ImageField({ label, value, onChange }) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    async function handleFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                onChange(data.result.url);
            }
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    return (
        <Field label={label} hint="PNG, JPG, GIF or WebP — max 10 MB">
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 shrink-0 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {value ? (
                        <img src={value} alt={label} className="w-full h-full object-cover" />
                    ) : (
                        <Upload size={18} className="text-gray-300" />
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                    >
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
                    </button>
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600"
                        >
                            <X size={12} /> Remove
                        </button>
                    )}
                </div>
                <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
        </Field>
    );
}

function Section({ icon: Icon, title, description, children }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-7 py-5 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Icon size={17} />
                </div>
                <div>
                    <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                    {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
                </div>
            </div>
            <div className="p-7 space-y-5">{children}</div>
        </div>
    );
}

export default function WebsiteSettingsForm() {
    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/admin/website-settings", { cache: "no-store" });
                const data = await res.json();
                if (data.success) {
                    setFormData((prev) => ({ ...prev, ...data.result }));
                } else {
                    setStatus({ type: "error", message: data.message || "Unable to load settings." });
                }
            } catch (error) {
                setStatus({ type: "error", message: "Unable to load settings." });
            } finally {
                setLoadingData(false);
            }
        }
        load();
    }, []);

    function setField(name, value) {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleChange(e) {
        setField(e.target.name, e.target.value);
    }

    function updateFeature(index, value) {
        setFormData((prev) => {
            const next = [...prev.aboutFeatures];
            next[index] = value;
            return { ...prev, aboutFeatures: next };
        });
    }

    function addFeature() {
        setFormData((prev) => ({ ...prev, aboutFeatures: [...prev.aboutFeatures, ""] }));
    }

    function removeFeature(index) {
        setFormData((prev) => ({ ...prev, aboutFeatures: prev.aboutFeatures.filter((_, i) => i !== index) }));
    }

    function updateFaq(index, field, value) {
        setFormData((prev) => {
            const next = [...prev.faqs];
            next[index] = { ...next[index], [field]: value };
            return { ...prev, faqs: next };
        });
    }

    function addFaq() {
        setFormData((prev) => ({ ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] }));
    }

    function removeFaq(index) {
        setFormData((prev) => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
    }

    function updatePlanField(index, field, value) {
        setFormData((prev) => {
            const next = [...prev.pricingPlans];
            next[index] = { ...next[index], [field]: value };
            return { ...prev, pricingPlans: next };
        });
    }

    function updatePlanFeatures(index, text) {
        updatePlanField(index, "features", text.split("\n"));
    }

    function addPlan() {
        setFormData((prev) => ({
            ...prev,
            pricingPlans: [
                ...prev.pricingPlans,
                { name: "", price: "", period: "/month", description: "", features: [], ctaLabel: "Get Started", ctaHref: "/register", highlighted: false },
            ],
        }));
    }

    function removePlan(index) {
        setFormData((prev) => ({ ...prev, pricingPlans: prev.pricingPlans.filter((_, i) => i !== index) }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setStatus(null);

        try {
            const { _id, createdAt, updatedAt, trustedCompanies, whyChooseUs, __v, ...payload } = formData;

            const res = await fetch("/api/admin/website-settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus({ type: "error", message: data.message || "Update failed", errors: data.errors });
                return;
            }

            setStatus({ type: "success", message: "Website settings updated. Changes are live on the public site." });
        } catch (error) {
            setStatus({ type: "error", message: error.message || "Something went wrong" });
        } finally {
            setSaving(false);
        }
    }

    if (loadingData) {
        return (
            <div className="max-w-3xl space-y-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-gray-100 rounded-2xl" />
                ))}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            {status && (
                <div
                    className={`flex items-start gap-2.5 text-sm px-4 py-3 rounded-xl border ${
                        status.type === "success"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : "bg-red-50 border-red-100 text-red-600"
                    }`}
                >
                    {status.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    ) : (
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    )}
                    <div>
                        <p>{status.message}</p>
                        {status.errors?.length > 0 && (
                            <ul className="mt-1 list-disc list-inside">
                                {status.errors.map((err) => (
                                    <li key={err}>{err}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            <Section icon={Globe} title="Brand Identity" description="Shown in the navbar, footer, and browser tab across the site.">
                <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Site Name">
                        <TextInput name="siteName" value={formData.siteName} onChange={handleChange} placeholder="LMS University" required />
                    </Field>
                    <Field label="Tagline">
                        <TextInput name="siteTagline" value={formData.siteTagline} onChange={handleChange} placeholder="Learning Management System" />
                    </Field>
                </div>
                <ImageField label="Logo" value={formData.siteLogo} onChange={(url) => setField("siteLogo", url)} />
            </Section>

            <Section icon={Sparkles} title="Homepage Hero" description="The first thing visitors see on the homepage.">
                <Field label="Badge Text">
                    <TextInput name="heroBadge" value={formData.heroBadge} onChange={handleChange} placeholder="Welcome to LMS University" />
                </Field>
                <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Heading">
                        <TextInput name="heroTitle" value={formData.heroTitle} onChange={handleChange} placeholder="Learn Today, Lead Tomorrow" />
                    </Field>
                    <Field label="Highlighted Words" hint="Must exactly match part of the heading above — shown in blue.">
                        <TextInput name="heroHighlight" value={formData.heroHighlight} onChange={handleChange} placeholder="Lead Tomorrow" />
                    </Field>
                </div>
                <Field label="Description">
                    <TextArea name="heroDescription" value={formData.heroDescription} onChange={handleChange} rows={3} />
                </Field>
                <ImageField label="Hero Image" value={formData.heroImage} onChange={(url) => setField("heroImage", url)} />
            </Section>

            <Section icon={Info} title="About Section" description="Shown on the homepage and about page.">
                <Field label="Heading">
                    <TextInput name="aboutTitle" value={formData.aboutTitle} onChange={handleChange} />
                </Field>
                <Field label="Description">
                    <TextArea name="aboutDescription" value={formData.aboutDescription} onChange={handleChange} rows={3} />
                </Field>
                <Field label="Feature Checklist">
                    <div className="space-y-2">
                        {formData.aboutFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <TextInput
                                    value={feature}
                                    onChange={(e) => updateFeature(index, e.target.value)}
                                    placeholder="Feature"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="shrink-0 text-gray-400 hover:text-red-500 transition-colors p-2"
                                    aria-label="Remove feature"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addFeature}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            <Plus size={14} /> Add feature
                        </button>
                    </div>
                </Field>
            </Section>

            <Section icon={Megaphone} title="Call To Action" description="Shown on the homepage and about page before the footer.">
                <Field label="Heading">
                    <TextInput name="ctaTitle" value={formData.ctaTitle} onChange={handleChange} />
                </Field>
                <Field label="Description">
                    <TextArea name="ctaDescription" value={formData.ctaDescription} onChange={handleChange} rows={2} />
                </Field>
            </Section>

            <Section icon={Phone} title="Contact Details" description="Shown in the footer, contact page, and contact map.">
                <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Email">
                        <TextInput type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
                    </Field>
                    <Field label="Phone">
                        <TextInput name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
                    </Field>
                </div>
                <Field label="Address">
                    <TextInput name="contactAddress" value={formData.contactAddress} onChange={handleChange} />
                </Field>
            </Section>

            <Section icon={Layout} title="Footer & Social Links" description="Shown at the bottom of every public page.">
                <Field label="Footer Description">
                    <TextArea name="footerDescription" value={formData.footerDescription} onChange={handleChange} rows={2} />
                </Field>
                <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Facebook URL">
                        <TextInput name="socialFacebook" value={formData.socialFacebook} onChange={handleChange} placeholder="https://facebook.com/..." />
                    </Field>
                    <Field label="Instagram URL">
                        <TextInput name="socialInstagram" value={formData.socialInstagram} onChange={handleChange} placeholder="https://instagram.com/..." />
                    </Field>
                    <Field label="Twitter / X URL">
                        <TextInput name="socialTwitter" value={formData.socialTwitter} onChange={handleChange} placeholder="https://x.com/..." />
                    </Field>
                    <Field label="LinkedIn URL">
                        <TextInput name="socialLinkedin" value={formData.socialLinkedin} onChange={handleChange} placeholder="https://linkedin.com/..." />
                    </Field>
                </div>
            </Section>

            <Section icon={HelpCircle} title="FAQs" description="Shown on the courses page.">
                <div className="space-y-4">
                    {formData.faqs.map((faq, index) => (
                        <div key={index} className="rounded-xl border border-gray-100 p-4 space-y-2 relative">
                            <button
                                type="button"
                                onClick={() => removeFaq(index)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Remove FAQ"
                            >
                                <X size={16} />
                            </button>
                            <Field label="Question">
                                <TextInput
                                    value={faq.question}
                                    onChange={(e) => updateFaq(index, "question", e.target.value)}
                                />
                            </Field>
                            <Field label="Answer">
                                <TextArea
                                    value={faq.answer}
                                    onChange={(e) => updateFaq(index, "answer", e.target.value)}
                                    rows={2}
                                />
                            </Field>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addFaq}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        <Plus size={14} /> Add FAQ
                    </button>
                </div>
            </Section>

            <Section icon={Tags} title="Pricing Plans" description="Shown on the courses page.">
                <div className="space-y-4">
                    {formData.pricingPlans.map((plan, index) => (
                        <div key={index} className="rounded-xl border border-gray-100 p-4 space-y-4 relative">
                            <button
                                type="button"
                                onClick={() => removePlan(index)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Remove plan"
                            >
                                <X size={16} />
                            </button>

                            <div className="grid sm:grid-cols-3 gap-4">
                                <Field label="Plan Name">
                                    <TextInput value={plan.name} onChange={(e) => updatePlanField(index, "name", e.target.value)} />
                                </Field>
                                <Field label="Price">
                                    <TextInput value={plan.price} onChange={(e) => updatePlanField(index, "price", e.target.value)} placeholder="$19" />
                                </Field>
                                <Field label="Period">
                                    <TextInput value={plan.period} onChange={(e) => updatePlanField(index, "period", e.target.value)} placeholder="/month" />
                                </Field>
                            </div>

                            <Field label="Description">
                                <TextInput value={plan.description} onChange={(e) => updatePlanField(index, "description", e.target.value)} />
                            </Field>

                            <Field label="Features" hint="One feature per line">
                                <TextArea
                                    value={plan.features.join("\n")}
                                    onChange={(e) => updatePlanFeatures(index, e.target.value)}
                                    rows={4}
                                />
                            </Field>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field label="Button Label">
                                    <TextInput value={plan.ctaLabel} onChange={(e) => updatePlanField(index, "ctaLabel", e.target.value)} />
                                </Field>
                                <Field label="Button Link">
                                    <TextInput value={plan.ctaHref} onChange={(e) => updatePlanField(index, "ctaHref", e.target.value)} />
                                </Field>
                            </div>

                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={plan.highlighted}
                                    onChange={(e) => updatePlanField(index, "highlighted", e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20"
                                />
                                Highlight as &quot;Most Popular&quot;
                            </label>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addPlan}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        <Plus size={14} /> Add plan
                    </button>
                </div>
            </Section>

            <div className="flex items-center justify-end gap-3 pb-10">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
