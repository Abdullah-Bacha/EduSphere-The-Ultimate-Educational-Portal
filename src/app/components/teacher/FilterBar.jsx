"use client";

import { Filter, X } from "lucide-react";
import { useState } from "react";

export default function FilterBar({ onFilterChange, filterOptions = {} }) {
    const [open, setOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});

    const handleFilterChange = (key, value) => {
        const newFilters = { ...activeFilters, [key]: value };
        setActiveFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const handleClearAll = () => {
        setActiveFilters({});
        onFilterChange?.({});
    };

    const activeCount = Object.keys(activeFilters).filter(k => activeFilters[k]).length;

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium text-sm"
            >
                <Filter size={16} />
                Filters
                {activeCount > 0 && (
                    <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                        {activeCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
                    <div className="border-b border-slate-200 px-4 py-3 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-900">Filters</h3>
                        {activeCount > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                            <select
                                value={activeFilters.status || ""}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        {/* Completion Range */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Completion</label>
                            <select
                                value={activeFilters.completion || ""}
                                onChange={(e) => handleFilterChange("completion", e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                            >
                                <option value="">All Levels</option>
                                <option value="0-25">0-25%</option>
                                <option value="25-50">25-50%</option>
                                <option value="50-75">50-75%</option>
                                <option value="75-100">75-100%</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Sort by</label>
                            <select
                                value={activeFilters.sortBy || ""}
                                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                            >
                                <option value="">Default</option>
                                <option value="name-asc">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                                <option value="students-asc">Students (Low)</option>
                                <option value="students-desc">Students (High)</option>
                                <option value="completion-asc">Completion (Low)</option>
                                <option value="completion-desc">Completion (High)</option>
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 px-4 py-2 flex gap-2">
                        <button
                            onClick={() => setOpen(false)}
                            className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
