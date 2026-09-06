
"use client";

import React from "react";
import { LayoutDashboard, Calculator, LineChart, PieChart } from "lucide-react";

export type ViewMode = 'calculator' | 'comparison' | 'portfolio';

interface DashboardNavProps {
    activeView: ViewMode;
    onViewChange: (view: ViewMode) => void;
    portfolioCount: number;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({ activeView, onViewChange, portfolioCount }) => {
    const tabs = [
        { id: 'calculator', label: 'Calculator', icon: Calculator, disabled: false },
        { id: 'comparison', label: 'Compare Assets', icon: LineChart, disabled: portfolioCount < 1 },
        { id: 'portfolio', label: 'Net Worth Dashboard', icon: LayoutDashboard, disabled: portfolioCount < 1 },
    ] as const;

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-8">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeView === tab.id;
                const isDisabled = tab.disabled;

                return (
                    <button
                        key={tab.id}
                        onClick={() => !isDisabled && onViewChange(tab.id)}
                        disabled={isDisabled}
                        className={`
                            flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200
                            ${isActive
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl scale-[1.02]'
                                : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'}
                            ${isDisabled ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'}
                        `}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                        {tab.id !== 'calculator' && portfolioCount > 0 && (
                            <span className={`
                                ml-1 px-1.5 py-0.5 rounded-md text-[10px] 
                                ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}
                            `}>
                                {portfolioCount}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
