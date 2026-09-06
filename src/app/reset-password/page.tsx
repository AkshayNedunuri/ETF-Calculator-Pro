"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/UI/Toast";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast } = useToast();
    
    const token = searchParams.get("token");
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            showToast("Invalid or missing reset token", "error");
            router.push("/forgot-password");
        }
    }, [token, router, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        if (password.length < 8) {
            showToast("Password must be at least 8 characters", "error");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                showToast("Password reset successful!");
            } else {
                showToast(data.message || "Failed to reset password", "error");
            }
        } catch (error) {
            showToast("Network error. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Password Updated</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 leading-relaxed px-4">
                    Your password has been successfully reset. <br />
                    You can now log in with your new credentials.
                </p>
                <Link 
                    href="/login" 
                    className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 dark:bg-blue-500 text-white font-black rounded-2xl shadow-lg hover:shadow-blue-500/40 hover:translate-y-[-2px] transition-all"
                >
                    Log In Now <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-left mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 mb-6">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                    Reset <span className="text-blue-600 dark:text-blue-500 italic">Password</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Choose a strong, secure password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Confirm New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                        />
                    </div>
                </div>

                <button
                    disabled={loading || !token}
                    type="submit"
                    className="w-full bg-blue-600 dark:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 py-8 font-inter">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-8 md:p-12">
                   <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
                        <ResetPasswordContent />
                   </Suspense>
                </div>
                
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-widest">
                        ETF Calculator Security
                    </p>
                </div>
            </div>
        </div>
    );
}
