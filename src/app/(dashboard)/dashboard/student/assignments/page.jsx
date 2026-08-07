"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/app/components/ui/ToastProvider";
import { Paperclip, X, FileText, Upload } from "lucide-react";

export default function AssignmentsPage() {
    const { showToast } = useToast();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionContent, setSubmissionContent] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null); // { url, name, size }
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        async function fetchAssignments() {
            try {
                const res = await fetch("/api/student/assignments");
                const data = await res.json();
                if (data.success) {
                    setAssignments(data.result);
                } else {
                    setError(data.message || "Failed to load assignments");
                }
            } catch {
                setError("An error occurred while fetching assignments.");
            } finally {
                setLoading(false);
            }
        }
        fetchAssignments();
    }, []);

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.success) {
                setUploadedFile(data.result);
                showToast("File uploaded successfully.", "success");
            } else {
                showToast(data.message || "Upload failed", "error");
            }
        } catch {
            showToast("Upload failed", "error");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    function removeFile() {
        setUploadedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function openAssignment(assignment) {
        setSelectedAssignment(assignment);
        setSubmissionContent("");
        setUploadedFile(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!submissionContent.trim() && !uploadedFile) {
            showToast("Please provide a text answer or upload a file.", "error");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`/api/student/assignments/${selectedAssignment._id}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: submissionContent,
                    fileUrl: uploadedFile?.url || "",
                    fileName: uploadedFile?.name || "",
                }),
            });
            const data = await res.json();
            if (data.success) {
                setAssignments(prev =>
                    prev.map(a => a._id === selectedAssignment._id ? { ...a, submission: data.result } : a)
                );
                setSelectedAssignment(null);
                showToast("Assignment submitted successfully!", "success");
            } else {
                showToast(data.message, "error");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 animate-pulse">
                <div className="h-10 bg-slate-200 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <div className="p-6 text-red-600 bg-red-50 rounded-lg">{error}</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">My Assignments</h1>

            {selectedAssignment ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <button
                        onClick={() => setSelectedAssignment(null)}
                        className="text-slate-500 hover:text-blue-600 mb-4 inline-block font-medium"
                    >
                        &larr; Back to Assignments
                    </button>

                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedAssignment.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                        <span>📅 Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</span>
                        <span>🏆 Marks: {selectedAssignment.totalMarks}</span>
                    </div>

                    <div className="prose max-w-none text-slate-700 mb-8">
                        {selectedAssignment.description}
                    </div>

                    {/* Show existing submission if already submitted */}
                    {selectedAssignment.submission && (
                        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Previous Submission</p>
                            {selectedAssignment.submission.content && (
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedAssignment.submission.content}</p>
                            )}
                            {selectedAssignment.submission.fileUrl && (
                                <a
                                    href={selectedAssignment.submission.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 mt-2 text-sm text-blue-600 hover:underline"
                                >
                                    <FileText size={14} />
                                    {selectedAssignment.submission.fileName || "Uploaded file"}
                                </a>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-slate-800 font-bold mb-2">Text Answer</label>
                            <textarea
                                rows={5}
                                placeholder="Type your answer here or paste a link to your work..."
                                value={submissionContent}
                                onChange={(e) => setSubmissionContent(e.target.value)}
                                className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                            />
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-slate-800 font-bold mb-2">
                                Or Upload a File <span className="text-slate-400 font-normal text-xs">(PDF, Word, Excel, images — max 10 MB)</span>
                            </label>

                            {uploadedFile ? (
                                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                    <FileText size={18} className="text-blue-600 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-blue-800 truncate">{uploadedFile.name}</p>
                                        <p className="text-xs text-blue-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <button type="button" onClick={removeFile} className="text-blue-400 hover:text-red-500">
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                                >
                                    {uploading ? (
                                        <p className="text-sm text-slate-500">Uploading...</p>
                                    ) : (
                                        <>
                                            <Upload size={20} className="text-slate-400" />
                                            <p className="text-sm text-slate-500">Click to upload file</p>
                                        </>
                                    )}
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.png,.jpg,.jpeg,.gif,.webp"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedAssignment(null)}
                                className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || uploading}
                                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Submit Assignment"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-4">
                    {assignments.length === 0 ? (
                        <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-slate-100">
                            <div className="text-4xl mb-4">📝</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No pending assignments</h3>
                            <p className="text-slate-500">You&apos;re all caught up! Continue learning in your courses.</p>
                        </div>
                    ) : (
                        assignments.map((assignment) => {
                            const isSubmitted = !!assignment.submission;
                            const isGraded = assignment.submission?.status === "Graded";
                            const isOverdue = new Date(assignment.dueDate) < new Date() && !isSubmitted;

                            return (
                                <div key={assignment._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-slate-800">{assignment.title}</h3>
                                            {isGraded ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                                                    Graded: {assignment.submission.marksAwarded}/{assignment.totalMarks}
                                                </span>
                                            ) : isSubmitted ? (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">Submitted</span>
                                            ) : isOverdue ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">Overdue</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-md">Pending</span>
                                            )}
                                            {assignment.submission?.fileUrl && (
                                                <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">
                                                    <Paperclip size={11} /> File
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{assignment.description}</p>
                                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                            <span>📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                            <span>🏆 Total Marks: {assignment.totalMarks}</span>
                                        </div>
                                        {isGraded && assignment.submission?.feedback && (
                                            <p className="mt-2 text-xs text-slate-500 italic">
                                                Feedback: {assignment.submission.feedback}
                                            </p>
                                        )}
                                    </div>

                                    <div className="shrink-0 w-full md:w-auto">
                                        <button
                                            onClick={() => openAssignment(assignment)}
                                            className={`w-full md:w-auto px-6 py-2.5 rounded-lg font-medium ${
                                                isSubmitted
                                                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                            }`}
                                        >
                                            {isSubmitted ? "Update Submission" : "Start Assignment"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
