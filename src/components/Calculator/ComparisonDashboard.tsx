
"use client";

import React from "react";
import { PortfolioItem, calculateReturns } from "@/utils/calculateReturns";
import { ASSET_CONFIGS } from "@/utils/assetConfig";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { formatCurrency } from "@/utils/formatCurrency";
import { ChartCard } from "./ChartsSection";
import { CHART_TOOLTIP_STYLE, Y_AXIS_FORMATTER, tooltipFormatter } from "./ChartConstants";

interface ComparisonDashboardProps {
    items: PortfolioItem[];
}

// Colors for the lines if item.color is not provided
const COLORS = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#06b6d4", // cyan
    "#ec4899", // pink
];

export const ComparisonDashboard: React.FC<ComparisonDashboardProps> = ({ items }) => {
    if (items.length === 0) return null;

    // 1. Calculate results for each item
    const allResults = items.map((item, idx) => ({
        id: item.id,
        label: item.label,
        color: item.color || COLORS[idx % COLORS.length],
        data: calculateReturns(item.config)
    }));

    // 2. Normalize data for Recharts (year by year)
    const maxYears = Math.max(...allResults.map(r => r.data.length));
    const chartData = [];

    for (let year = 1; year <= maxYears; year++) {
        const entry: any = { year: `Yr ${year}` };
        allResults.forEach(r => {
            // If asset tenure is shorter than max, hold the last value
            const valIdx = Math.min(year - 1, r.data.length - 1);
            entry[r.label] = r.data[valIdx].totalValue;
        });
        chartData.push(entry);
    }

    return (
        <div className="space-y-16 animate-in fade-in duration-500 pb-10">
            <ChartCard title="Returns Comparison Overlap" accent="bg-indigo-500">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                        <defs>
                            {allResults.map((r) => (
                                <linearGradient key={`grad-${r.id}`} id={`grad-${r.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={r.color} stopOpacity={0.1} />
                                    <stop offset="95%" stopColor={r.color} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickFormatter={Y_AXIS_FORMATTER}
                        />
                        <Tooltip
                            {...CHART_TOOLTIP_STYLE}
                            formatter={tooltipFormatter}
                        />
                        <Legend verticalAlign="top" height={36} />
                        {allResults.map((r) => (
                            <Area
                                key={r.id}
                                type="monotone"
                                dataKey={r.label}
                                stroke={r.color}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill={`url(#grad-${r.id})`}
                                animationDuration={1500}
                                isAnimationActive={false}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Portfolio Performance Summary</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase text-gray-400 font-bold border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-4 py-3">Asset</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Invested</th>
                                <th className="px-4 py-3">Final Value</th>
                                <th className="px-4 py-3">Growth (%)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {allResults.map((r) => {
                                const lastIdx = r.data.length - 1;
                                const invested = r.data[lastIdx].investedAmount;
                                const total = r.data[lastIdx].totalValue;
                                const growth = invested > 0 ? ((total - invested) / invested) * 100 : 0;
                                const config = ASSET_CONFIGS[items.find(i => i.id === r.id)!.config.assetType];

                                return (
                                    <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-4 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span style={{ backgroundColor: r.color }} className="w-2 h-2 rounded-full" />
                                            {r.label}
                                        </td>
                                        <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{config.label}</td>
                                        <td className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(invested)}</td>
                                        <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">{formatCurrency(total)}</td>
                                        <td className={`px-4 py-4 font-bold ${growth >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                                            {growth.toFixed(1)}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
