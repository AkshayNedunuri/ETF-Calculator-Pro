
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/UI/Toast";
import Navbar from "@/components/Header";
import { AssetSelector } from "@/components/Calculator/AssetSelector";
import { InputSection } from "@/components/Calculator/InputSection";
import { ResultsSection } from "@/components/Calculator/ResultsSection";
import { ChartsSection } from "@/components/Calculator/ChartsSection";
import { calculateReturns, calculateEMI, calculatePortfolio, CalculationResult, AssetType, PortfolioItem, PortfolioYearSummary } from "@/utils/calculateReturns";
import { ASSET_CONFIGS } from "@/utils/assetConfig";
import { Download, Share2, RefreshCw, Plus } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { DashboardNav, ViewMode } from "@/components/Calculator/DashboardNav";
import { PortfolioDashboard } from "@/components/Calculator/PortfolioDashboard";
import { ComparisonDashboard } from "@/components/Calculator/ComparisonDashboard";
import { PortfolioManager } from "@/components/Calculator/PortfolioManager";
import { motion, AnimatePresence } from "framer-motion";

// Static map — Tailwind JIT cannot resolve dynamically interpolated class names
const blurbHeadingClass: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    teal: 'text-teal-600 dark:text-teal-400',
    sky: 'text-sky-600 dark:text-sky-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    rose: 'text-rose-600 dark:text-rose-400',
    pink: 'text-pink-600 dark:text-pink-400',
};

const DEFAULTS = {
    assetType: 'etf' as AssetType,
    // ETF / Crypto
    initialInvestment: 100000,
    monthlyInvestment: 10000,
    annualReturnRate: 12,
    years: 10,
    inflationRate: 6,
    stepUpPercentage: 0,
    expenseRatio: 0.5,
    showInflation: false,
    // Real estate
    propertyValue: 5000000,
    rentalYield: 3,
    appreciationRate: 8,
    // FD
    fdPrincipal: 100000,
    fdRate: 7,
    fdTenureMonths: 60,
    compoundingFrequency: 4,
    // Loan
    loanAmount: 1000000,
    loanRate: 10,
    loanTenureMonths: 240,
};

export default function Home() {
    const { data: session } = useSession();
    const { showToast } = useToast();
    // Key localStorage by user email so each Google account has isolated data
    const userKey = `wealthCalcData:${session?.user?.email ?? 'guest'}`;

    const [assetType, setAssetType] = useState<AssetType>(DEFAULTS.assetType);

    // ETF / Crypto
    const [initialInvestment, setInitialInvestment] = useState(DEFAULTS.initialInvestment);
    const [monthlyInvestment, setMonthlyInvestment] = useState(DEFAULTS.monthlyInvestment);
    const [annualReturnRate, setAnnualReturnRate] = useState(DEFAULTS.annualReturnRate);
    const [years, setYears] = useState(DEFAULTS.years);
    const [inflationRate, setInflationRate] = useState(DEFAULTS.inflationRate);
    const [stepUpPercentage, setStepUpPercentage] = useState(DEFAULTS.stepUpPercentage);
    const [expenseRatio, setExpenseRatio] = useState(DEFAULTS.expenseRatio);
    const [showInflation, setShowInflation] = useState(DEFAULTS.showInflation);

    // Real estate
    const [propertyValue, setPropertyValue] = useState(DEFAULTS.propertyValue);
    const [rentalYield, setRentalYield] = useState(DEFAULTS.rentalYield);
    const [appreciationRate, setAppreciationRate] = useState(DEFAULTS.appreciationRate);

    // FD
    const [fdPrincipal, setFdPrincipal] = useState(DEFAULTS.fdPrincipal);
    const [fdRate, setFdRate] = useState(DEFAULTS.fdRate);
    const [fdTenureMonths, setFdTenureMonths] = useState(DEFAULTS.fdTenureMonths);
    const [compoundingFrequency, setCompoundingFrequency] = useState(DEFAULTS.compoundingFrequency);

    // Loan
    const [loanAmount, setLoanAmount] = useState(DEFAULTS.loanAmount);
    const [loanRate, setLoanRate] = useState(DEFAULTS.loanRate);
    const [loanTenureMonths, setLoanTenureMonths] = useState(DEFAULTS.loanTenureMonths);

    // Portfolio State
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [activeView, setActiveView] = useState<ViewMode>('calculator');
    const [targetGoal, setTargetGoal] = useState(10000000); // Default 1 Crore
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage — re-runs when the user logs in/out (userKey changes)
    useEffect(() => {
        setIsLoaded(false);
        const savedData = localStorage.getItem(userKey);
        let loadedPortfolio: PortfolioItem[] = [];

        if (savedData) {
            try {
                const p = JSON.parse(savedData);
                setAssetType(p.assetType ?? DEFAULTS.assetType);
                setInitialInvestment(p.initialInvestment ?? DEFAULTS.initialInvestment);
                setMonthlyInvestment(p.monthlyInvestment ?? DEFAULTS.monthlyInvestment);
                setAnnualReturnRate(p.annualReturnRate ?? DEFAULTS.annualReturnRate);
                setYears(p.years ?? DEFAULTS.years);
                setInflationRate(p.inflationRate ?? DEFAULTS.inflationRate);
                setStepUpPercentage(p.stepUpPercentage ?? DEFAULTS.stepUpPercentage);
                setExpenseRatio(p.expenseRatio ?? DEFAULTS.expenseRatio);
                setShowInflation(p.showInflation ?? DEFAULTS.showInflation);
                setPropertyValue(p.propertyValue ?? DEFAULTS.propertyValue);
                setRentalYield(p.rentalYield ?? DEFAULTS.rentalYield);
                setAppreciationRate(p.appreciationRate ?? DEFAULTS.appreciationRate);
                setFdPrincipal(p.fdPrincipal ?? DEFAULTS.fdPrincipal);
                setFdRate(p.fdRate ?? DEFAULTS.fdRate);
                setFdTenureMonths(p.fdTenureMonths ?? DEFAULTS.fdTenureMonths);
                setCompoundingFrequency(p.compoundingFrequency ?? DEFAULTS.compoundingFrequency);
                setLoanAmount(p.loanAmount ?? DEFAULTS.loanAmount);
                setLoanRate(p.loanRate ?? DEFAULTS.loanRate);
                setLoanTenureMonths(p.loanTenureMonths ?? DEFAULTS.loanTenureMonths);
                setPortfolio(p.portfolio ?? []);
                setActiveView(p.activeView ?? 'calculator');
                setTargetGoal(p.targetGoal ?? 10000000);
                loadedPortfolio = p.portfolio ?? [];
            } catch (e) {
                console.error("Failed to parse saved data", e);
            }
        } else {
            // No saved data for this user — reset to defaults
            setAssetType(DEFAULTS.assetType);
            setInitialInvestment(DEFAULTS.initialInvestment);
            setMonthlyInvestment(DEFAULTS.monthlyInvestment);
            setAnnualReturnRate(DEFAULTS.annualReturnRate);
            setYears(DEFAULTS.years);
            setInflationRate(DEFAULTS.inflationRate);
            setStepUpPercentage(DEFAULTS.stepUpPercentage);
            setExpenseRatio(DEFAULTS.expenseRatio);
            setShowInflation(DEFAULTS.showInflation);
            setPropertyValue(DEFAULTS.propertyValue);
            setRentalYield(DEFAULTS.rentalYield);
            setAppreciationRate(DEFAULTS.appreciationRate);
            setFdPrincipal(DEFAULTS.fdPrincipal);
            setFdRate(DEFAULTS.fdRate);
            setFdTenureMonths(DEFAULTS.fdTenureMonths);
            setCompoundingFrequency(DEFAULTS.compoundingFrequency);
            setLoanAmount(DEFAULTS.loanAmount);
            setLoanRate(DEFAULTS.loanRate);
            setLoanTenureMonths(DEFAULTS.loanTenureMonths);
            setPortfolio([]);
            setActiveView('calculator');
        }

        // Handle loading from dashboard or direct links via URL parameters
        const urlParams = new URLSearchParams(window.location.search);

        const viewParam = urlParams.get('view');
        if (viewParam === 'calculator' || viewParam === 'portfolio' || viewParam === 'comparison') {
            setActiveView(viewParam as ViewMode);
        }

        const assetParam = urlParams.get('asset');
        if (assetParam === 'etf' || assetParam === 'crypto' || assetParam === 'realestate' || assetParam === 'fd' || assetParam === 'loan') {
            setAssetType(assetParam);
        }

        const inflationParam = urlParams.get('inflation');
        if (inflationParam === 'true') {
            setShowInflation(true);
        }

        const loadId = urlParams.get('loadId');
        if (loadId && loadedPortfolio.length > 0) {
            const itemToLoad = loadedPortfolio.find(item => item.id === loadId);
            if (itemToLoad) {
                const { config: c } = itemToLoad;
                setAssetType(c.assetType);
                if (c.initialInvestment !== undefined) setInitialInvestment(c.initialInvestment);
                if (c.monthlyInvestment !== undefined) setMonthlyInvestment(c.monthlyInvestment);
                if (c.annualReturnRate !== undefined) setAnnualReturnRate(c.annualReturnRate);
                if (c.years !== undefined) setYears(c.years);
                if (c.inflationRate !== undefined) {
                    setInflationRate(c.inflationRate);
                    setShowInflation(c.inflationRate > 0);
                }
                if (c.stepUpPercentage !== undefined) setStepUpPercentage(c.stepUpPercentage);
                if (c.expenseRatio !== undefined) setExpenseRatio(c.expenseRatio);
                if (c.propertyValue !== undefined) setPropertyValue(c.propertyValue);
                if (c.rentalYield !== undefined) setRentalYield(c.rentalYield);
                if (c.appreciationRate !== undefined) setAppreciationRate(c.appreciationRate);
                if (c.fdPrincipal !== undefined) setFdPrincipal(c.fdPrincipal);
                if (c.fdRate !== undefined) setFdRate(c.fdRate);
                if (c.fdTenureMonths !== undefined) setFdTenureMonths(c.fdTenureMonths);
                if (c.compoundingFrequency !== undefined) setCompoundingFrequency(c.compoundingFrequency);
                if (c.loanAmount !== undefined) setLoanAmount(c.loanAmount);
                if (c.loanRate !== undefined) setLoanRate(c.loanRate);
                if (c.loanTenureMonths !== undefined) setLoanTenureMonths(c.loanTenureMonths);
                setActiveView('calculator');

                // Clear URL param to prevent reload issues later
                window.history.replaceState({}, '', '/');
            }
        }

        setIsLoaded(true);
    }, [userKey]);

    // Save to LocalStorage — keyed by user so each Google account's data is isolated
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem(userKey, JSON.stringify({
            assetType, initialInvestment, monthlyInvestment, annualReturnRate, years,
            inflationRate, stepUpPercentage, expenseRatio, showInflation,
            propertyValue, rentalYield, appreciationRate,
            fdPrincipal, fdRate, fdTenureMonths, compoundingFrequency,
            loanAmount, loanRate, loanTenureMonths,
            portfolio, activeView, targetGoal
        }));
    }, [
        assetType, initialInvestment, monthlyInvestment, annualReturnRate, years,
        inflationRate, stepUpPercentage, expenseRatio, showInflation,
        propertyValue, rentalYield, appreciationRate,
        fdPrincipal, fdRate, fdTenureMonths, compoundingFrequency,
        loanAmount, loanRate, loanTenureMonths,
        portfolio, activeView, targetGoal, isLoaded,
    ]);

    // Calculations
    const results: CalculationResult[] = useMemo(() => {
        return calculateReturns({
            assetType,
            initialInvestment,
            monthlyInvestment,
            annualReturnRate,
            years,
            inflationRate: showInflation ? inflationRate : 0,
            stepUpPercentage,
            expenseRatio,
            propertyValue,
            rentalYield,
            appreciationRate,
            fdPrincipal,
            fdRate,
            fdTenureMonths,
            compoundingFrequency,
            loanAmount,
            loanRate,
            loanTenureMonths,
        });
    }, [
        assetType, initialInvestment, monthlyInvestment, annualReturnRate, years,
        inflationRate, stepUpPercentage, expenseRatio, showInflation,
        propertyValue, rentalYield, appreciationRate,
        fdPrincipal, fdRate, fdTenureMonths, compoundingFrequency,
        loanAmount, loanRate, loanTenureMonths,
    ]);

    const finalResult = results[results.length - 1] || {
        investedAmount: 0, estimatedReturns: 0, totalValue: 0,
        inflationAdjustedValue: 0, propertyValue: 0, cumulativeRental: 0,
        emi: 0, principalPaid: 0, interestPaid: 0, outstandingPrincipal: 0,
    };

    const emi = useMemo(() =>
        assetType === 'loan' ? calculateEMI(loanAmount, loanRate, loanTenureMonths) : 0,
        [assetType, loanAmount, loanRate, loanTenureMonths]
    );

    // Portfolio Summary Calculation
    const portfolioSummary = useMemo(() => {
        return calculatePortfolio(portfolio);
    }, [portfolio]);

    const itemAssetTypes = useMemo(() => {
        const mapping: Record<string, AssetType> = {};
        portfolio.forEach(item => mapping[item.id] = item.config.assetType);
        return mapping;
    }, [portfolio]);

    const handleAddToPortfolio = async () => {
        const label = prompt("Enter a label for this investment/loan:", `${ASSET_CONFIGS[assetType].label} ${new Date().toLocaleDateString()}`);
        if (!label) return;

        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
        const color = colors[portfolio.length % colors.length];

        const newItem: PortfolioItem = {
            id: Date.now().toString(),
            label,
            color,
            config: {
                assetType, initialInvestment, monthlyInvestment, annualReturnRate, years,
                inflationRate: showInflation ? inflationRate : 0,
                stepUpPercentage, expenseRatio, propertyValue, rentalYield, appreciationRate,
                fdPrincipal, fdRate, fdTenureMonths, compoundingFrequency,
                loanAmount, loanRate, loanTenureMonths
            }
        };

        const newPortfolio = [...portfolio, newItem];
        setPortfolio(newPortfolio);

        // API call if logged in
        if (session) {
            try {
                const res = await fetch("/api/calculations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newItem)
                });
                if (!res.ok) throw new Error("Failed to save to database");
                showToast("Added to portfolio Holla! Synced to cloud.");
            } catch (error) {
                console.error("Save sync failed:", error);
                showToast("Added to portfolio locally (Cloud sync failed)", "error");
            }
        } else {
            showToast("Added to portfolio!");
        }
    };

    const handleRemoveFromPortfolio = (id: string) => {
        if (confirm("Remove this item from your portfolio?")) {
            setPortfolio(portfolio.filter(item => item.id !== id));
        }
    };

    const handleEditPortfolioItem = (item: PortfolioItem) => {
        const { config: c } = item;
        setAssetType(c.assetType);
        if (c.initialInvestment !== undefined) setInitialInvestment(c.initialInvestment);
        if (c.monthlyInvestment !== undefined) setMonthlyInvestment(c.monthlyInvestment);
        if (c.annualReturnRate !== undefined) setAnnualReturnRate(c.annualReturnRate);
        if (c.years !== undefined) setYears(c.years);
        if (c.inflationRate !== undefined) {
            setInflationRate(c.inflationRate);
            setShowInflation(c.inflationRate > 0);
        }
        if (c.stepUpPercentage !== undefined) setStepUpPercentage(c.stepUpPercentage);
        if (c.expenseRatio !== undefined) setExpenseRatio(c.expenseRatio);
        if (c.propertyValue !== undefined) setPropertyValue(c.propertyValue);
        if (c.rentalYield !== undefined) setRentalYield(c.rentalYield);
        if (c.appreciationRate !== undefined) setAppreciationRate(c.appreciationRate);
        if (c.fdPrincipal !== undefined) setFdPrincipal(c.fdPrincipal);
        if (c.fdRate !== undefined) setFdRate(c.fdRate);
        if (c.fdTenureMonths !== undefined) setFdTenureMonths(c.fdTenureMonths);
        if (c.compoundingFrequency !== undefined) setCompoundingFrequency(c.compoundingFrequency);
        if (c.loanAmount !== undefined) setLoanAmount(c.loanAmount);
        if (c.loanRate !== undefined) setLoanRate(c.loanRate);
        if (c.loanTenureMonths !== undefined) setLoanTenureMonths(c.loanTenureMonths);

        setActiveView('calculator');
    };

    const config = ASSET_CONFIGS[assetType];

    const handleReset = () => {
        setInitialInvestment(DEFAULTS.initialInvestment);
        setMonthlyInvestment(DEFAULTS.monthlyInvestment);
        setAnnualReturnRate(DEFAULTS.annualReturnRate);
        setYears(DEFAULTS.years);
        setInflationRate(DEFAULTS.inflationRate);
        setStepUpPercentage(DEFAULTS.stepUpPercentage);
        setExpenseRatio(DEFAULTS.expenseRatio);
        setShowInflation(DEFAULTS.showInflation);
        setPropertyValue(DEFAULTS.propertyValue);
        setRentalYield(DEFAULTS.rentalYield);
        setAppreciationRate(DEFAULTS.appreciationRate);
        setFdPrincipal(DEFAULTS.fdPrincipal);
        setFdRate(DEFAULTS.fdRate);
        setFdTenureMonths(DEFAULTS.fdTenureMonths);
        setCompoundingFrequency(DEFAULTS.compoundingFrequency);
        setLoanAmount(DEFAULTS.loanAmount);
        setLoanRate(DEFAULTS.loanRate);
        setLoanTenureMonths(DEFAULTS.loanTenureMonths);
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById("calculator-content");
        if (element) {
            try {
                const canvas = await html2canvas(element, { scale: 1.5, useCORS: true, logging: false });
                const imgData = canvas.toDataURL("image/jpeg", 0.7);
                const pdf = new jsPDF("p", "mm", "a4");
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${activeView === 'calculator' ? assetType : activeView}-report.pdf`);
                showToast("Report downloaded successfully!");
            } catch (error) {
                console.error("Error generating PDF", error);
                showToast("Failed to generate PDF. Please try again.", "error");
            }
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'WealthCalc India',
                text: `Check out my ${config.label} investment projection!`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast("Link copied to clipboard!", "info");
        }
    };

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen transition-colors duration-500 font-inter relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 relative">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase">
                        Financial Planning Reimagined
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                        WealthCalc <span className="gradient-text">India</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        {activeView === 'calculator'
                            ? config.description
                            : activeView === 'comparison'
                                ? "Side-by-side growth comparison of all your added assets."
                                : "The power of compounding across your entire financial life."}
                    </p>
                </motion.div>

                <DashboardNav
                    activeView={activeView}
                    onViewChange={setActiveView}
                    portfolioCount={portfolio.length}
                />

                <div id="calculator-content" className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView + (activeView === 'calculator' ? assetType : '')}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            {activeView === 'calculator' && (
                                <>
                                    <div className="mb-12">
                                        <AssetSelector selected={assetType} onSelect={setAssetType} />
                                    </div>

                                    <ResultsSection
                                        assetType={assetType}
                                        investedAmount={finalResult.investedAmount}
                                        estimatedReturns={finalResult.estimatedReturns}
                                        totalValue={finalResult.totalValue}
                                        inflationAdjustedValue={showInflation ? finalResult.inflationAdjustedValue : undefined}
                                        propertyValue={finalResult.propertyValue}
                                        cumulativeRental={finalResult.cumulativeRental}
                                        emi={emi}
                                        principalPaid={finalResult.principalPaid}
                                        interestPaid={finalResult.interestPaid}
                                        outstandingPrincipal={finalResult.outstandingPrincipal}
                                        targetGoal={targetGoal}
                                        setTargetGoal={setTargetGoal}
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        {/* Left Side: Controls */}
                                        <div className="lg:col-span-4 space-y-7">
                                            <InputSection
                                                assetType={assetType}
                                                initialInvestment={initialInvestment} setInitialInvestment={setInitialInvestment}
                                                monthlyInvestment={monthlyInvestment} setMonthlyInvestment={setMonthlyInvestment}
                                                annualReturnRate={annualReturnRate} setAnnualReturnRate={setAnnualReturnRate}
                                                years={years} setYears={setYears}
                                                inflationRate={inflationRate} setInflationRate={setInflationRate}
                                                stepUpPercentage={stepUpPercentage} setStepUpPercentage={setStepUpPercentage}
                                                expenseRatio={expenseRatio} setExpenseRatio={setExpenseRatio}
                                                showInflation={showInflation} setShowInflation={setShowInflation}
                                                propertyValue={propertyValue} setPropertyValue={setPropertyValue}
                                                rentalYield={rentalYield} setRentalYield={setRentalYield}
                                                appreciationRate={appreciationRate} setAppreciationRate={setAppreciationRate}
                                                fdPrincipal={fdPrincipal} setFdPrincipal={setFdPrincipal}
                                                fdRate={fdRate} setFdRate={setFdRate}
                                                fdTenureMonths={fdTenureMonths} setFdTenureMonths={setFdTenureMonths}
                                                compoundingFrequency={compoundingFrequency} setCompoundingFrequency={setCompoundingFrequency}
                                                loanAmount={loanAmount} setLoanAmount={setLoanAmount}
                                                loanRate={loanRate} setLoanRate={setLoanRate}
                                                loanTenureMonths={loanTenureMonths} setLoanTenureMonths={setLoanTenureMonths}
                                            />

                                            {/* Action Buttons */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <button onClick={handleReset} className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all font-medium">
                                                    <RefreshCw className="w-4 h-4" /> Reset
                                                </button>
                                                <button onClick={handleShare} className="flex items-center justify-center gap-2 px-4 py-3 border border-blue-100 dark:border-blue-900 rounded-xl text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all font-medium">
                                                    <Share2 className="w-4 h-4" /> Share
                                                </button>
                                            </div>

                                            <button
                                                onClick={handleAddToPortfolio}
                                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-bold hover:shadow-lg hover:translate-y-[-2px] transition-all transform duration-200"
                                            >
                                                <Plus className="w-5 h-5" /> Add to Portfolio
                                            </button>

                                            <button onClick={handleDownloadPDF} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:shadow-lg hover:translate-y-[-2px] transition-all transform duration-200">
                                                <Download className="w-5 h-5" /> Download Report
                                            </button>
                                        </div>

                                        {/* Right Side: Chart & Info */}
                                        <div className="lg:col-span-8 space-y-8">
                                            <ChartsSection
                                                assetType={assetType}
                                                data={results}
                                                investedAmount={finalResult.investedAmount}
                                                estimatedReturns={finalResult.estimatedReturns}
                                                showInflation={showInflation}
                                            />

                                            {/* Info blurbs */}
                                            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                                    Understanding {config.label} Investment
                                                </h3>
                                                <div className="grid md:grid-cols-3 gap-6 text-sm mb-8">
                                                    {config.infoBlurbs.map((blurb, i) => (
                                                        <div key={i} className="space-y-2">
                                                            <h4 className={`font-semibold ${blurbHeadingClass[blurb.color] ?? 'text-gray-600 dark:text-gray-400'}`}>
                                                                {blurb.title}
                                                            </h4>
                                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{blurb.body}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center">
                                                        Disclaimer: This tool is for educational purposes only. Past performance is not indicative of future returns.
                                                        Investment projections are estimates based on your inputs and do not guarantee actual results.
                                                    </p>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </>
                            )}

                            {activeView === 'comparison' && (
                                <ComparisonDashboard items={portfolio} />
                            )}

                            {activeView === 'portfolio' && (
                                <PortfolioDashboard
                                    data={portfolioSummary}
                                    items={portfolio}
                                    itemAssetTypes={itemAssetTypes}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20 py-10">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} WealthCalc India. Built for smart investors.</p>
                </div>
            </footer>
        </div>
    );
}
