"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, UserPlus, Chrome, Eye, EyeOff, ArrowLeft, CheckCircle2, ShieldCheck, Database, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/UI/Toast";
import { api } from "@/lib/api";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const getPasswordStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 6) score += 1;
        if (pass.length >= 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    };

    const strength = getPasswordStrength(password);
    const strengthColor = strength <= 2 ? "bg-amber-500" : strength <= 4 ? "bg-blue-500" : "bg-emerald-500";
    const strengthLabel = strength <= 2 ? "Basic" : strength <= 4 ? "Strong" : "Very Strong";

    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMsg("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            const normalizedEmail = email.toLowerCase().trim();
            const data = await api.signup({ name: name.trim(), email: normalizedEmail, password });

            if (data.ok) {
                setSuccessMsg("Account & encrypted password saved to database! Logging you in...");
                showToast("Account created and saved to database!", "success");

                // Sign in directly through NextAuth against the MongoDB database
                const signInResult = await signIn("credentials", {
                    email: normalizedEmail,
                    password,
                    redirect: false,
                    callbackUrl: "/dashboard",
                });

                if (signInResult?.ok) {
                    window.location.href = "/dashboard";
                } else {
                    // Redirect to login page if auto-login requires manual confirmation
                    setTimeout(() => {
                        window.location.href = `/login?registered=true&email=${encodeURIComponent(normalizedEmail)}`;
                    }, 1200);
                }
            } else {
                setError(data.message || "Failed to create account in database. Please try again.");
                showToast(data.message || "Signup failed", "error");
            }
        } catch (err: any) {
            setError(err.message || "Could not connect to database server.");
            showToast("Database connection error", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-inter">
            {/* Left Side: Branding & Trust Signals (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 p-16 flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight mb-20 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <span className="text-white font-black">W</span>
                        </div>
                        WealthCalc <span className="text-purple-300 italic font-medium">India</span>
                    </Link>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold uppercase tracking-wider mb-6">
                        <Database className="w-3.5 h-3.5 text-purple-300" />
                        Direct MongoDB Database Storage
                    </div>

                    <h2 className="text-5xl font-black leading-tight mb-8">
                        The smarter way to <br />
                        <span className="text-purple-300 italic">build & track wealth</span>
                    </h2>

                    <div className="space-y-6">
                        {[
                            "Passwords securely hashed with bcrypt (12 rounds)",
                            "Persistent user profiles stored directly in MongoDB",
                            "SIP, Lumpsum, ETF & Multi-Asset Portfolio Tracking",
                            "Dual Currency Switcher (INR ₹ and USD $)",
                            "Inflation-adjusted real-rate compounding calculator"
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-6 h-6 rounded-full bg-purple-500/30 border border-purple-400/30 flex items-center justify-center group-hover:bg-purple-500/50 transition-colors shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-purple-300" />
                                </div>
                                <span className="text-base font-medium text-purple-100/90">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">Enterprise Database Architecture</p>
                        <p className="text-xs text-purple-200/70">Your credentials and financial models are encrypted and stored in MongoDB.</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl lg:shadow-none p-8 md:p-0 border lg:border-none border-gray-100 dark:border-gray-800">
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors mb-6 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                        
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                                Create <span className="text-purple-600 dark:text-purple-400 italic">Account</span>
                            </h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            Create your database-backed profile to save portfolios and models.
                        </p>
                    </div>

                    {/* Success notification */}
                    {successMsg && (
                        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-sm font-medium flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <p>{successMsg}</p>
                        </div>
                    )}

                    {/* Error notification */}
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-300 text-sm font-medium">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                <div className="space-y-2">
                                    <p>{error}</p>
                                    {error.includes("already exists") && (
                                        <Link 
                                            href={`/login?email=${encodeURIComponent(email)}`}
                                            className="inline-block text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                                        >
                                            Go to Sign In page →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Akshay Nedunuri"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all font-medium text-sm"
                                />
                            </div>
                        </div>

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
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all font-medium text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all font-medium text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            {password && (
                                <div className="px-1 pt-2 space-y-1 animate-in fade-in duration-300">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-gray-500">
                                        <span>Security Strength</span>
                                        <span className="text-purple-600 dark:text-purple-400">{strengthLabel}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-500 ease-out ${strengthColor}`}
                                            style={{ width: `${(strength / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-purple-50/60 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/40 flex items-center gap-2.5 text-xs text-purple-700 dark:text-purple-300 font-medium">
                            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                            <span>Saved securely to MongoDB with 12-round bcrypt hash.</span>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Saving to Database...
                                </span>
                            ) : (
                                "Create Database Account"
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-900 px-4 text-gray-400 font-bold tracking-widest">Or continue with</span>
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
                            Already have an account?{" "}
                            <Link href="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline underline-offset-4">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
