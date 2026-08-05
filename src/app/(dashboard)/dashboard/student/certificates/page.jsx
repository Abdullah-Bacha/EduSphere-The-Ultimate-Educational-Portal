"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/app/components/ui/ToastProvider";

function CertificatesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast } = useToast();
    const courseId = searchParams.get("courseId");

    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCert, setSelectedCert] = useState(null);
    const [generating, setGenerating] = useState(false);

    async function loadCertificates() {
        try {
            const res = await fetch("/api/student/certificates");
            const data = await res.json();
            if (data.success) {
                setCertificates(data.result);
            } else {
                setError(data.message || "Failed to load certificates");
            }
        } catch (err) {
            setError("An error occurred while fetching certificates.");
        } finally {
            setLoading(false);
        }
    }

    async function handleGenerate(cid) {
        setGenerating(true);
        try {
            const res = await fetch("/api/student/certificates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: cid }),
            });
            const data = await res.json();
            if (data.success) {
                await loadCertificates();
                setSelectedCert(data.result);
                showToast("Certificate generated successfully!", "success");
                // Clear query parameter
                router.replace("/dashboard/student/certificates");
            } else {
                showToast(data.message || "Failed to generate certificate.", "error");
            }
        } catch (err) {
            console.error("Error generating certificate:", err);
        } finally {
            setGenerating(false);
        }
    }

    useEffect(() => {
        loadCertificates();
    }, []);

    useEffect(() => {
        if (courseId && certificates.length > 0) {
            // Check if already exists in loaded list
            const existing = certificates.find(c => c.course?._id === courseId);
            if (existing) {
                setSelectedCert(existing);
                router.replace("/dashboard/student/certificates");
            } else {
                // Generate
                handleGenerate(courseId);
            }
        } else if (courseId) {
            // Generate directly if list hasn't loaded yet
            handleGenerate(courseId);
        }
    }, [courseId, certificates]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="p-6 animate-pulse space-y-4">
                <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-48 bg-slate-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 print:p-0">
            <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Certificates</h1>
                    <p className="text-slate-500 text-sm mt-1">View and download certificates you have earned by completing courses.</p>
                </div>
            </div>

            {generating && (
                <div className="print:hidden bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-2xl text-center">
                    <div className="animate-spin text-3xl mb-2">⏳</div>
                    <div className="font-bold">Generating your certificate...</div>
                    <div className="text-sm mt-1">Please wait while we verify your course progress and prepare your document.</div>
                </div>
            )}

            {selectedCert ? (
                /* Premium Certificate View */
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
                    <button
                        onClick={() => setSelectedCert(null)}
                        className="print:hidden text-slate-500 hover:text-blue-600 mb-6 font-semibold flex items-center gap-1"
                    >
                        &larr; Back to Certificates
                    </button>

                    {/* Certificate Frame */}
                    <div className="relative border-[12px] border-slate-800 p-8 md:p-16 rounded-2xl bg-amber-50/20 text-center max-w-4xl mx-auto shadow-inner">
                        {/* Certificate Header */}
                        <div className="text-slate-500 font-serif text-lg tracking-widest uppercase mb-4">
                            Certificate of Completion
                        </div>
                        
                        <div className="w-16 h-1 bg-slate-800 mx-auto mb-8"></div>

                        <div className="text-slate-500 italic font-serif text-md mb-6">
                            This is proudly presented to
                        </div>

                        <div className="text-slate-850 font-serif text-3xl md:text-5xl font-bold italic mb-6">
                            {selectedCert.student?.name || "Student"}
                        </div>

                        <div className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
                            for successfully completing all curriculum requirements and passing final progress marks for the course:
                        </div>

                        <div className="text-blue-900 font-serif text-2xl md:text-3xl font-bold mb-10">
                            {selectedCert.course?.title || "Course"}
                        </div>

                        {/* Signatures / Credentials Section */}
                        <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mt-16 pt-8 border-t border-slate-200">
                            <div>
                                <div className="font-serif italic text-slate-800 text-lg mb-1">
                                    {selectedCert.course?.instructor || "Instructor"}
                                </div>
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Instructor</div>
                            </div>
                            <div>
                                <div className="font-serif italic text-slate-850 text-lg mb-1">LMS Platform</div>
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">LMS Provider</div>
                            </div>
                        </div>

                        {/* Certificate ID */}
                        <div className="text-xs font-mono text-slate-400 mt-12">
                            Certificate ID: {selectedCert.certificateId} &bull; Issued: {new Date(selectedCert.issueDate).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="print:hidden mt-8 flex justify-center gap-4">
                        <button
                            onClick={handlePrint}
                            className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-sm"
                        >
                            🖨️ Print / Save PDF
                        </button>
                        <button
                            onClick={() => setSelectedCert(null)}
                            className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Close View
                        </button>
                    </div>
                </div>
            ) : (
                /* Certificate List */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.length === 0 ? (
                        <div className="col-span-full bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                            <div className="text-5xl mb-4">🏆</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No certificates earned yet</h3>
                            <p className="text-slate-500 max-w-md mx-auto mb-6">
                                Certificates are awarded when you complete 100% of a course curriculum. Start learning to earn yours!
                            </p>
                            <Link href="/dashboard/student/my-courses" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                                Go to My Courses
                            </Link>
                        </div>
                    ) : (
                        certificates.map((cert) => (
                            <div
                                key={cert._id}
                                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                            >
                                <div>
                                    <div className="text-xs font-bold text-blue-600 mb-2 bg-blue-50 px-2 py-0.5 rounded inline-block">
                                        Completion Award
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-1 leading-snug line-clamp-2">
                                        {cert.course?.title || "Completed Course"}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium mb-4">
                                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedCert(cert)}
                                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-center text-sm"
                                >
                                    View Certificate
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default function CertificatesPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading Certificates Module...</div>}>
            <CertificatesContent />
        </Suspense>
    );
}
