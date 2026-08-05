function formatCount(n) {
    if (n >= 1000) return `${Math.floor(n / 1000)}K+`;
    return `${n}+`;
}

export default function HeroStats({ students = 0, courses = 0, teachers = 0 }) {

    const stats = [
        {
            value: formatCount(students),
            label: "Students",
        },
        {
            value: formatCount(courses),
            label: "Courses",
        },
        {
            value: formatCount(teachers),
            label: "Teachers",
        },
    ];

    return (
        <div className="mt-12 grid grid-cols-3 gap-6">

            {stats.map((item) => (
                <div key={item.label}>

                    <h3 className="text-3xl font-bold text-slate-900">
                        {item.value}
                    </h3>

                    <p className="text-slate-500 mt-1">
                        {item.label}
                    </p>

                </div>
            ))}

        </div>
    );
}