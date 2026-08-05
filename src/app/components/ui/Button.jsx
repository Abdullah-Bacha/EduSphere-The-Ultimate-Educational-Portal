export default function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}) {

    const variants = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-700",

        secondary:
            "bg-slate-800 text-white hover:bg-slate-900",

        outline:
            "border border-slate-300 text-slate-700 hover:bg-slate-100",
    };

    return (
        <button
            className={`
                px-6
                py-3
                rounded-xl
                font-semibold
                transition-all
                duration-300
                ${variants[variant]}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
}