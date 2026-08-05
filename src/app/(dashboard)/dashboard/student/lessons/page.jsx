"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/app/components/ui/ToastProvider";
import purify from "isomorphic-dompurify";

function LessonsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast } = useToast();
    const courseId = searchParams.get("courseId");
    const activeLessonId = searchParams.get("lessonId");

    const [lessons, setLessons] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [markingComplete, setMarkingComplete] = useState(false);

    useEffect(() => {
        if (!courseId) {
            setError("No course selected.");
            setLoading(false);
            return;
        }

        async function fetchData() {
            try {
                const [lessonsRes, progressRes] = await Promise.all([
                    fetch(`/api/student/courses/${courseId}/lessons`),
                    fetch(`/api/student/progress/${courseId}`)
                ]);

                const lessonsData = await lessonsRes.json();
                const progressData = await progressRes.json();

                if (lessonsData.success && progressData.success) {
                    setLessons(lessonsData.result);
                    setProgress(progressData.result);

                    // If no active lesson, set it to the first lesson automatically
                    if (!activeLessonId && lessonsData.result.length > 0) {
                        router.replace(`/dashboard/student/lessons?courseId=${courseId}&lessonId=${lessonsData.result[0]._id}`);
                    }
                } else {
                    setError("Failed to load lessons or you do not have access.");
                }
            } catch (err) {
                setError("An error occurred while fetching lessons.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [courseId, activeLessonId, router]);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] animate-pulse">
                <div className="w-1/3 bg-slate-200 border-r"></div>
                <div className="w-2/3 p-8">
                    <div className="h-64 bg-slate-200 rounded-xl mb-8"></div>
                    <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block mb-4">
                    {error}
                </div>
                <div>
                    <Link href="/dashboard/student/my-courses" className="text-blue-600 hover:underline">
                        &larr; Back to My Courses
                    </Link>
                </div>
            </div>
        );
    }

    if (lessons.length === 0) {
        return (
            <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-slate-100 m-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">No Lessons Found</h2>
                <p className="text-slate-500 mb-6">The instructor has not published any lessons for this course yet.</p>
                <Link href="/dashboard/student/my-courses" className="text-blue-600 hover:underline">
                    &larr; Back to My Courses
                </Link>
            </div>
        );
    }

    const currentLessonIndex = lessons.findIndex((l) => l._id === activeLessonId) || 0;
    const currentLesson = lessons[currentLessonIndex] || lessons[0];
    const isCompleted = progress?.completedLessons?.includes(currentLesson._id);

    const handleMarkComplete = async () => {
        setMarkingComplete(true);
        try {
            const res = await fetch(`/api/student/progress/${courseId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId: currentLesson._id })
            });
            const data = await res.json();
            
            if (data.success) {
                setProgress(prev => ({ ...prev, completedLessons: data.result }));
                showToast("Lesson marked as complete!", "success");

                // Go to next lesson automatically if there is one
                if (currentLessonIndex < lessons.length - 1) {
                    router.push(`/dashboard/student/lessons?courseId=${courseId}&lessonId=${lessons[currentLessonIndex + 1]._id}`);
                }
            } else {
                showToast(data.message, "error");
            }
        } finally {
            setMarkingComplete(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-100px)] bg-white border rounded-xl overflow-hidden shadow-sm m-4">
            {/* Sidebar Curriculum */}
            <div className="w-full md:w-1/3 lg:w-1/4 bg-slate-50 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-white">
                    <Link href={`/dashboard/student/my-courses/${courseId}`} className="text-sm text-slate-500 hover:text-blue-600 mb-2 inline-block">
                        &larr; Back to Course
                    </Link>
                    <h2 className="font-bold text-lg text-slate-800">Course Content</h2>
                    <div className="mt-2 text-xs font-semibold text-slate-500">
                        {progress?.completedLessons?.length || 0} / {lessons.length} Completed
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                        <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all" 
                            style={{ width: `${((progress?.completedLessons?.length || 0) / lessons.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="flex-grow overflow-y-auto">
                    {lessons.map((lesson, idx) => {
                        const active = lesson._id === currentLesson._id;
                        const completed = progress?.completedLessons?.includes(lesson._id);
                        
                        return (
                            <Link 
                                key={lesson._id}
                                href={`/dashboard/student/lessons?courseId=${courseId}&lessonId=${lesson._id}`}
                                className={`flex items-start p-4 border-b border-slate-100 hover:bg-blue-50 transition-colors ${active ? "bg-blue-50 border-l-4 border-l-blue-600" : "border-l-4 border-l-transparent"}`}
                            >
                                <div className={`mt-0.5 mr-3 flex-shrink-0 ${completed ? "text-green-500" : "text-slate-300"}`}>
                                    {completed ? "✅" : "⭕"}
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-semibold mb-1">Lesson {idx + 1}</div>
                                    <div className={`text-sm ${active ? "font-bold text-blue-800" : "font-medium text-slate-700"}`}>
                                        {lesson.title}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                        ⏱️ {lesson.duration || "10 mins"}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col h-full overflow-y-auto">
                <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
                    
                    {currentLesson.videoUrl && (
                        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 shadow-md">
                            {/* Assuming YouTube/Vimeo embeds or HTML5 video depending on URL format. For simplicity using iframe. */}
                            <iframe 
                                src={currentLesson.videoUrl} 
                                className="w-full h-full"
                                allowFullScreen
                                title={currentLesson.title}
                            ></iframe>
                        </div>
                    )}

                    <h1 className="text-3xl font-bold text-slate-800 mb-4">{currentLesson.title}</h1>
                    
                    {currentLesson.description && (
                        <p className="text-lg text-slate-600 mb-8">{currentLesson.description}</p>
                    )}

                    {currentLesson.content && (
                        <div className="prose max-w-none text-slate-700 mb-12">
                            <div dangerouslySetInnerHTML={{ __html: purify.sanitize(currentLesson.content) }}></div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-6 mt-8 gap-4">
                        <button
                            onClick={handleMarkComplete}
                            disabled={markingComplete || isCompleted}
                            className={`px-6 py-3 rounded-xl font-bold w-full sm:w-auto transition-colors ${
                                isCompleted 
                                    ? "bg-green-100 text-green-700 cursor-not-allowed" 
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                            {markingComplete ? "Updating..." : isCompleted ? "✓ Completed" : "Mark as Complete"}
                        </button>

                        <div className="flex gap-3 w-full sm:w-auto">
                            {currentLessonIndex > 0 && (
                                <Link
                                    href={`/dashboard/student/lessons?courseId=${courseId}&lessonId=${lessons[currentLessonIndex - 1]._id}`}
                                    className="px-5 py-3 border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 w-full text-center"
                                >
                                    Previous
                                </Link>
                            )}
                            
                            {currentLessonIndex < lessons.length - 1 && (
                                <Link
                                    href={`/dashboard/student/lessons?courseId=${courseId}&lessonId=${lessons[currentLessonIndex + 1]._id}`}
                                    className="px-5 py-3 border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 w-full text-center"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function LessonsPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading Lesson Player...</div>}>
            <LessonsContent />
        </Suspense>
    );
}
