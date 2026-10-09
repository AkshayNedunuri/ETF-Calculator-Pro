"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, LogIn, Chrome, Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, Database } from "lucide-react";
import { useToast } from "@/components/UI/Toast";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");
    const paramEmail = searchParams.get("email");

    const [email, setEmail] = useState(paramEmail || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { showToast } = useToast();

    useEffect(() => {
        if (paramEmail) {
            setEmail(paramEmail);
        }
        if (registered) {
            showToast("Account created in database! Please sign in with your credentials.", "success");
        }
    }, [registered, paramEmail]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const normalizedEmail = email.toLowerCase().trim();

        try {
            const res = await signIn("credentials", {
                email: normalizedEmail,
                password,
                callbackUrl: "/dashboard",
                redirect: false,
            });

            if (res?.ok) {
                showToast("Authenticated successfully with database!", "success");
                window.location.href = "/dashboard";
            } else {
                const errMsg = res?.error || "Invalid credentials";
                if (errMsg.includes("No account")) {
                    setError("No account found with this email in the database. Please check your email or sign up.");
                } else if (errMsg.includes("Google")) {
                    setError("This account was registered via Google. Please use Google Sign-In below.");
                } else {
                    setError("Invalid email or password. Please check your credentials.");
                }
                showToast("Authentication failed", "error");
            }
        } catch (err: any) {
            setError("Could not connect to database authentication server.");
            showToast("Server error during signin", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleQuickFill = (fillEmail: string, fillPass: string) => {
        setEmail(fillEmail);
        setPassword(fillPass);
        setError("");
        showToast("Credentials loaded into form. Click Sign In to verify against database.", "info");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-inter">
            {/* Left Side: Illustration & Branding (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 p-16 flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight mb-20 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white font-black">W</span>
                        </div>
                        WealthCalc <span className="text-blue-300 italic font-medium">India</span>
                    </Link>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-6">
                        <Database className="w-3.5 h-3.5 text-blue-300" />
                        MongoDB Database Authentication
                    </div>

                    <h2 className="text-5xl font-black leading-tight mb-8">
                        Welcome <span className="text-blue-300 italic">Back</span> to <br />
                        Your Wealth Hub
                    </h2>

                    <div className="space-y-6 mt-10">
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 max-w-md">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-6 h-6 text-blue-300" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg mb-1">Encrypted Database Security</p>
                                    <p className="text-blue-100/70 text-sm leading-relaxed">
                                        Your account passwords are encrypted with bcrypt and verified securely in MongoDB.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 px-2">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-800 bg-blue-500/30 backdrop-blur-sm flex items-center justify-center font-bold text-xs text-blue-200">
                                        ★
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-blue-100">Professional multi-asset analytics & planning</p>
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
                    <Link href="/" className="inline-flex lg:hidden items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                            Sign <span className="text-blue-600 dark:text-blue-400 italic">In</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            Access your database-saved investment models and portfolios
                        </p>
                    </div>

                    {/* Pre-fill Option for testing */}
                    <div className="mb-6 p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                                A
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-900 dark:text-white">Akshay Nedunuri</p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">akshaynedunuri17@gmail.com</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleQuickFill("akshaynedunuri17@gmail.com", "@k17shaY")}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm transition-all"
                        >
                            Quick Fill
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-300 text-xs font-medium flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p>{error}</p>
                                {error.includes("No account found") && (
                                    <Link href="/signup" className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        Create a new account now →
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="akshaynedunuri17@gmail.com"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                                <Link href="/forgot-password" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
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
                                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-sm"
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
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Verifying Database Credentials...
                                </span>
                            ) : (
                                "Sign In to WealthCalc"
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-950 px-4 text-gray-400 font-bold tracking-widest">Or access with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-bold text-gray-700 dark:text-gray-300 mb-8 text-sm"
                    >
                        <Chrome className="w-4 h-4" /> Google Account
                    </button>

                    <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            New to WealthCalc?{" "}
                            <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-bold hover:underline underline-offset-4">
                                Create a Free Database Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
