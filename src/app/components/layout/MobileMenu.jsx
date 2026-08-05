import Link from "next/link";
import { publicNavigation } from "@/app/constants/navigation";

export default function MobileMenu() {
    return (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-t shadow-lg">

            <nav className="flex flex-col p-4">

                {publicNavigation.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-center gap-3 py-3 border-b hover:text-blue-600 transition"
                        >
                            <Icon size={18} />
                            {item.title}
                        </Link>
                    );
                })}

                <Link
                    href="/login"
                    className="mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-3 hover:bg-gray-100 transition"
                >
                    Login
                </Link>

                <Link
                    href="/register"
                    className="mt-2 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 transition"
                >
                    Register
                </Link>

            </nav>

        </div>
    );
}