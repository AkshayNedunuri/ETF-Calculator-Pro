"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/UI/Toast";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.forgotPassword(email);

            if (res.ok) {
                setSent(true);
                showToast("Reset link generated!");
            } else {
                showToast(res.message || "Failed to generate reset link", "error");
            }
        } catch (error) {
            showToast("Network error. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 py-8 font-inter">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
                <div className="p-8 md:p-12">
                    <Link href="/login" className="inline-flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Login
                    </Link>

                    {!sent ? (
                        <>
                            <div className="text-left mb-10">
                                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                                    Forgot <span className="text-blue-600 dark:text-blue-500 italic">Password?</span>
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">No worries, we'll send you reset instructions to your email.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-blue-600 dark:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? "Sending..." : <><Send className="w-5 h-5" /> Send Reset Link</>}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Check your email</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 leading-relaxed px-4">
                                We've sent password reset instructions to <br />
                                <span className="text-gray-900 dark:text-white font-bold">{email}</span>
                            </p>
                            <button
                                onClick={() => setSent(false)}
                                className="text-blue-600 dark:text-blue-500 font-bold hover:underline transition-all"
                            >
                                Didn't receive the email? Click to resend
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-widest">
                        Secure Password Reset Implementation
                    </p>
                </div>
            </div>
        </div>
    );
}
