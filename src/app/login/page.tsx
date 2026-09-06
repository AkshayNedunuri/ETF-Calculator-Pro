"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Mail, Lock, LogIn, Chrome, Eye, EyeOff, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/UI/Toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                callbackUrl: "/dashboard",
                redirect: false,
            });

            if (res?.error) {
                const msg =
                    res.error === "CredentialsSignin"
                        ? "Incorrect email or password. Please try again."
                        : res.error; // shows "Service unavailable..." for DB errors
                setError(msg);
                showToast(msg, "error");
            } else if (res?.ok) {
                showToast("Welcome back!", "success");
                window.location.href = "/dashboard";
            } else {
                setError("Login failed. Please try again.");
                showToast("Login failed", "error");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            showToast("Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-inter">
            {/* Left Side: Illustration & Branding (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 p-16 flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight mb-20 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-blue-700 font-black">W</span>
                        </div>
                        WealthCalc <span className="text-blue-200 italic font-medium">India</span>
                    </Link>

                    <h2 className="text-5xl font-black leading-tight mb-8">
                        Welcome <span className="text-blue-300 italic">Back</span> to <br />
                        Your Wealth Hub
                    </h2>

                    <div className="space-y-8 mt-12">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 max-w-md">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-400/20 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-6 h-6 text-blue-200" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg mb-1">Secure & Private</p>
                                    <p className="text-blue-100/70 text-sm leading-relaxed">Your financial data is encrypted and only accessible by you.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 px-2">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-blue-700 bg-blue-${i+3}00`}></div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-blue-100">Joined by 10,000+ investors this month</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-10 border-t border-white/10">
                    <p className="text-sm text-blue-200/60 font-medium">© 2026 WealthCalc India. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    <Link href="/" className="inline-flex lg:hidden items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-12 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                            Sign <span className="text-blue-600 dark:text-blue-500 italic">In</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Access your personalized dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
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

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                                <Link href="/forgot-password" size="sm" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
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
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-blue-600 dark:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:translate-y-[-2px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Authenticating..." : "Sign In"}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-950 px-4 text-gray-400 font-bold tracking-widest">Or login with</span>
                        </div>
                    </div>

                    <button
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-bold text-gray-700 dark:text-gray-300 mb-10"
                    >
                        <Chrome className="w-5 h-5" /> Google Account
                    </button>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            New here?{" "}
                            <Link href="/signup" className="text-blue-600 dark:text-blue-500 font-bold hover:underline underline-offset-4">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
