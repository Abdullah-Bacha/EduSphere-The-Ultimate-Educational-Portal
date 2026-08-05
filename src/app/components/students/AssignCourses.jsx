"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function AssignCourses({ student }) {
    const { showToast } = useToast();
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState(
        (student.enrolledCourses || []).map((course) =>
            typeof course === "object" ? course._id : course
        )
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
            const res = await fetch("/api/courses");
            const data = await res.json();

            if (data.success) {
                setCourses(data.result);            }
        } catch (error) {
            console.error(error);
        }
    }

    function handleCheckbox(courseId) {
        courseId = String(courseId);

        if (selectedCourses.includes(courseId)) {
            setSelectedCourses(
                selectedCourses.filter((id) => id !== courseId)
            );
        } else {
            setSelectedCourses([...selectedCourses, courseId]);
        }
    }       

    async function handleSave() {
        try {
            setLoading(true);

            const res = await fetch(
                `/api/students/${student._id}/enroll`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        courseIds: selectedCourses,
                    }),
                }
            );

            const data = await res.json();

            showToast(data.message, data.success ? "success" : "error");

        } catch (error) {
            console.error(error);
            showToast("Something went wrong.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow p-6 mt-8">

            <h2 className="text-2xl font-bold mb-4">
                Assign Courses
            </h2>

            <div className="space-y-3">

                {courses.map((course) => (

                    <label
                        key={course._id}
                        className="flex items-center gap-3"
                    >

                        <input
                            type="checkbox"
                            checked={selectedCourses.includes(String(course._id))}                            onChange={() =>
                                handleCheckbox(course._id)
                            }
                        />

                        <span>{course.title}</span>

                    </label>

                ))}

            </div>

            <button
                onClick={handleSave}
                disabled={loading}
                className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
                {loading ? "Saving..." : "Save Courses"}
            </button>

        </div>
    );
}