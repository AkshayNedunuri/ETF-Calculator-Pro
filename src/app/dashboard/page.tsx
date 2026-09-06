
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
    Calculator, 
    TrendingUp, 
    PieChart, 
    Briefcase, 
    ShieldCheck, 
    ArrowRight,
    Search,
    User,
    Settings,
    Bell,
    Trash2,
    CheckCircle
} from "lucide-react";
import { useToast } from "@/components/UI/Toast";
import { PortfolioItem, calculatePortfolio } from "@/utils/calculateReturns";
import { formatCurrency } from "@/utils/formatCurrency";

const AppFeatures = [
    {
        title: "ETF Calculator",
        description: "Calculate potential returns on your ETF investments with SIP and Lumpsum options.",
        icon: Calculator,
        color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        href: "/?view=calculator&asset=etf"
    },
    {
        title: "Portfolio Tracker",
        description: "Maintain a record of all your investments and track cumulative growth.",
        icon: Briefcase,
        color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
        href: "/?view=portfolio"
    },
    {
        title: "Comparison Engine",
        description: "Compare different assets like Real Estate, FD, and Crypto side-by-side.",
        icon: TrendingUp,
        color: "text-green-600 bg-green-50 dark:bg-green-900/20",
        href: "/?view=comparison"
    },
    {
        title: "Inflation Adjustment",
        description: "See the real value of your wealth by adjusting for inflation rates.",
        icon: ShieldCheck,
        color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
        href: "/?view=calculator&inflation=true"
    }
];

export default function DashboardPage() {
    const router = useRouter();
    const { data: session } = useSession();
    
    // Support for Local-Only accounts (Full-stack developer touch)
    const [localUser, setLocalUser] = useState<{name: string, email: string} | null>(null);
    useEffect(() => {
        if (!session) {
            const saved = localStorage.getItem('wealthCalc_localUser');
            if (saved) setLocalUser(JSON.parse(saved));
        }
    }, [session]);

    const userEmail = session?.user?.email || localUser?.email || 'guest';
    const userKey = `wealthCalcData:${userEmail}`;

    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const { showToast } = useToast();

    const fetchCalculations = async () => {
        if (!session?.user?.email) return;
        setIsSyncing(true);
        try {
            const res = await fetch("/api/calculations");
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    // Map MongoDB _id to id for compatibility
                    const mappedData = data.map((item: any) => ({
                        ...item,
                        id: item._id?.toString() || item.id
                    }));
                    setPortfolio(mappedData);
                    // Sync to localStorage as well
                    localStorage.setItem(userKey, JSON.stringify({ portfolio: mappedData }));
                } else {
                    loadFromLocalStorage();
                }
            } else {
                loadFromLocalStorage();
            }
        } catch (error) {
            console.error("Failed to sync with database:", error);
            loadFromLocalStorage();
        } finally {
            setIsSyncing(false);
            setIsLoaded(true);
        }
    };

    const loadFromLocalStorage = () => {
        const savedData = localStorage.getItem(userKey);
        if (savedData) {
            try {
                const p = JSON.parse(savedData);
                setPortfolio(p.portfolio ?? []);
            } catch (e) {
                console.error("Failed to parse saved data", e);
            }
        }
    };

    useEffect(() => {
        if (session) {
            fetchCalculations();
        } else {
            loadFromLocalStorage();
            setIsLoaded(true);
        }
    }, [session, userKey]);

    const portfolioSummary = useMemo(() => {
        if (!isLoaded || portfolio.length === 0) return null;
        return calculatePortfolio(portfolio);
    }, [portfolio, isLoaded]);

    const handleDeleteActivity = async (id: string) => {
        if (!confirm("Are you sure you want to delete this calculation?")) return;
        
        const originalPortfolio = [...portfolio];
        const newPortfolio = portfolio.filter(item => item.id !== id);
        setPortfolio(newPortfolio);
        
        // Update localStorage
        const savedData = localStorage.getItem(userKey);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                data.portfolio = newPortfolio;
                localStorage.setItem(userKey, JSON.stringify(data));
            } catch(e) {}
        }

        // API call if logged in
        if (session) {
            try {
                const res = await fetch("/api/calculations", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id })
                });
                if (res.ok) {
                    showToast("Deleted successfully!");
                } else {
                    throw new Error("Failed to delete from database");
                }
            } catch (error) {
                console.error("Delete sync failed:", error);
                showToast("Deleted locally (Sync failed)", "error");
            }
        } else {
            showToast("Deleted from local storage.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300 font-inter">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                            Investor <span className="text-blue-600 dark:text-blue-500 italic">Dashboard</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            Welcome back! Here's an overview of your wealth building tools.
                        </p>
                        
                        {isLoaded && (
                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-yellow-500 animate-pulse' : (portfolio.length > 0 && session ? 'bg-green-500' : 'bg-orange-500')}`}></div>
                                    <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                        {isSyncing ? 'Syncing...' : (session ? (portfolio.length > 0 ? 'Cloud Active' : 'Cloud Linked') : 'Local Storage Only')}
                                    </span>
                                </div>
                                
                                {session && !isSyncing && (
                                    <button 
                                        onClick={() => fetchCalculations()} 
                                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 dark:text-blue-400 border-b border-blue-600/30 hover:border-blue-600 transition-all"
                                    >
                                        Force Refresh
                                    </button>
                                )}

                                {/* Loophole Fix: Offer to sync local data if it exists and we're logged in */}
                                {session && isLoaded && (() => {
                                    const guestData = localStorage.getItem('wealthCalcData:guest');
                                    if (guestData) {
                                        try {
                                            const parsed = JSON.parse(guestData);
                                            if (parsed.portfolio?.length > 0) {
                                                return (
                                                    <button 
                                                        onClick={async () => {
                                                            if (confirm(`You have ${parsed.portfolio.length} calculations in your guest account. Sync them to ${session.user?.email}?`)) {
                                                                setIsSyncing(true);
                                                                try {
                                                                    for (const item of parsed.portfolio) {
                                                                        await fetch("/api/calculations", {
                                                                            method: "POST",
                                                                            headers: { "Content-Type": "application/json" },
                                                                            body: JSON.stringify(item)
                                                                        });
                                                                    }
                                                                    localStorage.removeItem('wealthCalcData:guest');
                                                                    fetchCalculations();
                                                                    showToast("Guest data merged successfully!");
                                                                } catch (e) {
                                                                    showToast("Partial sync failed", "error");
                                                                } finally {
                                                                    setIsSyncing(false);
                                                                }
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-orange-200 transition-all border border-orange-200/50"
                                                    >
                                                        Sync Guest Data
                                                    </button>
                                                );
                                            }
                                        } catch(e) {}
                                    }
                                    return null;
                                })()}
                            </div>
                        )}
                    </div>

                    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-blue-600 font-black shadow-sm hover:shadow-lg hover:translate-y-[-2px] transition-all">
                            <Calculator className="w-5 h-5" />
                            Open Calculator
                        </Link>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Tools Overview */}
                    <div className="lg:col-span-8 space-y-8">
                        {portfolio.length === 0 && (
                            <div className="p-8 bg-blue-600 text-white rounded-3xl shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl font-black mb-2 tracking-tight">Step into your future</h3>
                                        <p className="text-blue-100 font-medium mb-6">You haven't saved any calculations yet. Start by exploring our powerful financial tools below.</p>
                                        <Link href="/" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
                                            Open Calculator <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                    <div className="w-full md:w-1/3 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                                        <p className="text-xs font-black uppercase tracking-widest text-blue-200 mb-4">Checklist</p>
                                        <div className="space-y-3">
                                            {[
                                                { text: "Calculate SIP returns", done: false },
                                                { text: "Add to portfolio", done: false },
                                                { text: "Compare with Crypto", done: false }
                                            ].map((task, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-md border border-white/30 flex items-center justify-center ${task.done ? 'bg-white text-blue-600' : 'bg-white/5'}`}>
                                                        {task.done && <CheckCircle className="w-3.5 h-3.5" />}
                                                    </div>
                                                    <span className={`text-sm font-medium ${task.done ? 'text-white line-through opacity-50' : 'text-blue-50'}`}>{task.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {AppFeatures.map((feature, i) => (
                                <Link 
                                    key={i} 
                                    href={feature.href}
                                    className="group p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300"
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${feature.color}`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                        {feature.title}
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                        {feature.description}
                                    </p>
                                </Link>
                            ))}
                        </div>

                        {/* App Summary / Analytics Mockup */}
                        <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">
                                Wealth <span className="text-blue-600 italic">Insights</span>
                            </h3>
                            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                                {portfolio.length === 0 ? (
                                    <>
                                        <PieChart className="w-12 h-12 text-gray-200 dark:text-gray-700" />
                                        <div className="space-y-1">
                                            <p className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-xs">No data recorded</p>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">Start by adding your investments in the calculator to see your wealth distribution here.</p>
                                        </div>
                                        <Link href="/" className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-full text-sm hover:shadow-lg transition-all">
                                            Start Calculating
                                        </Link>
                                    </>
                                ) : (
                                    <div className="w-full flex flex-col items-center justify-center h-full gap-4">
                                        <TrendingUp className="w-12 h-12 text-blue-500" />
                                        <p className="text-gray-900 dark:text-white font-bold text-xl">Your portfolio is growing!</p>
                                        <p className="text-gray-500 text-sm">You have {portfolio.length} saved projections.</p>
                                        <Link href="/?view=portfolio" className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-full text-sm hover:shadow-lg transition-all">
                                            View Full Analytics
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: User Profile & Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Profile Section */}
                        <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-3xl shadow-xl text-white">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 truncate overflow-hidden">
                                    {session?.user?.image ? (
                                        <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black truncate max-w-[150px]">{session?.user?.name || localUser?.name || "User"}</h2>
                                    <p className="text-blue-100/80 font-medium text-sm">{session ? 'Premium Member' : 'Local Mode'}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4 py-6 border-y border-white/10 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-100/60 text-sm">Saved Projections</span>
                                    <span className="font-black">{isLoaded ? portfolio.length : '-'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-100/60 text-sm">Est. Total Value</span>
                                    <span className="font-black text-lg">
                                        {isLoaded ? (portfolioSummary && portfolioSummary.length > 0 ? formatCurrency(portfolioSummary[portfolioSummary.length - 1].netWorth) : '₹0') : '-'}
                                    </span>
                                </div>
                            </div>

                            <Link href="/?view=portfolio" className="w-full block text-center py-4 bg-white text-blue-600 font-black rounded-2xl shadow-lg hover:shadow-black/10 hover:translate-y-[-2px] transition-all transform duration-200">
                                View Full Report
                            </Link>
                        </div>

                        {/* Recent Activity */}
                        <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                            </div>
                            
                            <div className="space-y-4">
                                {isLoaded && portfolio.length === 0 ? (
                                    <p className="text-sm text-gray-500 py-4 text-center">No recent calculations. Go to the Calculator to save your first projection!</p>
                                ) : (
                                    portfolio.slice().reverse().slice(0, 5).map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center group p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <div className="w-2 h-10 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                                            <div 
                                                className="flex-1 cursor-pointer overflow-hidden" 
                                                onClick={() => router.push(`/?loadId=${item.id}`)}
                                            >
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors" title={item.label}>
                                                    {item.label}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                                                    {item.config?.assetType || 'Asset'} Projection
                                                </p>
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteActivity(item.id);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                                                title="Delete Calculation"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                                
                                {isLoaded && portfolio.length > 5 && (
                                    <Link href="/?view=portfolio" className="block text-center text-sm font-bold text-blue-600 hover:underline pt-2">
                                        View all {portfolio.length} activities
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="max-w-7xl mx-auto px-4 py-10 text-center text-gray-400 dark:text-gray-600 text-xs border-t border-gray-100 dark:border-gray-900 mt-12">
                <p>© {new Date().getFullYear()} WealthCalc India Dashboard. Empowering your financial future.</p>
            </footer>
        </div>
    );
}
