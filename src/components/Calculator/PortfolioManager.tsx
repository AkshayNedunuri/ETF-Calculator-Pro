
"use client";

import React from "react";
import { PortfolioItem, calculateReturns } from "@/utils/calculateReturns";
import { ASSET_CONFIGS } from "@/utils/assetConfig";
import { Trash2, Edit3, Plus, Briefcase } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

interface PortfolioManagerProps {
    items: PortfolioItem[];
    onRemove: (id: string) => void;
    onEdit: (item: PortfolioItem) => void;
    onAddCurrent: () => void;
}

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({ items, onRemove, onEdit, onAddCurrent }) => {
    return (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col h-[700px]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">My Portfolio</h2>
                </div>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-lg">
                    {items.length} Items
                </span>
            </div>

            {items.length > 0 && (() => {
                const hasLoans = items.some(item => item.config.assetType === 'loan');
                const hasAssets = items.some(item => item.config.assetType !== 'loan');

                const totalAssets = items.reduce((sum, item) => {
                    if (item.config.assetType === 'loan') return sum;
                    const lastResult = calculateReturns(item.config).slice(-1)[0];
                    return sum + (lastResult?.totalValue || 0);
                }, 0);

                const totalInvestedAssets = items.reduce((sum, item) => {
                    if (item.config.assetType === 'loan') return sum;
                    const initial = item.config.initialInvestment || item.config.propertyValue || item.config.fdPrincipal || 0;
                    return sum + initial;
                }, 0);

                const totalLiabilities = items.reduce((sum, item) => {
                    if (item.config.assetType !== 'loan') return sum;
                    return sum + (item.config.loanAmount || 0);
                }, 0);

                const totalLoanPayable = items.reduce((sum, item) => {
                    if (item.config.assetType !== 'loan') return sum;
                    const lastResult = calculateReturns(item.config).slice(-1)[0];
                    return sum + (lastResult?.totalValue || 0);
                }, 0);

                const totalLoanInterest = totalLoanPayable - totalLiabilities;
                const netWorth = totalAssets - totalLiabilities;
                const assetGains = totalAssets - totalInvestedAssets;
                const gainPercent = totalInvestedAssets > 0 ? (assetGains / totalInvestedAssets) * 100 : 0;

                if (!hasAssets && hasLoans) {
                    return (
                        <div className="mb-6 p-5 rounded-3xl bg-gradient-to-br from-rose-900 via-gray-900 to-gray-800 text-white shadow-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1">Total Loan Liabilities</p>
                                    <h3 className="text-3xl font-black tracking-tight">{formatCurrency(totalLiabilities)}</h3>
                                </div>
                                <div className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-rose-500/20 text-rose-300">
                                    Liability
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Interest Cost</p>
                                    <p className="text-sm font-bold text-rose-400">{formatCurrency(totalLoanInterest)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Total Payable</p>
                                    <p className="text-sm font-bold">{formatCurrency(totalLoanPayable)}</p>
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="mb-6 p-5 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-blue-600 dark:to-indigo-700 text-white shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1">
                                    {hasLoans ? 'Net Projected Value' : 'Total Projected'}
                                </p>
                                <h3 className="text-3xl font-black tracking-tight">
                                    {formatCurrency(hasLoans ? netWorth : totalAssets)}
                                </h3>
                            </div>
                            <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${gainPercent >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-rose-500/20 text-rose-300'}`}>
                                {gainPercent >= 0 ? `+${gainPercent.toFixed(1)}%` : `${gainPercent.toFixed(1)}%`}
                            </div>
                        </div>
                        <div className={`grid ${hasLoans ? 'grid-cols-3' : 'grid-cols-2'} gap-3 pt-4 border-t border-white/10`}>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Invested</p>
                                <p className="text-sm font-bold">{formatCurrency(totalInvestedAssets)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Est. Gains</p>
                                <p className="text-sm font-bold text-green-400">{formatCurrency(assetGains)}</p>
                            </div>
                            {hasLoans && (
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Liabilities</p>
                                    <p className="text-sm font-bold text-rose-300">{formatCurrency(totalLiabilities)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })()}

            <button
                onClick={onAddCurrent}
                className="w-full mb-6 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group font-semibold"
            >
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Add Current to Portfolio
            </button>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 space-y-3">
                {items.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-400 text-sm">Your portfolio is empty.</p>
                        <p className="text-xs text-gray-500 mt-1">Configure an asset and click "Add" to start tracking!</p>
                    </div>
                ) : (
                    items.map((item) => {
                        const config = ASSET_CONFIGS[item.config.assetType];
                        const isLoan = item.config.assetType === 'loan';
                        const amount = isLoan ? item.config.loanAmount : (item.config.initialInvestment || item.config.propertyValue || item.config.fdPrincipal || 0);

                        return (
                            <div
                                key={item.id}
                                className="group p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        <div className="relative">
                                            <div className="text-2xl mt-1">{config.emoji}</div>
                                            <div
                                                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"
                                                style={{ backgroundColor: item.color || '#3b82f6' }}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm leading-tight">
                                                    {item.label}
                                                </h4>
                                                {!isLoan ? (
                                                    <span className="text-[10px] font-black text-green-500">
                                                        {formatCurrency(calculateReturns(item.config).slice(-1)[0]?.totalValue || 0)}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-black text-rose-500">
                                                        -{formatCurrency(item.config.loanAmount || 0)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                                                {config.label} • {formatCurrency(amount ?? 0)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => onRemove(item.id)}
                                            className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
