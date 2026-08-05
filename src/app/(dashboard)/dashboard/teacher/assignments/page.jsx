"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/app/components/ui/ToastProvider";
import { useConfirm } from "@/app/components/ui/ConfirmProvider";
import { FileText, Paperclip } from "lucide-react";

function AssignmentsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const courseIdParam = searchParams.get("courseId");

    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [assignments, setAssignments] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingAssignments, setLoadingAssignments] = useState(false);

    // Selected assignment detail / submission grading view
    const [activeAssignment, setActiveAssignment] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    
    // Grading Modal State
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradingForm, setGradingForm] = useState({
        marksAwarded: 0,
        feedback: "",
    });
    const [gradingSubmitting, setGradingSubmitting] = useState(false);

    // Create/Edit Assignment Modal State
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        totalMarks: 100,
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch teacher's courses
    async function loadCourses() {
        try {
            const res = await fetch("/api/teacher/courses?limit=100");
            const data = await res.json();
            if (data.success) {
                setCourses(data.result.courses);
                if (courseIdParam) {
                    setSelectedCourseId(courseIdParam);
                } else if (data.result.courses.length > 0) {
                    setSelectedCourseId(data.result.courses[0]._id);
                }
            }
        } catch (err) {
            console.error("Failed to load courses", err);
        } finally {
            setLoadingCourses(false);
        }
    }

    // Fetch assignments for the selected course
    async function loadAssignments(cid) {
        if (!cid) return;
        setLoadingAssignments(true);
        try {
            const res = await fetch(`/api/teacher/assignments?courseId=${cid}`);
            const data = await res.json();
            if (data.success) {
                setAssignments(data.result);
            } else {
                setAssignments([]);
            }
        } catch (err) {
            console.error("Failed to load assignments", err);
            setAssignments([]);
        } finally {
            setLoadingAssignments(false);
        }
    }

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            loadAssignments(selectedCourseId);
            setActiveAssignment(null); // Clear selected details on course switch
        }
    }, [selectedCourseId]);

    const handleCourseChange = (e) => {
        const cid = e.target.value;
        setSelectedCourseId(cid);
        router.replace(`/dashboard/teacher/assignments?courseId=${cid}`);
    };

    // Load active assignment submissions
    async function loadAssignmentSubmissions(aid) {
        setLoadingDetails(true);
        try {
            const res = await fetch(`/api/teacher/assignments/${aid}`);
            const data = await res.json();
            if (data.success) {
                setActiveAssignment(data.result);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    }

    const openCreateModal = () => {
        setEditingAssignment(null);
        setFormData({
            title: "",
            description: "",
            dueDate: "",
            totalMarks: 100,
        });
        setShowFormModal(true);
    };

    const openEditModal = (assignment) => {
        setEditingAssignment(assignment);
        setFormData({
            title: assignment.title || "",
            description: assignment.description || "",
            dueDate: assignment.dueDate ? assignment.dueDate.split("T")[0] : "",
            totalMarks: assignment.totalMarks || 100,
        });
        setShowFormModal(true);
    };

    const handleDelete = async (id) => {
        const ok = await confirm("Are you sure you want to delete this assignment?", { title: "Delete assignment" });
        if (!ok) return;
        try {
            const res = await fetch(`/api/teacher/assignments/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                showToast("Assignment deleted successfully.", "success");
                loadAssignments(selectedCourseId);
                setActiveAssignment(null);
            } else {
                showToast(data.message, "error");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingAssignment ? `/api/teacher/assignments/${editingAssignment._id}` : "/api/teacher/assignments";
            const method = editingAssignment ? "PUT" : "POST";
            
            const payload = editingAssignment 
                ? formData 
                : { ...formData, courseId: selectedCourseId };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                showToast(editingAssignment ? "Assignment updated successfully." : "Assignment created successfully.", "success");
                setShowFormModal(false);
                loadAssignments(selectedCourseId);
            } else {
                showToast(data.message, "error");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const openGradingModal = (submission) => {
        setSelectedSubmission(submission);
        setGradingForm({
            marksAwarded: submission.marksAwarded || 0,
            feedback: submission.feedback || "",
        });
    };

    const handleGradingSubmit = async (e) => {
        e.preventDefault();
        setGradingSubmitting(true);
        try {
            const res = await fetch(`/api/teacher/assignments/${activeAssignment._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    submissionId: selectedSubmission._id,
                    marksAwarded: gradingForm.marksAwarded,
                    feedback: gradingForm.feedback,
                }),
            });
            const data = await res.json();
            if (data.success) {
                showToast("Submission graded successfully.", "success");
                setSelectedSubmission(null);
                loadAssignmentSubmissions(activeAssignment._id);
            } else {
                showToast(data.message, "error");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setGradingSubmitting(false);
        }
    };

    if (loadingCourses) {
        return (
            <div className="p-6 animate-pulse space-y-6">
                <div className="h-10 bg-slate-200 rounded w-1/4"></div>
                <div className="h-20 bg-slate-200 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Assignments Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Publish homework tasks, view student submissions, and grade answers.</p>
                </div>
                {selectedCourseId && !activeAssignment && (
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm text-center shrink-0"
                    >
                        + Add Assignment
                    </button>
                )}
            </div>

            {/* Selector dropdown (Only visible if not looking at detailed submissions list) */}
            {!activeAssignment && (
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-sm font-bold text-slate-600 shrink-0">Select Course:</label>
                    {courses.length === 0 ? (
                        <span className="text-slate-500 text-sm">No courses assigned yet. Contact Admin.</span>
                    ) : (
                        <select
                            value={selectedCourseId}
                            onChange={handleCourseChange}
                            className="w-full sm:max-w-md border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700 font-medium"
                        >
                            {courses.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.title} ({course.category})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            {activeAssignment ? (
                /* Submissions Detailed Listing View */
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <button
                            onClick={() => setActiveAssignment(null)}
                            className="text-slate-500 hover:text-blue-600 font-semibold mb-2 inline-block text-sm"
                        >
                            &larr; Back to Course Assignments
                        </button>
                        
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{activeAssignment.title}</h2>
                                <p className="text-slate-500 text-sm mt-1 whitespace-pre-wrap">{activeAssignment.description}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => openEditModal(activeAssignment)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                                >
                                    Edit Details
                                </button>
                                <button
                                    onClick={() => handleDelete(activeAssignment._id)}
                                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-650 font-bold rounded-lg text-xs"
                                >
                                    Delete Task
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-bold uppercase pt-4 border-t">
                            <span>📅 Due: {new Date(activeAssignment.dueDate).toLocaleDateString()}</span>
                            <span>🏆 Marks: {activeAssignment.totalMarks}</span>
                        </div>
                    </div>

                    {/* Submissions Table — full roster */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 text-lg">Student Roster</h3>
                            {activeAssignment.enrolledStudents && (
                                <div className="flex items-center gap-3 text-xs font-semibold">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                        ✓ {activeAssignment.submissions?.filter(s => s.status === "Graded").length || 0} Graded
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                        ↑ {activeAssignment.submissions?.filter(s => s.status === "Submitted").length || 0} Submitted
                                    </span>
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                                        — {Math.max(0, (activeAssignment.enrolledStudents?.length || 0) - (activeAssignment.submissions?.length || 0))} Not submitted
                                    </span>
                                </div>
                            )}
                        </div>

                        {loadingDetails ? (
                            <div className="p-12 text-center text-slate-400">Loading submissions...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-450 uppercase tracking-wider">
                                            <th className="p-4">Student</th>
                                            <th className="p-4">Content / Answer</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Marks</th>
                                            <th className="p-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                                        {/* Show submitted students */}
                                        {activeAssignment.submissions?.map((sub) => (
                                            <tr key={sub._id} className="hover:bg-slate-50/50">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-800">{sub.student?.name}</div>
                                                    <div className="text-xs text-slate-400">{sub.student?.email}</div>
                                                </td>
                                                <td className="p-4 max-w-sm">
                                                    {sub.content && (
                                                        <p className="truncate text-sm text-slate-700" title={sub.content}>{sub.content}</p>
                                                    )}
                                                    {sub.fileUrl && (
                                                        <a
                                                            href={sub.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600 hover:underline"
                                                        >
                                                            <Paperclip size={12} />
                                                            {sub.fileName || "Download file"}
                                                        </a>
                                                    )}
                                                    {!sub.content && !sub.fileUrl && <span className="text-slate-400 italic text-xs">—</span>}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded ${
                                                        sub.status === "Graded" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                    }`}>
                                                        {sub.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-bold text-slate-700">
                                                    {sub.status === "Graded" ? `${sub.marksAwarded}/${activeAssignment.totalMarks}` : "—"}
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => openGradingModal(sub)}
                                                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                                                    >
                                                        {sub.status === "Graded" ? "Re-grade" : "Grade"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Show students who have NOT submitted */}
                                        {activeAssignment.enrolledStudents
                                            ?.filter(s => !activeAssignment.submissions?.some(
                                                sub => (sub.student?.id || sub.student?._id) === s.id
                                            ))
                                            .map((student) => (
                                                <tr key={student.id} className="hover:bg-slate-50/50 opacity-60">
                                                    <td className="p-4">
                                                        <div className="font-bold text-slate-800">{student.name}</div>
                                                        <div className="text-xs text-slate-400">{student.email}</div>
                                                    </td>
                                                    <td className="p-4 text-slate-400 italic text-xs">No submission yet</td>
                                                    <td className="p-4">
                                                        <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-slate-100 text-slate-500">
                                                            Not submitted
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-slate-400">—</td>
                                                    <td className="p-4 text-slate-400 text-xs">Awaiting</td>
                                                </tr>
                                            ))}

                                        {(!activeAssignment.submissions?.length && !activeAssignment.enrolledStudents?.length) && (
                                            <tr>
                                                <td colSpan={5} className="p-12 text-center text-slate-400">
                                                    No students enrolled in this course yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Assignments listing */
                selectedCourseId && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {loadingAssignments ? (
                            <div className="p-12 text-center text-slate-400">Loading assignments...</div>
                        ) : assignments.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                <div className="text-4xl mb-2">📝</div>
                                <h4 className="font-bold">No assignments published</h4>
                                <p className="text-sm max-w-sm mx-auto mt-1 mb-4">
                                    Publish assignment guidelines and grading points to start grading tasks.
                                </p>
                                <button
                                    onClick={openCreateModal}
                                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm"
                                >
                                    Create First Assignment
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {assignments.map((assignment, idx) => (
                                    <div key={assignment._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-base">{assignment.title}</h3>
                                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{assignment.description}</p>
                                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mt-2">
                                                <span>📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                                <span>🏆 Marks: {assignment.totalMarks}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => loadAssignmentSubmissions(assignment._id)}
                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm shrink-0"
                                        >
                                            View Submissions
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            )}

            {/* Grading / Review Answer Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-bold text-slate-800 text-lg">Grade Submission</h3>
                            <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                        </div>

                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase mb-1.5">Student Answer:</div>
                            {selectedSubmission.content && (
                                <div className="bg-slate-50 border p-4 rounded-xl text-slate-700 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">
                                    {selectedSubmission.content}
                                </div>
                            )}
                            {selectedSubmission.fileUrl && (
                                <a
                                    href={selectedSubmission.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100"
                                >
                                    <FileText size={15} />
                                    {selectedSubmission.fileName || "Download submitted file"}
                                </a>
                            )}
                            {!selectedSubmission.content && !selectedSubmission.fileUrl && (
                                <p className="text-slate-400 italic text-sm">No submission content.</p>
                            )}
                        </div>

                        <form onSubmit={handleGradingSubmit} className="space-y-4 pt-2">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">
                                    Marks Awarded (Max: {activeAssignment?.totalMarks})
                                </label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    max={activeAssignment?.totalMarks || 100}
                                    value={gradingForm.marksAwarded}
                                    onChange={(e) => setGradingForm({ ...gradingForm, marksAwarded: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Feedback</label>
                                <textarea
                                    rows="4"
                                    value={gradingForm.feedback}
                                    onChange={(e) => setGradingForm({ ...gradingForm, feedback: e.target.value })}
                                    placeholder="Write a message of feedback to the student..."
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => setSelectedSubmission(null)}
                                    className="px-4 py-2 border rounded-lg hover:bg-slate-50 font-bold text-slate-600 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={gradingSubmitting}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm disabled:opacity-50"
                                >
                                    {gradingSubmitting ? "Saving..." : "Save Grade"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create/Edit Assignment Modal */}
            {showFormModal && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <h3 className="text-lg font-bold text-slate-800">
                                {editingAssignment ? "Edit Assignment Details" : "Create New Assignment"}
                            </h3>
                            <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Assignment Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Guidelines / Description</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Provide detailed instructions..."
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Due Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Total Marks</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        value={formData.totalMarks}
                                        onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
                                    className="px-5 py-2 border rounded-lg hover:bg-slate-50 font-bold text-slate-600 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : "Save Assignment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TeacherAssignmentsPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading Assignments Panel...</div>}>
            <AssignmentsContent />
        </Suspense>
    );
}
