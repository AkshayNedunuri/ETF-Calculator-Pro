
"use client";

import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { ArrowUpRight, Wallet, PieChart, TrendingUp, Home, Landmark, CreditCard, Banknote, HelpCircle, Camera } from "lucide-react";
import { AssetType } from "@/utils/calculateReturns";
import { Tooltip } from "../UI/Tooltip";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

interface ResultsSectionProps {
    assetType: AssetType;
    investedAmount: number;
    estimatedReturns: number;
    totalValue: number;
    inflationAdjustedValue?: number;
    propertyValue?: number;
    cumulativeRental?: number;
    emi?: number;
    principalPaid?: number;
    interestPaid?: number;
    outstandingPrincipal?: number;
    targetGoal: number;
    setTargetGoal: (v: number) => void;
}

interface CardProps {
    accent: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    sub?: string;
    highlight?: boolean;
    tooltip?: string;
    index: number;
}

const Card: React.FC<CardProps> = ({ accent, icon, label, value, sub, highlight, tooltip, index }) => {
    const baseVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" }
        }
    };

    if (highlight) {
        return (
            <motion.div 
                variants={baseVariants}
                initial="hidden"
                animate="visible"
                className={`group relative overflow-hidden bg-gradient-to-br ${accent} p-8 rounded-[2.5rem] shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-500`}
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <PieChart className="w-48 h-48 text-white" />
                </div>
                <div className="relative z-10 text-white">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20">{icon}</div>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">{label}</span>
                            {tooltip && (
                                <Tooltip content={tooltip}>
                                    <HelpCircle className="w-4 h-4 text-white/50 hover:text-white transition-colors" />
                                </Tooltip>
                            )}
                        </div>
                    </div>
                    <h3 className="text-4xl font-black mb-2 tracking-tight">{value}</h3>
                    {sub && <p className="text-sm font-bold text-white/70">{sub}</p>}
                </div>
            </motion.div>
        );
    }
    return (
        <motion.div 
            variants={baseVariants}
            initial="hidden"
            animate="visible"
            className={`group relative overflow-hidden glass p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-white/5 border-t-[6px] ${accent}`}
        >
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/20 dark:border-white/5">{icon}</div>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">{label}</span>
                        {tooltip && <Tooltip content={tooltip} />}
                    </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{value}</h3>
                {sub && <p className="text-xs text-gray-400 font-bold flex items-center gap-1 uppercase tracking-wide">{sub}</p>}
            </div>
        </motion.div>
    );
};

export const ResultsSection: React.FC<ResultsSectionProps> = (props) => {
    const { assetType } = props;

    const handleCapture = async () => {
        const element = document.getElementById("results-capture-area");
        if (element) {
            const canvas = await html2canvas(element, { 
                scale: 2, 
                backgroundColor: null,
                logging: false,
                useCORS: true
            });
            const link = document.createElement("a");
            link.download = `WealthCalc-${assetType}-results.jpg`;
            link.href = canvas.toDataURL("image/jpeg", 0.9);
            link.click();
        }
    };

    const renderGoalProgress = () => {
        if (assetType === 'loan') return null;
        
        const progress = Math.min(100, Math.round((props.totalValue / props.targetGoal) * 100));
        
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12 p-8 glass rounded-[2.5rem] border border-white/20 dark:border-white/5"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="space-y-1">
                        <h4 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Milestone Tracking</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">You have achieved {progress}% of your wealth goal.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Goal</p>
                            <p className="text-xl font-black text-purple-600 dark:text-purple-400">{formatCurrency(props.targetGoal)}</p>
                        </div>
                        <button 
                            onClick={() => {
                                const val = prompt("Set your target wealth goal:", props.targetGoal.toString());
                                if (val) props.setTargetGoal(Number(val));
                            }}
                            className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="h-4 w-full bg-gray-100 dark:bg-gray-800/50 rounded-full overflow-hidden p-1 border border-gray-200/50 dark:border-white/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                    />
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Multiplier</span>
                        <span className="text-sm font-black text-blue-700 dark:text-blue-300">{(props.totalValue / (props.investedAmount || 1)).toFixed(2)}x</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 italic">
                        {props.totalValue >= props.targetGoal 
                            ? "🎉 Goal Reached!" 
                            : `${formatCurrency(props.targetGoal - props.totalValue)} remaining`}
                    </p>
                </div>
            </motion.div>
        );
    };

    const renderCards = () => {
        switch (assetType) {
            case 'etf':
            case 'crypto':
                return (<>
                    <Card
                        index={0}
                        accent="border-t-blue-500"
                        icon={<Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                        label="Invested"
                        value={formatCurrency(props.investedAmount)}
                        sub="Principal amount"
                    />
                    <Card
                        index={1}
                        accent="border-t-green-500"
                        icon={<ArrowUpRight className="w-6 h-6 text-green-600 dark:text-green-400" />}
                        label="Est. Returns"
                        value={formatCurrency(props.estimatedReturns)}
                        sub="Wealth gained"
                    />
                    <Card
                        index={2}
                        highlight
                        accent="from-indigo-600 to-purple-700"
                        icon={<PieChart className="w-6 h-6 text-white" />}
                        label="Total Value"
                        value={formatCurrency(props.totalValue)}
                        sub={props.inflationAdjustedValue ? `Real Value: ${formatCurrency(props.inflationAdjustedValue)}` : 'Future value'}
                    />
                </>);
            case 'realestate':
                return (<>
                    <Card
                        index={0}
                        accent="border-t-emerald-500"
                        icon={<Home className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
                        label="Property Value"
                        value={formatCurrency(props.propertyValue ?? props.totalValue)}
                        sub="Appreciated price"
                    />
                    <Card
                        index={1}
                        accent="border-t-cyan-500"
                        icon={<TrendingUp className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />}
                        label="Rental Income"
                        value={formatCurrency(props.cumulativeRental ?? 0)}
                        sub="Total rent earned"
                    />
                    <Card
                        index={2}
                        highlight
                        accent="from-emerald-600 to-teal-600"
                        icon={<PieChart className="w-6 h-6 text-white" />}
                        label="Total Wealth"
                        value={formatCurrency(props.totalValue)}
                        sub="Property + Rental"
                    />
                </>);
            case 'fd':
                return (<>
                    <Card
                        index={0}
                        accent="border-t-sky-500"
                        icon={<Landmark className="w-6 h-6 text-sky-600 dark:text-sky-400" />}
                        label="Principal"
                        value={formatCurrency(props.investedAmount)}
                        sub="Amount deposited"
                    />
                    <Card
                        index={1}
                        accent="border-t-indigo-500"
                        icon={<ArrowUpRight className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                        label="Interest Earned"
                        value={formatCurrency(props.estimatedReturns)}
                        sub="Total interest"
                    />
                    <Card
                        index={2}
                        highlight
                        accent="from-sky-600 to-indigo-700"
                        icon={<PieChart className="w-6 h-6 text-white" />}
                        label="Maturity"
                        value={formatCurrency(props.totalValue)}
                        sub="Principal + Interest"
                    />
                </>);
            case 'loan':
                return (<>
                    <Card
                        index={0}
                        accent="border-t-rose-500"
                        icon={<CreditCard className="w-6 h-6 text-rose-600 dark:text-rose-400" />}
                        label="Monthly EMI"
                        value={formatCurrency(props.emi ?? 0)}
                        sub="Regular payment"
                    />
                    <Card
                        index={1}
                        accent="border-t-purple-500"
                        icon={<Banknote className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                        label="Total Interest"
                        value={formatCurrency(props.interestPaid ?? 0)}
                        sub="Cost of borrowing"
                    />
                    <Card
                        index={2}
                        highlight
                        accent="from-rose-600 to-purple-700"
                        icon={<PieChart className="w-6 h-6 text-white" />}
                        label="Total Outflow"
                        value={formatCurrency(props.totalValue)}
                        sub="Total repayment"
                    />
                </>);
            default:
                return null;
        }
    };

    return (
        <div className="mb-16 relative">
            <div className="flex justify-end mb-6">
                <button 
                    onClick={handleCapture}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 hover:border-blue-500/30 transition-all shadow-sm active:scale-95"
                >
                    <Camera className="w-4 h-4" />
                    Capture Summary
                </button>
            </div>
            
            <div id="results-capture-area">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {renderCards()}
                </div>
                {renderGoalProgress()}
            </div>
        </div>
    );
};
