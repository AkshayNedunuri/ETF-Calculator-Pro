"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Menu, X, TrendingUp, LogOut, User, Settings, Globe, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Tooltip } from './UI/Tooltip';
import { api } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import { AccountModal } from './AccountModal';

export default function Navbar() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
    const [dbAdvice, setDbAdvice] = useState<string>('');
    const { data: session, status } = useSession();
    const { currency, setCurrency, exchangeRate, symbol } = useCurrency();

    const settingsRef = useRef<HTMLDivElement>(null);

    // Close settings dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const checkDb = async () => {
            try {
                const data = await api.checkHealth();
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

    // Local user fallback
    const [localUser, setLocalUser] = useState<{name: string, email: string} | null>(null);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (status === 'authenticated') {
            localStorage.removeItem('wealthCalc_localUser');
            setLocalUser(null);
        } else if (status === 'unauthenticated') {
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
    const userName = session?.user?.name || localUser?.name || "Investor";
    const userEmail = session?.user?.email || localUser?.email || "Local Safe Account";

    return (
        <>
            <nav className="glass sticky top-0 z-50 border-b border-gray-200/50 dark:border-white/5 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Brand Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center group">
                                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-3 flex flex-col">
                                    <span className="font-black text-2xl text-gray-900 dark:text-white tracking-tight leading-none">
                                        WealthCalc <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">India</span>
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                                        Multi-Asset Financial Suite
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Center / Right Navbar Controls (Desktop) */}
                        <div className="hidden md:flex items-center space-x-3">
                            <Link 
                                href="/dashboard" 
                                className="px-4 py-2 text-xs font-black text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all uppercase tracking-widest"
                            >
                                Portfolio
                            </Link>

                            <Link 
                                href="/?view=comparison" 
                                className="px-4 py-2 text-xs font-black text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all uppercase tracking-widest"
                            >
                                Compare
                            </Link>
                            
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

                            {/* Direct Interactive Currency Switcher Pill */}
                            <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-inner">
                                <button
                                    onClick={() => setCurrency("INR")}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                                        currency === "INR"
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                    title="View in Indian Rupees (₹)"
                                >
                                    <span>₹</span>
                                    <span>INR</span>
                                </button>
                                <button
                                    onClick={() => setCurrency("USD")}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                                        currency === "USD"
                                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25 scale-[1.02]"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                    title={`View in US Dollars ($) • 1 USD = ₹${exchangeRate.toFixed(2)}`}
                                >
                                    <span>$</span>
                                    <span>USD</span>
                                </button>
                            </div>

                            {/* Database Status Indicator */}
                            <Tooltip content={
                                dbStatus === 'connected' 
                                    ? "Cloud Database Connected: Safely syncing with MongoDB Atlas." 
                                    : `Local Storage Mode Active: Fully functional offline. ${dbAdvice || 'Connect your MongoDB URI in .env.local for cloud syncing.'}`
                            }>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer">
                                    <div className={`w-2 h-2 rounded-full ${
                                        dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                                    }`} />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {dbStatus === 'connected' ? 'Cloud' : 'Local'}
                                    </span>
                                </div>
                            </Tooltip>

                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/80 transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                                title="Toggle Dark/Light Mode"
                            >
                                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                            </button>

                            {/* Settings & Profile Menu */}
                            <div className="relative" ref={settingsRef}>
                                <button 
                                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                    className={`p-2.5 rounded-xl transition-all border flex items-center gap-2 ${
                                        isSettingsOpen 
                                            ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30' 
                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/80 border-gray-200 dark:border-gray-700/60'
                                    }`}
                                    title="Preferences & Account"
                                >
                                    {isLoggedIn ? (
                                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs ring-2 ring-white dark:ring-gray-900">
                                            {userName.charAt(0).toUpperCase()}
                                        </div>
                                    ) : (
                                        <Settings className="w-4 h-4" />
                                    )}
                                    <span className="text-xs font-bold hidden lg:inline-block max-w-[90px] truncate">
                                        {isLoggedIn ? userName : "Settings"}
                                    </span>
                                </button>

                                {isSettingsOpen && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-gray-200 dark:border-gray-800 p-6 animate-in fade-in zoom-in-95 duration-150 origin-top-right z-[100]">
                                        <div className="space-y-5">
                                            {/* Account Info Header */}
                                            <div 
                                                onClick={() => {
                                                    setIsAccountModalOpen(true);
                                                    setIsSettingsOpen(false);
                                                }}
                                                className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all cursor-pointer group"
                                                title="Click to view full Account Details"
                                            >
                                                {session?.user?.image ? (
                                                    <Image
                                                        src={session.user.image}
                                                        alt={userName}
                                                        width={44}
                                                        height={44}
                                                        className="rounded-2xl ring-2 ring-blue-500/50 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg ring-2 ring-blue-500/40 shrink-0 group-hover:scale-105 transition-transform">
                                                        {userName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex flex-col min-w-0 overflow-hidden flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-black text-gray-900 dark:text-white truncate text-sm">{userName}</span>
                                                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider group-hover:underline">
                                                            View →
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate font-semibold">{userEmail}</span>
                                                    <span className="mt-1 w-fit px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-wider rounded-md border border-blue-200/50">
                                                        {session ? "Cloud Account" : "Local Mode"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

                                            {/* Currency Preferences Section */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                        Currency Preference
                                                    </p>
                                                    <span className="text-[10px] font-mono font-bold text-gray-400">
                                                        1 USD ≈ ₹{exchangeRate.toFixed(1)}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
                                                    <button 
                                                        onClick={() => setCurrency("INR")}
                                                        className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                                                            currency === "INR"
                                                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                                                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                        }`}
                                                    >
                                                        <span>₹</span>
                                                        <span>INR (₹)</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => setCurrency("USD")}
                                                        className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                                                            currency === "USD"
                                                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                                                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                        }`}
                                                    >
                                                        <span>$</span>
                                                        <span>USD ($)</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Action Items */}
                                            <div className="space-y-1.5">
                                                <button 
                                                    onClick={() => {
                                                        setIsAccountModalOpen(true);
                                                        setIsSettingsOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-gray-200 transition-all font-bold text-xs"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <User className="w-4 h-4 text-blue-600" />
                                                        <span>Account Details & Goals</span>
                                                    </div>
                                                    <span className="text-gray-400 text-xs">⌘A</span>
                                                </button>

                                                <button 
                                                    onClick={toggleTheme}
                                                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-gray-200 transition-all font-bold text-xs"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                                                        <span>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                                                    </div>
                                                </button>
                                            </div>

                                            <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

                                            {/* Login / Logout */}
                                            {isLoggedIn ? (
                                                <button
                                                    onClick={() => {
                                                        localStorage.removeItem('wealthCalc_localUser');
                                                        if (status === 'authenticated') {
                                                            signOut({ callbackUrl: '/' });
                                                        } else {
                                                            setLocalUser(null);
                                                            window.location.href = '/';
                                                        }
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl font-black hover:bg-red-100 dark:hover:bg-red-900/30 transition-all text-xs uppercase tracking-wider"
                                                >
                                                    <LogOut className="w-3.5 h-3.5" />
                                                    Logout Session
                                                </button>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Link 
                                                        href="/login" 
                                                        onClick={() => setIsSettingsOpen(false)}
                                                        className="py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs text-center hover:bg-blue-700 transition-all"
                                                    >
                                                        Sign In
                                                    </Link>
                                                    <Link 
                                                        href="/signup" 
                                                        onClick={() => setIsSettingsOpen(false)}
                                                        className="py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-black text-xs text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                                    >
                                                        Sign Up
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {!isLoggedIn && (
                                <Link 
                                    href="/signup" 
                                    className="px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black hover:shadow-xl hover:translate-y-[-1px] transition-all uppercase tracking-wider"
                                >
                                    Get Started
                                </Link>
                            )}
                        </div>

                        {/* Mobile Hamburger Button */}
                        <div className="flex items-center gap-2 md:hidden">
                            {/* Quick Mobile Currency Switcher */}
                            <button
                                onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
                                className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700"
                            >
                                {symbol} {currency}
                            </button>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-6 space-y-4 animate-in slide-in-from-top-2">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <p className="font-black text-sm text-gray-900 dark:text-white">{userName}</p>
                                <p className="text-xs text-gray-500">{userEmail}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsAccountModalOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs"
                            >
                                Account Details
                            </button>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Currency</p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setCurrency("INR")}
                                    className={`py-2 rounded-xl text-xs font-black ${
                                        currency === "INR" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    INR (₹)
                                </button>
                                <button
                                    onClick={() => setCurrency("USD")}
                                    className={`py-2 rounded-xl text-xs font-black ${
                                        currency === "USD" ? "bg-emerald-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    USD ($)
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Link href="/" className="block py-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                Calculator
                            </Link>
                            <Link href="/dashboard" className="block py-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                Portfolio Dashboard
                            </Link>
                            <Link href="/?view=comparison" className="block py-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                Compare Assets
                            </Link>
                        </div>

                        <div className="pt-2">
                            {isLoggedIn ? (
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('wealthCalc_localUser');
                                        if (status === 'authenticated') signOut({ callbackUrl: '/' });
                                        else window.location.href = '/';
                                    }}
                                    className="w-full py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 font-black text-xs uppercase tracking-wider"
                                >
                                    Logout
                                </button>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <Link href="/login" className="py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs text-center">
                                        Log In
                                    </Link>
                                    <Link href="/signup" className="py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs text-center">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Account Details Modal */}
            <AccountModal
                isOpen={isAccountModalOpen}
                onClose={() => setIsAccountModalOpen(false)}
                onProfileUpdated={(newName) => {
                    if (localUser) {
                        setLocalUser({ ...localUser, name: newName });
                    }
                }}
            />
        </>
    );
}
