
"use client";

import React from "react";
import { AssetType } from "@/utils/calculateReturns";
import { ASSET_CONFIGS } from "@/utils/assetConfig";
import { motion, AnimatePresence } from "framer-motion";

interface AssetSelectorProps {
    selected: AssetType;
    onSelect: (asset: AssetType) => void;
}

const ASSETS: AssetType[] = ['etf', 'crypto', 'realestate', 'fd', 'loan'];

const ACCENT_CLASSES: Record<AssetType, string> = {
    etf: 'bg-blue-600 text-white shadow-blue-200 dark:shadow-blue-900/40',
    crypto: 'bg-orange-500 text-white shadow-orange-200 dark:shadow-orange-900/40',
    realestate: 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/40',
    fd: 'bg-sky-600 text-white shadow-sky-200 dark:shadow-sky-900/40',
    loan: 'bg-rose-600 text-white shadow-rose-200 dark:shadow-rose-900/40',
};

export const AssetSelector: React.FC<AssetSelectorProps> = ({ selected, onSelect }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2rem] shadow-2xl border border-white/20 dark:border-white/5 p-2"
        >
            <div className="flex gap-1 overflow-x-auto scrollbar-hide no-scrollbar">
                {ASSETS.map((asset) => {
                    const config = ASSET_CONFIGS[asset];
                    const isActive = asset === selected;
                    return (
                        <button
                            key={asset}
                            onClick={() => onSelect(asset)}
                            className={`relative flex items-center gap-3 px-6 py-3.5 rounded-[1.5rem] font-bold text-sm whitespace-nowrap flex-shrink-0 transition-all duration-300 group ${isActive
                                    ? 'text-white'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className={`absolute inset-0 rounded-[1.5rem] ${ACCENT_CLASSES[asset]} z-0 shadow-lg`}
                                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                />
                            )}
                            <span className="relative z-10 text-xl leading-none group-hover:scale-110 transition-transform duration-300">{config.emoji}</span>
                            <div className="relative z-10 flex flex-col items-start">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                                    {asset === 'etf' ? 'Popular' : asset === 'fd' ? 'Fixed Income' : asset === 'crypto' ? 'High Risk' : 'Asset'}
                                </span>
                                <span>{config.label}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
};
