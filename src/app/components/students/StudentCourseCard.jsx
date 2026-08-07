import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

export default function StudentCourseCard({ course }) {
    const progress = course.progress || 0;
    const rating = course.averageRating || 0;
    const reviewCount = course.reviewCount || 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
            {/* Thumbnail */}
            <div className="relative w-full h-48 bg-slate-100">
                {course.thumbnail ? (
                    <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-400">
                        No Image
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-white px-2 py-1 text-xs font-semibold rounded text-blue-600 shadow">
                    {course.category}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                {/* Title & Rating */}
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-lg line-clamp-2 leading-tight flex-1">
                        {course.title}
                    </h3>
                </div>

                {/* Rating Display */}
                {reviewCount > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-slate-500 ml-1">
                            {rating.toFixed(1)} ({reviewCount})
                        </span>
                    </div>
                )}

                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {course.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-slate-600">Progress</span>
                        <span className="text-xs font-semibold text-blue-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-blue-600 h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                            👤 {course.instructor}
                        </span>
                        <span className="flex items-center gap-1">
                            ⏱️ {course.duration}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                            {course.level}
                        </span>
                    </div>

                    <Link
                        href={`/dashboard/student/my-courses/${course._id}`}
                        className="block w-full py-2.5 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Continue Learning
                    </Link>
                </div>
            </div>
        </div>
    );
}
