import Badge from "@/app/components/ui/Badge";

export default function RecentCourses({ courses }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-[-0.01em] text-slate-900">Recent Courses</h2>
                    <p className="mt-1 text-sm text-slate-500">Latest content published across the platform.</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="ds-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Instructor</th>
                            <th>Category</th>
                            <th>Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course._id}>
                                <td className="font-medium text-slate-800">{course.title}</td>
                                <td className="text-slate-600">{course.instructor}</td>
                                <td><Badge tone="indigo">{course.category}</Badge></td>
                                <td className="text-slate-600">{course.level}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}