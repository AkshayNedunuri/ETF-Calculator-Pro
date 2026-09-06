"use client";

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, TrendingUp, LogOut, User, Search, Bell, Settings } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Tooltip } from './UI/Tooltip';

export default function Navbar() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
    const [dbAdvice, setDbAdvice] = useState<string>('');
    const { data: session, status } = useSession();

    useEffect(() => {
        const checkDb = async () => {
            try {
                const res = await fetch('/api/health');
                const data = await res.json();
                if (data.status === 'connected') {
                    setDbStatus('connected');
                    setDbAdvice('');
                } else {
                    setDbStatus('disconnected');
                    setDbAdvice(data.advice || '');
                }
            } catch (e) {
                setDbStatus('disconnected');
            }
        };
        checkDb();
        const interval = setInterval(checkDb, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    // Local user fallback (Full-stack developer touch)
    const [localUser, setLocalUser] = useState<{name: string, email: string} | null>(null);
    useEffect(() => {
        if (status !== 'authenticated' && typeof window !== 'undefined') {
            const saved = localStorage.getItem('wealthCalc_localUser');
            if (saved) setLocalUser(JSON.parse(saved));
        }
    }, [status]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const isLoggedIn = (status === 'authenticated' && !!session?.user) || !!localUser;
    const userName = session?.user?.name || localUser?.name || "User";
    const userEmail = session?.user?.email || localUser?.email || "Local account";

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/20 dark:border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center group">
                            <div className="p-2 rounded-xl bg-blue-600 dark:bg-blue-500 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 font-black text-2xl text-gray-900 dark:text-white tracking-tight">WealthCalc <span className="gradient-text">India</span></span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/dashboard" className="px-4 py-2 text-sm font-black text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">
                            Portfolio
                        </Link>
                        
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>

                        {/* Icon Actions */}
                        <div className="flex items-center gap-2">
                            {/* Settings Gear with Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                    className={`p-2.5 rounded-xl transition-all border ${isSettingsOpen 
                                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/40' 
                                        : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-white/10'}`}
                                >
                                    <Settings className="w-5 h-5" />
                                </button>

                                {isSettingsOpen && (
                                    <div className="absolute right-0 mt-4 w-72 glass-heavy bg-white/95 dark:bg-gray-900/95 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/40 dark:border-white/10 p-7 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-[100]">
                                        {isLoggedIn ? (
                                            <div className="space-y-6">
                                                {/* Account Info */}
                                                <div className="flex items-center gap-4 p-2">
                                                    {session?.user?.image ? (
                                                        <Image
                                                            src={session.user.image}
                                                            alt={userName}
                                                            width={48}
                                                            height={48}
                                                            className="rounded-full ring-2 ring-blue-500/50 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg ring-2 ring-blue-500/50 shrink-0">
                                                            {userName.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col min-w-0 overflow-hidden">
                                                        <span className="font-black text-gray-900 dark:text-white truncate">{userName}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate font-bold">{userEmail}</span>
                                                        {!session && localUser && (
                                                            <span className="mt-1 w-fit px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[8px] font-black uppercase rounded-md border border-orange-200/50">
                                                                Local Mode
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="h-px bg-gray-100 dark:bg-gray-800/50"></div>

                                                {/* Settings Options */}
                                                <div className="space-y-2">
                                                    <div className="px-4 py-2">
                                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Preferences</p>
                                                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                                            <button className="flex-1 px-3 py-1.5 rounded-lg text-xs font-black bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm transition-all">
                                                                INR (₹)
                                                            </button>
                                                            <button className="flex-1 px-3 py-1.5 rounded-lg text-xs font-black text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all">
                                                                USD ($)
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 transition-all font-bold text-sm">
                                                        <User className="w-4 h-4 text-blue-500" />
                                                        Account Details
                                                    </button>
                                                    <button 
                                                        onClick={toggleTheme}
                                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 transition-all font-bold text-sm"
                                                    >
                                                        {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
                                                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                                    </button>
                                                </div>

                                                <div className="h-px bg-gray-100 dark:bg-gray-800/50"></div>

                                                <button
                                                    onClick={() => {
                                                        if (session) {
                                                            signOut({ callbackUrl: '/' });
                                                        } else {
                                                            localStorage.removeItem('wealthCalc_localUser');
                                                            window.location.reload();
                                                        }
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl font-black hover:bg-red-100 dark:hover:bg-red-900/20 transition-all text-sm uppercase tracking-widest"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    {session ? 'Logout' : 'Exit Local Mode'}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="text-center">
                                                    <h4 className="font-black text-gray-900 dark:text-white mb-1">Guest Account</h4>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Join to sync your data</p>
                                                </div>
                                                <div className="space-y-3">
                                                    <Link href="/login" className="w-full flex items-center justify-center py-3 rounded-2xl bg-blue-600 text-white font-black text-sm transition-all hover:shadow-lg">
                                                        Sign In
                                                    </Link>
                                                    <Link href="/signup" className="w-full flex items-center justify-center py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-black text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
                                                        Create Account
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>

                        {!isLoggedIn && (
                             <Link href="/signup" className="px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-black hover:shadow-2xl hover:translate-y-[-2px] transition-all uppercase tracking-widest">
                                Get Started
                             </Link>
                        )}
                        
                        {isLoggedIn && (
                            <div className="flex items-center gap-3 pl-2">
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name ?? 'User'}
                                        width={36}
                                        height={36}
                                        className="rounded-full ring-2 ring-blue-500/20"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 font-black text-xs">
                                        {session.user?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleTheme}
                            className="p-2 mr-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none"
                        >
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        {/* Database Status Indicator (Full-stack developer touch) */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 border border-white/10">
                            <Tooltip content={
                                dbStatus === 'connected' 
                                    ? "Cloud Database Connected: Your data is safely synced to MongoDB." 
                                    : `Cloud Database Disconnected: Using Local Storage. ${dbAdvice || 'Fix: 1. Whitelist your IP in MongoDB Atlas 2. Check MONGODB_URI in .env.local'}`
                            }>
                                <div className="flex items-center gap-2 cursor-help">
                                    <div className={`w-2 h-2 rounded-full shadow-sm ${
                                        dbStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
                                        dbStatus === 'disconnected' ? 'bg-red-500' : 'bg-amber-400'
                                    }`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        {dbStatus === 'connected' ? 'Cloud Link' : 'Local Only'}
                                    </span>
                                </div>
                            </Tooltip>
                        </div>

                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="p-3 rounded-2xl text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 relative group"
                        >
                            <Settings className={`w-6 h-6 transition-transform duration-500 ${isSettingsOpen ? 'rotate-90 text-blue-600' : 'group-hover:rotate-45'}`} />
                            {dbStatus === 'disconnected' && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Link href="/dashboard" className="block text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600">
                        Dashboard
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <div className="flex items-center gap-3 py-1">
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt="avatar"
                                        width={32}
                                        height={32}
                                        className="rounded-full ring-2 ring-blue-500"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                                        {session.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                                    </div>
                                )}
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
                                    {session.user?.name ?? session.user?.email}
                                </span>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="block text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600">
                                Log In
                            </Link>
                            <Link href="/signup" className="block px-5 py-3 rounded-xl bg-blue-600 text-white text-center text-sm font-bold">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
