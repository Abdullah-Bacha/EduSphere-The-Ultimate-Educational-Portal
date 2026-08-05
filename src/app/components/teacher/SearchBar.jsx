"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "Search courses, assignments..." }) {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch?.(value);
    };

    const handleClear = () => {
        setQuery("");
        onSearch?.("");
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-10 text-sm placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
                {query && (
                    <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
