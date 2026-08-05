"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [myReview, setMyReview] = useState(undefined);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewContent, setReviewContent] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    useEffect(() => {
        async function fetchCourse() {
            try {
                const [courseRes, lessonsRes, progressRes, assignmentsRes, quizzesRes] = await Promise.all([
                    fetch(`/api/student/my-courses/${params.id}`),
                    fetch(`/api/student/courses/${params.id}/lessons`),
                    fetch(`/api/student/progress/${params.id}`),
                    fetch(`/api/student/assignments`),
                    fetch(`/api/student/quizzes`),
                ]);

                const [courseData, lessonsData, progressData, assignmentsData, quizzesData] = await Promise.all([
                    courseRes.json(), lessonsRes.json(), progressRes.json(), assignmentsRes.json(), quizzesRes.json(),
                ]);

                if (courseData.success) {
                    setCourse(courseData.result);
                } else {
                    setError(courseData.message || "Failed to load course details");
                }

                if (lessonsData.success) setLessons(lessonsData.result);
                if (progressData.success) setProgress(progressData.result);
                if (assignmentsData.success) {
                    setAssignments(
                        assignmentsData.result.filter((a) => a.course === params.id)
                    );
                }
                if (quizzesData.success) {
                    setQuizzes(quizzesData.result.filter((q) => q.course === params.id));
                }
            } catch (err) {
                setError("An error occurred while fetching course details.");
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            fetchCourse();
            // Load student's existing review for this course
            fetch(`/api/student/courses/${params.id}/review`, { cache: "no-store" })
                .then(r => r.json())
                .then(d => { if (d.success) setMyReview(d.result); })
                .catch(() => setMyReview(null));
        }
    }, [params.id]);

    async function handleReviewSubmit(e) {
        e.preventDefault();
        if (!reviewContent.trim()) return;
        setReviewSubmitting(true);
        try {
            const res = await fetch(`/api/student/courses/${params.id}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: reviewContent.trim(), rating: reviewRating }),
            });
            const data = await res.json();
            if (data.success) {
                setMyReview(data.result);
                setReviewContent("");
            }
        } catch {}
        setReviewSubmitting(false);
    }

    if (loading) {
        return (
            <div className="p-6 animate-pulse">
                <div className="h-64 bg-slate-200 rounded-xl mb-8"></div>
                <div className="h-10 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                    {error}
                </div>
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:underline"
                >
                    &larr; Back to My Courses
                </button>
            </div>
        );
    }

    if (!course) return null;

    const completedCount = progress?.completedLessons?.length || 0;
    const totalLessons = lessons.length;
    const progressPercent = totalLessons > 0
        ? Math.round((completedCount / totalLessons) * 100)
        : (progress?.completionPercentage || 0);
    const firstLessonId = lessons[0]?._id;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square relative rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {course.thumbnail ? (
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-slate-400">
                            No Image
                        </div>
                    )}
                </div>

                <div className="flex-grow flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                            {course.category}
                        </span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                            {course.level}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-800 mb-4 leading-tight">
                        {course.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">👤</span>
                            <span className="font-medium text-slate-800">{course.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">⏱️</span>
                            <span>{course.duration}</span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="mb-2 flex justify-between text-sm font-medium">
                            <span>Course Progress</span>
                            <span>{progressPercent}% &middot; {completedCount}/{totalLessons} lessons</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                        </div>

                        <Link
                            href={`/dashboard/student/lessons?courseId=${course._id}${firstLessonId ? `&lessonId=${firstLessonId}` : ""}`}
                            className="inline-block w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl text-center hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            {completedCount > 0 ? "Continue Learning" : "Start Learning"}
                        </Link>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">About this Course</h2>
                <div className="prose max-w-none text-slate-600">
                    <p className="whitespace-pre-wrap">{course.description}</p>
                </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Course Curriculum</h2>
                    <span className="text-sm text-slate-500">{totalLessons} lesson{totalLessons === 1 ? "" : "s"}</span>
                </div>

                {totalLessons === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
                        The instructor hasn&apos;t published any lessons for this course yet.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                        {lessons.map((lesson, idx) => {
                            const isCompleted = progress?.completedLessons?.includes(lesson._id);
                            // A lesson unlocks once all previous lessons are completed
                            const isUnlocked = idx === 0 || progress?.completedLessons?.includes(lessons[idx - 1]._id);

                            const content = (
                                <div
                                    className={`flex items-center justify-between p-4 transition-colors ${
                                        isUnlocked ? "hover:bg-slate-50" : "opacity-60 cursor-not-allowed"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={isCompleted ? "text-green-500" : "text-slate-300"}>
                                            {isCompleted ? "✅" : isUnlocked ? "⭕" : "🔒"}
                                        </span>
                                        <div>
                                            <div className="text-xs text-slate-500 font-semibold">Lesson {idx + 1}</div>
                                            <div className="text-sm font-medium text-slate-800">{lesson.title}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">{lesson.duration || "10 mins"}</span>
                                </div>
                            );

                            return isUnlocked ? (
                                <Link
                                    key={lesson._id}
                                    href={`/dashboard/student/lessons?courseId=${course._id}&lessonId=${lesson._id}`}
                                >
                                    {content}
                                </Link>
                            ) : (
                                <div key={lesson._id}>{content}</div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Assignments */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Assignments</h2>
                    <span className="text-sm text-slate-500">
                        {assignments.length} assignment{assignments.length === 1 ? "" : "s"}
                    </span>
                </div>

                {assignments.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
                        No assignments have been posted for this course yet.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                        {assignments.map((assignment) => (
                            <Link
                                key={assignment._id}
                                href="/dashboard/student/assignments"
                                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div>
                                    <div className="text-sm font-medium text-slate-800">{assignment.title}</div>
                                    <div className="text-xs text-slate-500">
                                        Due {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "N/A"}
                                    </div>
                                </div>
                                <span
                                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                        assignment.submission?.status === "Graded"
                                            ? "bg-green-50 text-green-700"
                                            : assignment.submission
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {assignment.submission?.status === "Graded"
                                        ? `Graded: ${assignment.submission.marksAwarded}/${assignment.totalMarks}`
                                        : assignment.submission
                                        ? "Submitted"
                                        : "Not submitted"}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Quizzes */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Quizzes</h2>
                    <span className="text-sm text-slate-500">
                        {quizzes.length} quiz{quizzes.length === 1 ? "" : "zes"}
                    </span>
                </div>

                {quizzes.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
                        No quizzes have been posted for this course yet.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                        {quizzes.map((quiz) => (
                            <Link
                                key={quiz._id}
                                href="/dashboard/student/quizzes"
                                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div>
                                    <div className="text-sm font-medium text-slate-800">{quiz.title}</div>
                                    <div className="text-xs text-slate-500">{quiz.timeLimit} min time limit</div>
                                </div>
                                <span
                                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                        quiz.attempt
                                            ? "bg-green-50 text-green-700"
                                            : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {quiz.attempt
                                        ? `Scored ${quiz.attempt.score}/${quiz.attempt.totalQuestions}`
                                        : "Not attempted"}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            {/* Course Review */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Star size={20} className="text-amber-400" />
                    Rate This Course
                </h2>

                {myReview === undefined ? (
                    <div className="animate-pulse h-20 bg-slate-100 rounded-xl" />
                ) : myReview ? (
                    <div className="space-y-3">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${myReview.isActive ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {myReview.isActive ? "✓ Published" : "⏳ Pending review"}
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={18} fill={i < myReview.rating ? "currentColor" : "none"} />
                            ))}
                        </div>
                        <p className="text-slate-700 text-sm">{myReview.content}</p>
                        <p className="text-xs text-slate-400">You can update your review by submitting again.</p>
                        {/* Allow re-submission */}
                        <form onSubmit={handleReviewSubmit} className="pt-3 border-t border-slate-100 space-y-3">
                            <div className="flex items-center gap-1 text-amber-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <button key={i} type="button" onClick={() => setReviewRating(i + 1)}>
                                        <Star size={22} fill={i < reviewRating ? "currentColor" : "none"} />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                rows={3}
                                maxLength={500}
                                value={reviewContent}
                                onChange={e => setReviewContent(e.target.value)}
                                placeholder="Update your review..."
                                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button type="submit" disabled={reviewSubmitting || !reviewContent.trim()} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm disabled:opacity-50">
                                {reviewSubmitting ? "Updating..." : "Update Review"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-700 mb-2">Your Rating</p>
                            <div className="flex items-center gap-1 text-amber-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <button key={i} type="button" onClick={() => setReviewRating(i + 1)}>
                                        <Star size={26} fill={i < reviewRating ? "currentColor" : "none"} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700 mb-2">Your Review</p>
                            <textarea
                                required
                                rows={4}
                                maxLength={500}
                                value={reviewContent}
                                onChange={e => setReviewContent(e.target.value)}
                                placeholder="What did you think about this course?"
                                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <p className="text-xs text-slate-400 text-right">{reviewContent.length}/500</p>
                        </div>
                        <button type="submit" disabled={reviewSubmitting || !reviewContent.trim()} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm disabled:opacity-50">
                            {reviewSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
