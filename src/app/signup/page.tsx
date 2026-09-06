
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, UserPlus, Chrome, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/UI/Toast";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getPasswordStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length > 6) score += 1;
        if (pass.length > 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    };

    const strength = getPasswordStrength(password);
    const strengthColor = strength <= 2 ? "bg-red-500" : strength <= 4 ? "bg-yellow-500" : "bg-green-500";
    const strengthLabel = strength <= 2 ? "Weak" : strength <= 4 ? "Medium" : "Strong";

    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                showToast("Account created successfully!");
                setTimeout(() => window.location.href = "/login", 1500);
            } else {
                // If it's a 500 or timeout, check DB health
                if (res.status >= 500) {
                    const healthRes = await fetch("/api/health");
                    const healthData = await healthRes.json();
                    if (healthData.status !== "connected") {
                        setError("Could not connect to the cloud database. This is likely due to the credentials in .env.local. Please use 'Skip' for now.");
                        showToast("Cloud DB disconnected", "error");
                    } else {
                        setError(data.message || "An unexpected error occurred.");
                    }
                } else {
                    setError(data.message || "Signup failed. Please try again.");
                    showToast(data.message || "Signup failed", "error");
                }
            }
        } catch (err: any) {
            setError("Network error or timeout. Our database might be unreachable. Check your MONGODB_URI.");
            showToast("Network Error", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-inter">
            {/* Left Side: Branding & Social Proof (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-700 to-blue-800 p-16 flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight mb-20 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <span className="text-purple-700 font-black">W</span>
                        </div>
                        WealthCalc <span className="text-blue-200 italic font-medium">India</span>
                    </Link>

                    <h2 className="text-5xl font-black leading-tight mb-8">
                        The smarter way to <br />
                        <span className="text-blue-300 italic">build wealth</span>
                    </h2>

                    <div className="space-y-6">
                        {[
                            "Analyze SIP & Lumpsum returns with ease",
                            "Track all your assets in one dashboard",
                            "Adjust for inflation & expenses automatically",
                            "Secure & private data storage"
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors">
                                    <CheckCircle2 className="w-4 h-4 text-blue-200" />
                                </div>
                                <span className="text-lg font-medium text-blue-50/90">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                    <p className="text-xl font-bold italic mb-4">"This tool changed how I view my long-term SIP goals. The inflation adjustment is a game changer!"</p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-300"></div>
                        <div>
                            <p className="font-bold">Rahul Sharma</p>
                            <p className="text-sm text-blue-200">Long-term Investor</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-12">
                <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl lg:shadow-none p-8 md:p-0 border lg:border-none border-gray-100 dark:border-gray-800">
                    <div className="mb-0 lg:mb-12">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors mb-8 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                        
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                            Create <span className="text-purple-600 dark:text-purple-500 italic">Account</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Join thousands of smart investors</p>
                    </div>

                    {error && (
                        <div className="my-6 p-5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                            <div className="flex gap-3 mb-3">
                                <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">!</div>
                                <p className="leading-tight">{error}</p>
                            </div>
                            <button 
                                onClick={() => {
                                    if (!name || !email) {
                                        showToast("Please enter your name and email first", "info");
                                        return;
                                    }
                                    const localUser = { name, email, isLocal: true };
                                    localStorage.setItem('wealthCalc_localUser', JSON.stringify(localUser));
                                    showToast("Local account initialized!");
                                    setTimeout(() => window.location.href = "/dashboard", 1000);
                                }}
                                className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-600/20"
                            >
                                Continue in Local-Only Mode →
                            </button>
                            <p className="mt-3 text-[10px] text-red-400 opacity-70 text-center font-bold">
                                Note: Your data will be saved only on this browser.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all font-medium"
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
                                    placeholder="your@email.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all font-medium"
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
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all font-medium"
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
                                        <span>Strength</span>
                                        <span>{strengthLabel}</span>
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

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-purple-600 dark:bg-purple-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:translate-y-[-2px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : "Get Started"}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-950 px-4 text-gray-400 font-bold tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-bold text-gray-700 dark:text-gray-300 mb-8"
                    >
                        <Chrome className="w-5 h-5" /> Google Account
                    </button>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-purple-600 dark:text-purple-500 font-bold hover:underline underline-offset-4">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
