
"use client";

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

interface TooltipProps {
    content: string;
    children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block ml-1 group">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="cursor-help text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="More information"
            >
                {children || <HelpCircle className="w-3.5 h-3.5" />}
            </div>
            
            {isVisible && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                    <div className="relative">
                        {content}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            )}
        </div>
    );
};
