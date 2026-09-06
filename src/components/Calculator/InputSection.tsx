
"use client";

import React from "react";
import { Slider } from "../UI/Slider";
import { formatCurrency } from "@/utils/formatCurrency";
import { AssetType, calculateEMI } from "@/utils/calculateReturns";
import { Tooltip } from "../UI/Tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface InputSectionProps {
    assetType: AssetType;
    // ETF / Crypto
    initialInvestment: number;
    setInitialInvestment: (v: number) => void;
    monthlyInvestment: number;
    setMonthlyInvestment: (v: number) => void;
    annualReturnRate: number;
    setAnnualReturnRate: (v: number) => void;
    years: number;
    setYears: (v: number) => void;
    inflationRate: number;
    setInflationRate: (v: number) => void;
    stepUpPercentage: number;
    setStepUpPercentage: (v: number) => void;
    expenseRatio: number;
    setExpenseRatio: (v: number) => void;
    showInflation: boolean;
    setShowInflation: (v: boolean) => void;
    // Real Estate
    propertyValue: number;
    setPropertyValue: (v: number) => void;
    rentalYield: number;
    setRentalYield: (v: number) => void;
    appreciationRate: number;
    setAppreciationRate: (v: number) => void;
    // FD
    fdPrincipal: number;
    setFdPrincipal: (v: number) => void;
    fdRate: number;
    setFdRate: (v: number) => void;
    fdTenureMonths: number;
    setFdTenureMonths: (v: number) => void;
    compoundingFrequency: number;
    setCompoundingFrequency: (v: number) => void;
    // Loan
    loanAmount: number;
    setLoanAmount: (v: number) => void;
    loanRate: number;
    setLoanRate: (v: number) => void;
    loanTenureMonths: number;
    setLoanTenureMonths: (v: number) => void;
}

// Static Tailwind colour maps — JIT requires full class strings
const labelHover: Record<string, string> = {
    blue: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    purple: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    green: 'group-hover:text-green-600 dark:group-hover:text-green-400',
    orange: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
    yellow: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400',
    amber: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    teal: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
    cyan: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
    emerald: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    sky: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
    indigo: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
    rose: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    pink: 'group-hover:text-pink-600 dark:group-hover:text-pink-400',
};

const badgeBg: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800',
    purple: 'bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-800',
    green: 'bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-800',
    orange: 'bg-orange-50 dark:bg-orange-900/30 border-orange-100 dark:border-orange-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-100 dark:border-yellow-800',
    amber: 'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800',
    teal: 'bg-teal-50 dark:bg-teal-900/30 border-teal-100 dark:border-teal-800',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-100 dark:border-cyan-800',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800',
    sky: 'bg-sky-50 dark:bg-sky-900/30 border-sky-100 dark:border-sky-800',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800',
    rose: 'bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800',
    pink: 'bg-pink-50 dark:bg-pink-900/30 border-pink-100 dark:border-pink-800',
};

const badgeText: Record<string, string> = {
    blue: 'text-blue-700 dark:text-blue-300',
    purple: 'text-purple-700 dark:text-purple-300',
    green: 'text-green-700 dark:text-green-300',
    orange: 'text-orange-700 dark:text-orange-300',
    yellow: 'text-yellow-700 dark:text-yellow-300',
    amber: 'text-amber-700 dark:text-amber-300',
    teal: 'text-teal-700 dark:text-teal-300',
    cyan: 'text-cyan-700 dark:text-cyan-300',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    sky: 'text-sky-700 dark:text-sky-300',
    indigo: 'text-indigo-700 dark:text-indigo-300',
    rose: 'text-rose-700 dark:text-rose-300',
    pink: 'text-pink-700 dark:text-pink-300',
};

// Reusable slider row
const SliderRow = ({
    label, display, color, children, editable,
}: {
    label: string; display: string; color: string; children: React.ReactNode; editable?: React.ReactNode;
}) => (
    <div className="group">
        <div className="flex justify-between items-center mb-4">
            <label className={`text-sm font-bold text-gray-600 dark:text-gray-400 transition-colors flex items-center tracking-wide ${labelHover[color] ?? ''}`}>
                {label}
            </label>
            <div className="flex items-center gap-2">
                {editable ? (
                    <div className="w-36">
                        {editable}
                    </div>
                ) : (
                    <div className={`px-4 py-1.5 rounded-full border ${badgeBg[color] ?? 'bg-gray-50 border-gray-100'}`}>
                        <span className={`font-black text-base ${badgeText[color] ?? 'text-gray-700'}`}>{display}</span>
                    </div>
                )}
            </div>
        </div>
        <div className="relative pt-1">
            {children}
        </div>
    </div>
);

const NumberInput = ({
    value, onChange, min = 0, max = 100000000, step = 1000,
}: {
    value: number; onChange: (v: number) => void;
    min?: number; max?: number; step?: number;
}) => (
    <input
        type="number"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-black focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all text-right shadow-sm hover:shadow-md"
    />
);

const AdvancedNumberInput = ({
    label, value, onChange, suffix = '', min = 0, max = 100, step = 0.1,
}: {
    label: string; value: number; onChange: (v: number) => void;
    suffix?: string; min?: number; max?: number; step?: number;
}) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</label>
        <div className="relative group">
            <input
                type="number"
                min={min} max={max} step={step} value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all shadow-sm group-hover:shadow-md"
            />
            {suffix && <span className="absolute right-3 top-3 text-gray-400 text-xs font-bold">{suffix}</span>}
        </div>
    </div>
);

const Divider = () => (
    <div className="my-6 flex items-center gap-4">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent flex-1" />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Optimization</span>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent flex-1" />
    </div>
);

export const InputSection: React.FC<InputSectionProps> = (props) => {
    const { assetType } = props;

    const emi = assetType === 'loan'
        ? calculateEMI(props.loanAmount, props.loanRate, props.loanTenureMonths)
        : 0;

    return (
        <div className="glass p-8 lg:p-10 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/5 transition-all duration-500 hover:shadow-blue-500/5">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">
                    Parameters
                </h2>
                <div className="w-12 h-1.5 rounded-full bg-blue-500/20" />
            </div>

            <div className="space-y-10">

                {/* ── ETF ────────────────────────────────────────── */}
                {assetType === 'etf' && (<>
                    <SliderRow label="Initial Lumpsum" display={formatCurrency(props.initialInvestment)} color="blue" editable={<NumberInput value={props.initialInvestment} onChange={props.setInitialInvestment} max={10000000} step={1000} />}>
                        <Tooltip content="The one-time amount you invest at the start of the period." />
                        <Slider value={[props.initialInvestment]} onValueChange={(v) => props.setInitialInvestment(v[0])} min={0} max={10000000} step={1000} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Monthly SIP" display={formatCurrency(props.monthlyInvestment)} color="purple" editable={<NumberInput value={props.monthlyInvestment} onChange={props.setMonthlyInvestment} max={500000} step={500} />}>
                        <Tooltip content="Systematic Investment Plan: The fixed amount you invest every month." />
                        <Slider value={[props.monthlyInvestment]} onValueChange={(v) => props.setMonthlyInvestment(v[0])} min={0} max={500000} step={500} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Expected Return (p.a)" display={`${props.annualReturnRate}%`} color="green" editable={<NumberInput value={props.annualReturnRate} onChange={props.setAnnualReturnRate} min={1} max={30} step={0.5} />}>
                        <Slider value={[props.annualReturnRate]} onValueChange={(v) => props.setAnnualReturnRate(v[0])} min={1} max={30} step={0.5} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Time Period" display={`${props.years} Yrs`} color="orange" editable={<NumberInput value={props.years} onChange={props.setYears} min={1} max={60} step={1} />}>
                        <Slider value={[props.years]} onValueChange={(v) => props.setYears(v[0])} min={1} max={60} step={1} className="py-2" />
                    </SliderRow>

                    <Divider />

                    <div className="grid grid-cols-2 gap-6 bg-gray-50/50 dark:bg-gray-900/30 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1">
                                <AdvancedNumberInput label="Step-up SIP (%)" value={props.stepUpPercentage} onChange={props.setStepUpPercentage} suffix="%" min={0} max={50} step={1} />
                                <Tooltip content="The percentage by which you increase your monthly SIP every year (e.g., 10% annual increase)." />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1">
                                <AdvancedNumberInput label="Expense Ratio (%)" value={props.expenseRatio} onChange={props.setExpenseRatio} suffix="%" min={0} max={5} step={0.01} />
                                <Tooltip content="The annual fee charged by the fund (ETF/Mutual Fund) to manage your investment. Lower is better!" />
                            </div>
                        </div>
                    </div>

                    {/* Inflation Toggle */}
                    <div className="p-6 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-white/5 transition-all hover:bg-blue-50/50 dark:hover:bg-blue-900/20">
                        <div
                            className="flex items-center justify-between mb-2 cursor-pointer group"
                            onClick={() => props.setShowInflation(!props.showInflation)}
                        >
                            <label className="text-sm font-black text-gray-700 dark:text-gray-300 cursor-pointer select-none group-hover:text-blue-600 transition-colors">Adjust for Inflation</label>
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${props.showInflation ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                <motion.div 
                                    layout
                                    className={`w-4 h-4 bg-white rounded-full shadow-lg ${props.showInflation ? 'ml-auto' : ''}`} 
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </div>
                        </div>
                        <AnimatePresence>
                            {props.showInflation && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden pt-4"
                                >
                                    <div className="flex justify-between items-center text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
                                        <span>Annual Rate</span>
                                        <span>{props.inflationRate}%</span>
                                    </div>
                                    <Slider value={[props.inflationRate]} onValueChange={(v) => props.setInflationRate(v[0])} min={0} max={15} step={0.5} className="w-full" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>)}

                {/* ── CRYPTO ─────────────────────────────────────── */}
                {assetType === 'crypto' && (<>
                    <SliderRow label="Initial Investment" display={formatCurrency(props.initialInvestment)} color="orange" editable={<NumberInput value={props.initialInvestment} onChange={props.setInitialInvestment} max={10000000} step={1000} />}>
                        <Slider value={[props.initialInvestment]} onValueChange={(v) => props.setInitialInvestment(v[0])} min={0} max={10000000} step={1000} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Monthly DCA" display={formatCurrency(props.monthlyInvestment)} color="amber" editable={<NumberInput value={props.monthlyInvestment} onChange={props.setMonthlyInvestment} max={500000} step={500} />}>
                        <Slider value={[props.monthlyInvestment]} onValueChange={(v) => props.setMonthlyInvestment(v[0])} min={0} max={500000} step={500} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Avg Annual Return" display={`${props.annualReturnRate}%`} color="yellow" editable={<NumberInput value={props.annualReturnRate} onChange={props.setAnnualReturnRate} min={-50} max={200} step={1} />}>
                        <Slider value={[props.annualReturnRate]} onValueChange={(v) => props.setAnnualReturnRate(v[0])} min={-50} max={200} step={1} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Time Period" display={`${props.years} Yrs`} color="orange" editable={<NumberInput value={props.years} onChange={props.setYears} min={1} max={20} step={1} />}>
                        <Slider value={[props.years]} onValueChange={(v) => props.setYears(v[0])} min={1} max={20} step={1} className="py-2" />
                    </SliderRow>
                    <div className="p-5 bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-white/5 text-xs font-medium text-orange-700 dark:text-orange-300 leading-relaxed">
                        <span className="font-black text-orange-600 block mb-1">⚠️ VOLATILITY WARNING</span>
                        Crypto assets are highly volatile. This estimate uses a smooth average return, which may not reflect real-world price swings.
                    </div>
                </>)}

                {/* ── REAL ESTATE ────────────────────────────────── */}
                {assetType === 'realestate' && (<>
                    <SliderRow label="Property Value" display={formatCurrency(props.propertyValue)} color="emerald" editable={<NumberInput value={props.propertyValue} onChange={props.setPropertyValue} min={500000} max={100000000} step={100000} />}>
                        <Slider value={[props.propertyValue]} onValueChange={(v) => props.setPropertyValue(v[0])} min={500000} max={100000000} step={100000} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Annual Appreciation" display={`${props.appreciationRate}%`} color="teal" editable={<NumberInput value={props.appreciationRate} onChange={props.setAppreciationRate} min={0} max={25} step={0.5} />}>
                        <Slider value={[props.appreciationRate]} onValueChange={(v) => props.setAppreciationRate(v[0])} min={0} max={25} step={0.5} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Gross Rental Yield (p.a)" display={`${props.rentalYield}%`} color="cyan" editable={<NumberInput value={props.rentalYield} onChange={props.setRentalYield} min={0} max={10} step={0.5} />}>
                        <Slider value={[props.rentalYield]} onValueChange={(v) => props.setRentalYield(v[0])} min={0} max={10} step={0.5} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Time Period" display={`${props.years} Yrs`} color="green" editable={<NumberInput value={props.years} onChange={props.setYears} min={1} max={30} step={1} />}>
                        <Slider value={[props.years]} onValueChange={(v) => props.setYears(v[0])} min={1} max={30} step={1} className="py-2" />
                    </SliderRow>
                </>)}

                {/* ── BANK FD ────────────────────────────────────── */}
                {assetType === 'fd' && (<>
                    <SliderRow label="Principal Amount" display={formatCurrency(props.fdPrincipal)} color="sky" editable={<NumberInput value={props.fdPrincipal} onChange={props.setFdPrincipal} min={1000} max={50000000} step={1000} />}>
                        <Slider value={[props.fdPrincipal]} onValueChange={(v) => props.setFdPrincipal(v[0])} min={1000} max={50000000} step={1000} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Interest Rate (p.a)" display={`${props.fdRate}%`} color="indigo" editable={<NumberInput value={props.fdRate} onChange={props.setFdRate} min={3} max={12} step={0.1} />}>
                        <Slider value={[props.fdRate]} onValueChange={(v) => props.setFdRate(v[0])} min={3} max={12} step={0.1} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Tenure" display={`${props.fdTenureMonths} mo`} color="blue" editable={<NumberInput value={props.fdTenureMonths} onChange={props.setFdTenureMonths} min={1} max={120} step={1} />}>
                        <Slider value={[props.fdTenureMonths]} onValueChange={(v) => props.setFdTenureMonths(v[0])} min={1} max={120} step={1} className="py-2" />
                    </SliderRow>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Compounding Frequency</label>
                        <select
                            value={props.compoundingFrequency}
                            onChange={(e) => props.setCompoundingFrequency(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-sky-500/50 focus:outline-none transition-all shadow-sm hover:shadow-md cursor-pointer"
                        >
                            <option value={12}>Monthly</option>
                            <option value={4}>Quarterly</option>
                            <option value={2}>Half-yearly</option>
                            <option value={1}>Yearly</option>
                        </select>
                    </div>
                </>)}

                {/* ── LOAN ───────────────────────────────────────── */}
                {assetType === 'loan' && (<>
                    <SliderRow label="Loan Amount" display={formatCurrency(props.loanAmount)} color="rose" editable={<NumberInput value={props.loanAmount} onChange={props.setLoanAmount} min={10000} max={100000000} step={10000} />}>
                        <Slider value={[props.loanAmount]} onValueChange={(v) => props.setLoanAmount(v[0])} min={10000} max={100000000} step={10000} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Interest Rate (p.a)" display={`${props.loanRate}%`} color="pink" editable={<NumberInput value={props.loanRate} onChange={props.setLoanRate} min={1} max={30} step={0.1} />}>
                        <Slider value={[props.loanRate]} onValueChange={(v) => props.setLoanRate(v[0])} min={1} max={30} step={0.1} className="py-2" />
                    </SliderRow>
                    <SliderRow label="Loan Tenure" display={`${props.loanTenureMonths} mo`} color="purple" editable={<NumberInput value={props.loanTenureMonths} onChange={props.setLoanTenureMonths} min={6} max={360} step={6} />}>
                        <Slider value={[props.loanTenureMonths]} onValueChange={(v) => props.setLoanTenureMonths(v[0])} min={6} max={360} step={6} className="py-2" />
                    </SliderRow>
                    {/* Live EMI */}
                    <div className="p-8 bg-rose-50/50 dark:bg-rose-900/10 rounded-[2rem] border border-rose-100 dark:border-white/5 text-center shadow-inner">
                        <p className="text-[10px] text-rose-500 dark:text-rose-400 font-black uppercase tracking-[0.2em] mb-3">Calculated Monthly EMI</p>
                        <p className="text-4xl font-black text-rose-600 dark:text-rose-400 tracking-tight">{formatCurrency(Math.round(emi))}</p>
                    </div>
                </>)}

            </div>
        </div>
    );
};
