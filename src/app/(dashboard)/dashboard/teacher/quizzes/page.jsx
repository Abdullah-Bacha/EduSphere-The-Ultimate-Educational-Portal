"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/app/components/ui/ToastProvider";
import { useConfirm } from "@/app/components/ui/ConfirmProvider";

function QuizzesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const courseIdParam = searchParams.get("courseId");

    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingQuizzes, setLoadingQuizzes] = useState(false);

    // Selected quiz detail / student attempts view
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Create/Edit Quiz Modal State
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        timeLimit: 15,
        questions: [],
    });
    
    // Question Editor State (inside modal)
    const [newQuestion, setNewQuestion] = useState({
        questionText: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
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

    // Fetch quizzes for the selected course
    async function loadQuizzes(cid) {
        if (!cid) return;
        setLoadingQuizzes(true);
        try {
            const res = await fetch(`/api/teacher/quizzes?courseId=${cid}`);
            const data = await res.json();
            if (data.success) {
                setQuizzes(data.result);
            } else {
                setQuizzes([]);
            }
        } catch (err) {
            console.error("Failed to load quizzes", err);
            setQuizzes([]);
        } finally {
            setLoadingQuizzes(false);
        }
    }

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            loadQuizzes(selectedCourseId);
            setActiveQuiz(null); // Clear selected quiz details on course switch
        }
    }, [selectedCourseId]);

    const handleCourseChange = (e) => {
        const cid = e.target.value;
        setSelectedCourseId(cid);
        router.replace(`/dashboard/teacher/quizzes?courseId=${cid}`);
    };

    // Load active quiz details & student attempts
    async function loadQuizAttempts(qid) {
        setLoadingDetails(true);
        try {
            const res = await fetch(`/api/teacher/quizzes/${qid}`);
            const data = await res.json();
            if (data.success) {
                setActiveQuiz(data.result);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    }

    const openCreateModal = () => {
        setEditingQuiz(null);
        setFormData({
            title: "",
            description: "",
            timeLimit: 15,
            questions: [],
        });
        setNewQuestion({
            questionText: "",
            options: ["", "", "", ""],
            correctOptionIndex: 0,
        });
        setShowFormModal(true);
    };

    const openEditModal = (quiz) => {
        setEditingQuiz(quiz);
        setFormData({
            title: quiz.title || "",
            description: quiz.description || "",
            timeLimit: quiz.timeLimit || 15,
            questions: quiz.questions || [],
        });
        setShowFormModal(true);
    };

    const handleTogglePublish = async (quiz) => {
        try {
            const res = await fetch(`/api/teacher/quizzes/${quiz._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !quiz.isPublished }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(!quiz.isPublished ? "Quiz published" : "Quiz unpublished", "success");
                loadQuizzes(selectedCourseId);
            } else {
                showToast(data.message, "error");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleExportResults = () => {
        if (!activeQuiz?.attempts?.length) return;
        const rows = [
            ["Student", "Email", "Score", "Total Questions", "Percentage", "Attempted At"],
            ...activeQuiz.attempts.map((a) => {
                const pct = Math.round((a.score / a.totalQuestions) * 100);
                return [
                    a.student?.name || "",
                    a.student?.email || "",
                    a.score,
                    a.totalQuestions,
                    `${pct}%`,
                    new Date(a.createdAt).toLocaleString(),
                ];
            }),
        ];
        const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeQuiz.title.replace(/\s+/g, "-")}-results.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDelete = async (id) => {
        const ok = await confirm("Are you sure you want to delete this quiz?", { title: "Delete quiz" });
        if (!ok) return;
        try {
            const res = await fetch(`/api/teacher/quizzes/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                showToast("Quiz deleted successfully.", "success");
                loadQuizzes(selectedCourseId);
                setActiveQuiz(null);
            } else {
                showToast(data.message, "error");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddQuestion = () => {
        if (!newQuestion.questionText.trim() || newQuestion.options.some(opt => !opt.trim())) {
            showToast("Please fill out the question text and all options before adding.", "error");
            return;
        }

        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, newQuestion]
        }));

        setNewQuestion({
            questionText: "",
            options: ["", "", "", ""],
            correctOptionIndex: 0,
        });
    };

    const handleRemoveQuestion = (idx) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== idx)
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (formData.questions.length === 0) {
            showToast("Please add at least one question to the quiz.", "error");
            return;
        }

        setSubmitting(true);
        try {
            const url = editingQuiz ? `/api/teacher/quizzes/${editingQuiz._id}` : "/api/teacher/quizzes";
            const method = editingQuiz ? "PUT" : "POST";
            
            const payload = editingQuiz 
                ? formData 
                : { ...formData, courseId: selectedCourseId };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                showToast(editingQuiz ? "Quiz updated successfully." : "Quiz created successfully.", "success");
                setShowFormModal(false);
                loadQuizzes(selectedCourseId);
            } else {
                showToast(data.message, "error");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
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
                    <h1 className="text-3xl font-black text-slate-800">Quizzes Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Design course quizzes, add MCQ choices, and view student test results.</p>
                </div>
                {selectedCourseId && !activeQuiz && (
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm text-center shrink-0"
                    >
                        + Add Quiz
                    </button>
                )}
            </div>

            {/* Selector dropdown */}
            {!activeQuiz && (
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

            {activeQuiz ? (
                /* Quiz Details & Student Attempts View */
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <button
                            onClick={() => setActiveQuiz(null)}
                            className="text-slate-500 hover:text-blue-600 font-semibold mb-2 inline-block text-sm"
                        >
                            &larr; Back to Course Quizzes
                        </button>
                        
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{activeQuiz.title}</h2>
                                <p className="text-slate-500 text-sm mt-1 whitespace-pre-wrap">{activeQuiz.description}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => handleTogglePublish(activeQuiz)}
                                    className={`px-4 py-2 font-bold rounded-lg text-xs ${
                                        activeQuiz.isPublished
                                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                            : "bg-green-50 hover:bg-green-100 text-green-700"
                                    }`}
                                >
                                    {activeQuiz.isPublished ? "Unpublish" : "Publish"}
                                </button>
                                <button
                                    onClick={() => openEditModal(activeQuiz)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                                >
                                    Edit Details / Questions
                                </button>
                                <button
                                    onClick={() => handleDelete(activeQuiz._id)}
                                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-650 font-bold rounded-lg text-xs"
                                >
                                    Delete Quiz
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-bold uppercase pt-4 border-t">
                            <span>⏱️ Timer: {activeQuiz.timeLimit} Minutes</span>
                            <span>❓ Questions: {activeQuiz.questions?.length || 0} MCQs</span>
                            <span className={activeQuiz.isPublished ? "text-green-600" : "text-slate-400"}>
                                {activeQuiz.isPublished ? "● Published" : "● Draft"}
                            </span>
                        </div>
                    </div>

                    {/* Quiz Analytics */}
                    {activeQuiz.attempts?.length > 0 && (() => {
                        const attempts = activeQuiz.attempts;
                        const pcts = attempts.map((a) => Math.round((a.score / a.totalQuestions) * 100));
                        const avgPct = Math.round(pcts.reduce((s, p) => s + p, 0) / pcts.length);
                        const highPct = Math.max(...pcts);
                        const lowPct = Math.min(...pcts);
                        const passCount = pcts.filter((p) => p >= 50).length;
                        const passRate = Math.round((passCount / pcts.length) * 100);
                        return (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                                    <p className="text-xs text-slate-500">Attempts</p>
                                    <p className="text-2xl font-bold text-slate-900">{attempts.length}</p>
                                </div>
                                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                                    <p className="text-xs text-slate-500">Average Score</p>
                                    <p className="text-2xl font-bold text-indigo-600">{avgPct}%</p>
                                </div>
                                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                                    <p className="text-xs text-slate-500">Pass Rate</p>
                                    <p className="text-2xl font-bold text-green-600">{passRate}%</p>
                                </div>
                                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                                    <p className="text-xs text-slate-500">High / Low</p>
                                    <p className="text-2xl font-bold text-slate-900">{highPct}% / {lowPct}%</p>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Quiz attempts table */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 text-lg">Student Attempts</h3>
                            {activeQuiz.attempts?.length > 0 && (
                                <button
                                    onClick={handleExportResults}
                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Export CSV
                                </button>
                            )}
                        </div>

                        {loadingDetails ? (
                            <div className="p-12 text-center text-slate-400">Loading attempts...</div>
                        ) : activeQuiz.attempts?.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">No students have attempted this quiz yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-450 uppercase tracking-wider">
                                            <th className="p-4">Student</th>
                                            <th className="p-4">Attempt Date</th>
                                            <th className="p-4">Grade Score</th>
                                            <th className="p-4">Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                                        {activeQuiz.attempts.map((attempt) => {
                                            const pct = Math.round((attempt.score / attempt.totalQuestions) * 100);
                                            const pass = pct >= 50;

                                            return (
                                                <tr key={attempt._id} className="hover:bg-slate-50/50">
                                                    <td className="p-4">
                                                        <div className="font-bold text-slate-800">{attempt.student?.name}</div>
                                                        <div className="text-xs text-slate-400">{attempt.student?.email}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        {new Date(attempt.createdAt).toLocaleString()}
                                                    </td>
                                                    <td className="p-4 font-bold text-slate-700">
                                                        {attempt.score} / {attempt.totalQuestions}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded ${
                                                            pass ? "bg-green-100 text-green-700" : "bg-red-105 bg-red-50 text-red-650"
                                                        }`}>
                                                            {pct}% {pass ? "(Pass)" : "(Fail)"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Quizzes listing */
                selectedCourseId && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {loadingQuizzes ? (
                            <div className="p-12 text-center text-slate-400">Loading quizzes...</div>
                        ) : quizzes.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                <div className="text-4xl mb-2">🧪</div>
                                <h4 className="font-bold">No quizzes published</h4>
                                <p className="text-sm max-w-sm mx-auto mt-1 mb-4">
                                    Publish quizzes featuring multiple choice options to start checking student knowledge.
                                </p>
                                <button
                                    onClick={openCreateModal}
                                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm"
                                >
                                    Create First Quiz
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {quizzes.map((quiz) => (
                                    <div key={quiz._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-800 text-base">{quiz.title}</h3>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                                                    quiz.isPublished ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                                                }`}>
                                                    {quiz.isPublished ? "PUBLISHED" : "DRAFT"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{quiz.description}</p>
                                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-lg w-fit">
                                                <span>⏱️ {quiz.timeLimit} Mins</span>
                                                <span>❓ {quiz.questions?.length || 0} Questions</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                onClick={() => handleTogglePublish(quiz)}
                                                className={`px-4 py-2 font-bold rounded-lg text-sm ${
                                                    quiz.isPublished
                                                        ? "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                        : "bg-green-50 hover:bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {quiz.isPublished ? "Unpublish" : "Publish"}
                                            </button>
                                            <button
                                                onClick={() => loadQuizAttempts(quiz._id)}
                                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm"
                                            >
                                                View Results
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            )}

            {/* Create/Edit Quiz Modal */}
            {showFormModal && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <h3 className="text-lg font-bold text-slate-800">
                                {editingQuiz ? "Edit Quiz Details / Questions" : "Create New Quiz"}
                            </h3>
                            <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Quiz Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Time Limit (Minutes)</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        value={formData.timeLimit}
                                        onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Added Questions List */}
                            <div className="pt-4 border-t">
                                <h4 className="font-bold text-slate-800 mb-2">Quiz Questions ({formData.questions.length})</h4>
                                {formData.questions.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">No questions added yet. Construct below.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {formData.questions.map((q, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-slate-50 border p-3 rounded-lg text-sm text-slate-700">
                                                <div>
                                                    <span className="font-bold">Q{idx + 1}:</span> {q.questionText}
                                                    <div className="text-xs text-slate-400 mt-1">
                                                        Correct option: {String.fromCharCode(65 + q.correctOptionIndex)}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveQuestion(idx)}
                                                    className="text-red-500 hover:text-red-700 font-semibold text-xs"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Question Builder Section */}
                            <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed space-y-3">
                                <h5 className="font-bold text-slate-750 text-sm">Question Builder</h5>
                                
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Question Text</label>
                                    <input
                                        type="text"
                                        value={newQuestion.questionText}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {newQuestion.options.map((opt, i) => (
                                        <div key={i}>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Option {String.fromCharCode(65 + i)}</label>
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => {
                                                    const updatedOptions = [...newQuestion.options];
                                                    updatedOptions[i] = e.target.value;
                                                    setNewQuestion({ ...newQuestion, options: updatedOptions });
                                                }}
                                                className="w-full border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Correct Option</label>
                                    <select
                                        value={newQuestion.correctOptionIndex}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, correctOptionIndex: Number(e.target.value) })}
                                        className="border rounded-lg px-3 py-1.5 bg-white focus:outline-none text-xs font-semibold text-slate-700"
                                    >
                                        {newQuestion.options.map((_, i) => (
                                            <option key={i} value={i}>
                                                Option {String.fromCharCode(65 + i)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddQuestion}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs"
                                >
                                    Add Question to List
                                </button>
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
                                    {submitting ? "Saving Quiz..." : "Save Quiz"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TeacherQuizzesPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading Quizzes Panel...</div>}>
            <QuizzesContent />
        </Suspense>
    );
}
