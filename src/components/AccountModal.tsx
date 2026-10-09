"use client";

import React, { useState, useEffect } from "react";
import { 
    X, User, Mail, DollarSign, Shield, Database, Download, 
    Upload, Check, AlertCircle, RefreshCw, LogOut, ArrowRight,
    TrendingUp, Award, Settings, CheckCircle2, Globe, Sparkles
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/components/UI/Toast";
import { api } from "@/lib/api";

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProfileUpdated?: (name: string) => void;
}

type TabType = "profile" | "currency" | "data" | "cloud";

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onProfileUpdated }) => {
    const { data: session, status } = useSession();
    const { currency, setCurrency, exchangeRate, setExchangeRate, symbol, formatAmount } = useCurrency();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<TabType>("profile");
    
    // User profile state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [targetGoal, setTargetGoal] = useState<number>(10000000);
    const [riskProfile, setRiskProfile] = useState<"conservative" | "balanced" | "aggressive">("balanced");
    const [customRate, setCustomRate] = useState<string>(exchangeRate.toString());
    const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "disconnected">("checking");
    const [dbAdvice, setDbAdvice] = useState<string>("");
    const [isCheckingDb, setIsCheckingDb] = useState(false);
    const [savedCount, setSavedCount] = useState<number>(0);

    // Load initial user details
    useEffect(() => {
        if (!isOpen) return;

        let currentName = "Investor";
        let currentEmail = "local@wealthcalc.internal";

        if (session?.user) {
            currentName = session.user.name || "Investor";
            currentEmail = session.user.email || "";
        } else {
            const savedLocal = localStorage.getItem("wealthCalc_localUser");
            if (savedLocal) {
                try {
                    const parsed = JSON.parse(savedLocal);
                    currentName = parsed.name || currentName;
                    currentEmail = parsed.email || currentEmail;
                } catch {}
            }
        }

        setName(currentName);
        setEmail(currentEmail);
        setCustomRate(exchangeRate.toString());

        // Check local storage for portfolio items & goal
        const userKey = `wealthCalcData:${currentEmail || "guest"}`;
        const savedData = localStorage.getItem(userKey);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.targetGoal) setTargetGoal(parsed.targetGoal);
                if (parsed.portfolio) setSavedCount(parsed.portfolio.length);
            } catch {}
        }

        const savedRisk = localStorage.getItem("wealthCalc_riskProfile");
        if (savedRisk) setRiskProfile(savedRisk as any);

        checkDbHealth();
    }, [isOpen, session, exchangeRate]);

    const checkDbHealth = async () => {
        setIsCheckingDb(true);
        try {
            const data = await api.checkHealth();
            if (data.status === "connected") {
                setDbStatus("connected");
                setDbAdvice("MongoDB Atlas connection active and healthy.");
            } else {
                setDbStatus("disconnected");
                setDbAdvice(data.advice || "Cloud database is unreachable. Operating in offline safe mode.");
            }
        } catch {
            setDbStatus("disconnected");
            setDbAdvice("API server or cloud cluster unreachable. Operating in local storage mode.");
        } finally {
            setIsCheckingDb(false);
        }
    };

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSaveProfile = () => {
        if (!name.trim()) {
            showToast("Please enter a valid name", "error");
            return;
        }

        // Save local user info
        const updatedLocal = { name: name.trim(), email: email.trim(), isLocal: !session };
        localStorage.setItem("wealthCalc_localUser", JSON.stringify(updatedLocal));
        localStorage.setItem("wealthCalc_riskProfile", riskProfile);

        // Update target goal in active storage
        const userKey = `wealthCalcData:${email || "guest"}`;
        const existing = localStorage.getItem(userKey);
        let dataObj: any = {};
        if (existing) {
            try { dataObj = JSON.parse(existing); } catch {}
        }
        dataObj.targetGoal = targetGoal;
        localStorage.setItem(userKey, JSON.stringify(dataObj));

        if (onProfileUpdated) onProfileUpdated(name.trim());
        showToast("Profile and goals updated successfully!", "success");
    };

    const handleSaveCurrency = () => {
        const parsed = parseFloat(customRate);
        if (isNaN(parsed) || parsed <= 0) {
            showToast("Please enter a valid exchange rate", "error");
            return;
        }
        setExchangeRate(parsed);
        showToast(`Preferences saved: ${currency} active (1 USD = ₹${parsed.toFixed(2)})`, "success");
    };

    const handleExportData = () => {
        const userKey = `wealthCalcData:${email || "guest"}`;
        const data = localStorage.getItem(userKey);
        if (!data) {
            showToast("No portfolio data found to export", "info");
            return;
        }
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `wealthcalc_backup_${email || "portfolio"}_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Portfolio backup downloaded!", "success");
    };

    const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const parsed = JSON.parse(content);
                const userKey = `wealthCalcData:${email || "guest"}`;
                localStorage.setItem(userKey, JSON.stringify(parsed));
                showToast("Portfolio data imported successfully!", "success");
                setTimeout(() => window.location.reload(), 800);
            } catch {
                showToast("Invalid JSON backup file", "error");
            }
        };
        reader.readAsText(file);
    };

    const handleClearData = () => {
        if (!confirm("Are you sure you want to reset all portfolio calculations? This action cannot be undone.")) return;
        const userKey = `wealthCalcData:${email || "guest"}`;
        localStorage.removeItem(userKey);
        showToast("Calculator reset to defaults", "info");
        setTimeout(() => window.location.reload(), 600);
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div 
                className="relative w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Banner */}
                <div className="relative px-8 pt-8 pb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-md"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-5">
                        <div className="relative w-16 h-16 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-black text-2xl shadow-xl ring-4 ring-white/20 shrink-0">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="User" className="w-full h-full rounded-2xl object-cover" />
                            ) : (
                                name.charAt(0).toUpperCase() || "A"
                            )}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-black truncate">{name}</h2>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                    {session ? "Verified Cloud" : "Local Mode"}
                                </span>
                            </div>
                            <p className="text-blue-100 text-sm truncate font-medium mt-0.5">{email || "Local Guest User"}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-blue-200 font-semibold">
                                <span>{savedCount} Saved Assets</span>
                                <span>•</span>
                                <span>Active Currency: <strong className="text-white">{currency} ({symbol})</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
                        {[
                            { id: "profile", label: "Profile & Goals", icon: User },
                            { id: "currency", label: "Currency (INR / USD)", icon: Globe },
                            { id: "data", label: "Backup & Data", icon: Database },
                            { id: "cloud", label: "Sync Status", icon: Shield },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
                                        isActive 
                                            ? "bg-white text-gray-900 shadow-lg scale-[1.02]" 
                                            : "bg-white/10 hover:bg-white/20 text-white"
                                    }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content Body */}
                <div className="p-8 overflow-y-auto flex-1 space-y-6">

                    {/* TAB 1: PROFILE & GOALS */}
                    {activeTab === "profile" && (
                        <div className="space-y-6 animate-in fade-in duration-150">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Investor Profile</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Manage your personal information and financial targets.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Target Net Worth Goal</label>
                                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">{formatAmount(targetGoal)}</span>
                                </div>
                                <div className="relative">
                                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        step="100000"
                                        value={targetGoal}
                                        onChange={(e) => setTargetGoal(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex gap-2 pt-1">
                                    {[5000000, 10000000, 25000000, 50000000].map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setTargetGoal(g)}
                                            className={`px-3 py-1 rounded-lg text-[10px] font-black border transition-all ${
                                                targetGoal === g
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-transparent hover:border-gray-300"
                                            }`}
                                        >
                                            {formatAmount(g, { compact: true })}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Risk Profile</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: "conservative", title: "Conservative", desc: "FDs, Debt (6-8%)" },
                                        { id: "balanced", title: "Balanced", desc: "Nifty ETFs (11-13%)" },
                                        { id: "aggressive", title: "Aggressive", desc: "Midcap & Crypto (15%+)" },
                                    ].map((r) => (
                                        <button
                                            key={r.id}
                                            onClick={() => setRiskProfile(r.id as any)}
                                            className={`p-3 rounded-2xl border text-left transition-all ${
                                                riskProfile === r.id
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md ring-2 ring-blue-500/20"
                                                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-800/50"
                                            }`}
                                        >
                                            <p className="text-xs font-black text-gray-900 dark:text-white">{r.title}</p>
                                            <p className="text-[10px] text-gray-500 font-medium mt-0.5">{r.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    onClick={handleSaveProfile}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Save Profile Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: CURRENCY (INR / USD) */}
                    {activeTab === "currency" && (
                        <div className="space-y-6 animate-in fade-in duration-150">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Currency & Regional Settings</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    Switch seamlessly between Indian Rupee (₹) and US Dollar ($). All calculations and charts adjust instantly.
                                </p>
                            </div>

                            {/* Big Currency Selector Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setCurrency("INR")}
                                    className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                                        currency === "INR"
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg ring-2 ring-blue-500/20"
                                            : "border-gray-200 dark:border-gray-800 hover:border-gray-300 bg-white dark:bg-gray-800/50"
                                    }`}
                                >
                                    {currency === "INR" && (
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center mb-3 shadow-md">
                                        ₹
                                    </div>
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white">Indian Rupee (INR)</h4>
                                    <p className="text-xs text-gray-500 mt-1">Formatted in Lakhs & Crores (en-IN)</p>
                                    <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mt-3">₹10,00,000</p>
                                </button>

                                <button
                                    onClick={() => setCurrency("USD")}
                                    className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                                        currency === "USD"
                                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg ring-2 ring-emerald-500/20"
                                            : "border-gray-200 dark:border-gray-800 hover:border-gray-300 bg-white dark:bg-gray-800/50"
                                    }`}
                                >
                                    {currency === "USD" && (
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mb-3 shadow-md">
                                        $
                                    </div>
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white">US Dollar (USD)</h4>
                                    <p className="text-xs text-gray-500 mt-1">Formatted in Thousands & Millions (en-US)</p>
                                    <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-3">$11,561</p>
                                </button>
                            </div>

                            {/* Exchange Rate Customizer */}
                            <div className="p-5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/60 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black text-gray-900 dark:text-white">USD / INR Exchange Rate</p>
                                        <p className="text-[11px] text-gray-500">Benchmark rate for automatic conversion</p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                        1 USD = ₹{exchangeRate.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={customRate}
                                            onChange={(e) => setCustomRate(e.target.value)}
                                            className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="86.50"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSaveCurrency}
                                        className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black hover:opacity-90 transition-all shrink-0"
                                    >
                                        Update Rate
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                                    <span>Sample Conversion:</span>
                                    <span className="font-mono font-bold text-gray-700 dark:text-gray-300">
                                        ₹10,00,000 INR = ${(1000000 / exchangeRate).toLocaleString("en-US", { maximumFractionDigits: 0 })} USD
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: DATA & BACKUP */}
                    {activeTab === "data" && (
                        <div className="space-y-6 animate-in fade-in duration-150">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Portfolio Data & Backup</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Export, backup or import your financial calculations.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                                            <Download className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-900 dark:text-white">Export Backup</p>
                                            <p className="text-[11px] text-gray-500">Download complete portfolio JSON</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleExportData}
                                        className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                                    >
                                        Download JSON Backup
                                    </button>
                                </div>

                                <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-900 dark:text-white">Import Backup</p>
                                            <p className="text-[11px] text-gray-500">Restore from previously saved JSON</p>
                                        </div>
                                    </div>
                                    <label className="w-full py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                                        <span>Select Backup File</span>
                                        <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-red-600 dark:text-red-400">Reset All Data</p>
                                    <p className="text-[11px] text-gray-500">Clear all local calculations and restore defaults</p>
                                </div>
                                <button
                                    onClick={handleClearData}
                                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all"
                                >
                                    Reset App
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: SYNC & CLOUD STATUS */}
                    {activeTab === "cloud" && (
                        <div className="space-y-6 animate-in fade-in duration-150">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Database & Cloud Sync</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Verify connection status with MongoDB Atlas.</p>
                            </div>

                            <div className={`p-5 rounded-2xl border transition-all ${
                                dbStatus === "connected"
                                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                                    : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${
                                            dbStatus === "connected" ? "bg-green-500 animate-pulse" : "bg-amber-500"
                                        }`} />
                                        <h4 className="text-sm font-black text-gray-900 dark:text-white">
                                            {dbStatus === "connected" ? "Connected to MongoDB Database" : "Database Disconnected"}
                                        </h4>
                                    </div>
                                    <button
                                        onClick={checkDbHealth}
                                        disabled={isCheckingDb}
                                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 transition-all"
                                        title="Refresh status"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isCheckingDb ? "animate-spin" : ""}`} />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                    {dbAdvice}
                                </p>
                            </div>

                            <div className="p-5 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 text-xs text-gray-600 dark:text-gray-400">
                                <p className="font-bold text-gray-900 dark:text-white">Database & Security Architecture:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>User accounts and passwords are saved directly in MongoDB (collection: <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono">users</code>).</li>
                                    <li>Passwords are hashed with 12 rounds of bcrypt before being stored on the database.</li>
                                    <li>Calculations and portfolio models are synchronized with your MongoDB user record.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Bar */}
                <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Award className="w-4 h-4 text-blue-500" />
                        <span>WealthCalc India Pro Edition</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
