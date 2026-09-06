
"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = "success") => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-10 fade-in duration-300 min-w-[300px] ${
                            toast.type === "success" 
                                ? "bg-white dark:bg-gray-900 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-300" 
                                : toast.type === "error" 
                                    ? "bg-white dark:bg-gray-900 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-300"
                                    : "bg-white dark:bg-gray-900 border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-300"
                        }`}
                    >
                        {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        {toast.type === "error" && <XCircle className="w-5 h-5 text-red-500" />}
                        {toast.type === "info" && <Info className="w-5 h-5 text-blue-500" />}
                        
                        <div className="flex-1">
                            <p className="text-sm font-bold leading-tight">{toast.message}</p>
                        </div>
                        
                        <button 
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
