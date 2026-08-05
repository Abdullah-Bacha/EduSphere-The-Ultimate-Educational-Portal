"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function QuizzesPage() {
    const { showToast } = useToast();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeQuiz, setActiveQuiz] = useState(null);
    
    // Quiz taking state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]); // [{questionIndex: 0, selectedOptionIndex: 2}]
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                const res = await fetch("/api/student/quizzes");
                const data = await res.json();
                if (data.success) {
                    setQuizzes(data.result);
                } else {
                    setError(data.message || "Failed to load quizzes");
                }
            } catch (err) {
                setError("An error occurred while fetching quizzes.");
            } finally {
                setLoading(false);
            }
        }
        fetchQuizzes();
    }, []);

    // Timer effect
    useEffect(() => {
        if (!activeQuiz || activeQuiz.attempt || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitQuiz(); // Auto submit when time runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [activeQuiz, timeLeft]);

    const startQuiz = (quiz) => {
        setActiveQuiz(quiz);
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setTimeLeft(quiz.timeLimit * 60); // minutes to seconds
    };

    const handleSelectOption = (optionIndex) => {
        setSelectedAnswers((prev) => {
            const filtered = prev.filter(a => a.questionIndex !== currentQuestionIndex);
            return [...filtered, { questionIndex: currentQuestionIndex, selectedOptionIndex: optionIndex }];
        });
    };

    const handleSubmitQuiz = async () => {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/student/quizzes/${activeQuiz._id}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers: selectedAnswers })
            });
            const data = await res.json();
            
            if (data.success) {
                // Update local list to show the attempt
                setQuizzes(prev => prev.map(q => 
                    q._id === activeQuiz._id ? { ...q, attempt: data.result } : q
                ));
                // Update active quiz so it shows the results view
                setActiveQuiz(prev => ({ ...prev, attempt: data.result }));
                showToast("Quiz submitted successfully!", "success");
            } else {
                showToast(data.message, "error");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (loading) {
        return (
            <div className="p-6 animate-pulse">
                <div className="h-10 bg-slate-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-40 bg-slate-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }

    if (activeQuiz) {
        const isCompleted = !!activeQuiz.attempt;

        if (isCompleted) {
            // Results View
            const attempt = activeQuiz.attempt;
            const pass = (attempt.score / attempt.totalQuestions) >= 0.5;

            return (
                <div className="p-6 max-w-3xl mx-auto text-center">
                    <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100">
                        <div className="text-6xl mb-6">{pass ? "🎉" : "💪"}</div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h1>
                        <p className="text-slate-500 mb-8">{activeQuiz.title}</p>
                        
                        <div className="inline-block bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-8">
                            <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Your Score</div>
                            <div className={`text-6xl font-black ${pass ? "text-green-500" : "text-amber-500"}`}>
                                {attempt.score} <span className="text-3xl text-slate-300">/ {attempt.totalQuestions}</span>
                            </div>
                        </div>

                        <div>
                            <button 
                                onClick={() => setActiveQuiz(null)}
                                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                Back to Quizzes
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // Active Quiz View
        const currentQuestion = activeQuiz.questions[currentQuestionIndex];
        const selectedOption = selectedAnswers.find(a => a.questionIndex === currentQuestionIndex)?.selectedOptionIndex;
        const isLastQuestion = currentQuestionIndex === activeQuiz.questions.length - 1;

        return (
            <div className="p-6 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">{activeQuiz.title}</h1>
                    <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-mono font-bold">
                        ⏱️ {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50 p-6 border-b border-slate-100">
                        <div className="text-sm text-slate-500 font-bold mb-2">
                            Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                        </div>
                        <h2 className="text-xl font-medium text-slate-800">
                            {currentQuestion.questionText}
                        </h2>
                    </div>
                    
                    <div className="p-6 space-y-3">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelectOption(idx)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                    selectedOption === idx 
                                        ? "border-blue-600 bg-blue-50 text-blue-800" 
                                        : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700"
                                }`}
                            >
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border mr-3 font-bold text-sm">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between">
                        <button
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-white disabled:opacity-50"
                        >
                            Previous
                        </button>
                        
                        {!isLastQuestion ? (
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                disabled={submitting}
                                onClick={handleSubmitQuiz}
                                className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Submit Quiz"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">My Quizzes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.length === 0 ? (
                    <div className="col-span-full p-12 text-center bg-white rounded-xl shadow-sm border border-slate-100">
                        <div className="text-4xl mb-4">🧪</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No quizzes available</h3>
                        <p className="text-slate-500">You don't have any pending quizzes at the moment.</p>
                    </div>
                ) : (
                    quizzes.map((quiz) => {
                        const isCompleted = !!quiz.attempt;

                        return (
                            <div key={quiz._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-800 line-clamp-2">{quiz.title}</h3>
                                    {isCompleted ? (
                                        <span className="shrink-0 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">Completed</span>
                                    ) : (
                                        <span className="shrink-0 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">Pending</span>
                                    )}
                                </div>
                                
                                <p className="text-sm text-slate-500 mb-6 flex-grow">{quiz.description}</p>
                                
                                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-6 bg-slate-50 p-3 rounded-lg">
                                    <span>❓ {quiz.questions?.length || 0} Questions</span>
                                    <span>⏱️ {quiz.timeLimit} Mins</span>
                                </div>

                                {isCompleted ? (
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                        <div className="text-sm font-medium text-slate-500">Your Score</div>
                                        <div className="text-lg font-black text-slate-800">
                                            {quiz.attempt.score} / {quiz.attempt.totalQuestions}
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => startQuiz(quiz)}
                                        className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        Start Quiz
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
