
import { AssetType } from './calculateReturns';

export interface AssetConfig {
    label: string;
    emoji: string;
    accentColor: string;       // Tailwind color token (e.g. 'blue')
    gradientFrom: string;
    gradientTo: string;
    description: string;
    infoBlurbs: { title: string; color: string; body: string }[];
}

export const ASSET_CONFIGS: Record<AssetType, AssetConfig> = {
    etf: {
        label: 'ETF / MF',
        emoji: '📈',
        accentColor: 'blue',
        gradientFrom: '#3b82f6',
        gradientTo: '#8b5cf6',
        description: 'Calculate SIP returns on ETFs & Mutual Funds. Account for step-up SIP, expense ratio, and inflation.',
        infoBlurbs: [
            { title: 'Power of Compounding', color: 'blue', body: 'Your money works for you over time. Reinvested earnings generate their own earnings, leading to exponential growth.' },
            { title: 'Step-up SIP', color: 'purple', body: 'Increasing your SIP by even 5–10% annually can drastically increase your final corpus compared to a fixed SIP.' },
            { title: 'Expense Ratio', color: 'green', body: 'Lower expense ratios in ETFs mean higher take-home returns. A 0.5% difference can cost lakhs over 20 years.' },
        ],
    },
    crypto: {
        label: 'Crypto',
        emoji: '₿',
        accentColor: 'orange',
        gradientFrom: '#f97316',
        gradientTo: '#eab308',
        description: 'Estimate returns on cryptocurrency investments. High risk, high reward — plan accordingly.',
        infoBlurbs: [
            { title: 'High Volatility', color: 'orange', body: 'Crypto markets can swing 50%+ in a year. This calculator uses your expected annual return as a smooth average.' },
            { title: 'No Custody Fees', color: 'yellow', body: 'Unlike ETFs, crypto has no standard expense ratio but consider exchange fees and gas costs.' },
            { title: 'Diversify', color: 'red', body: 'Never put more than you can afford to lose. Crypto should be a small, speculative portion of a balanced portfolio.' },
        ],
    },
    realestate: {
        label: 'Real Estate',
        emoji: '🏠',
        accentColor: 'emerald',
        gradientFrom: '#10b981',
        gradientTo: '#06b6d4',
        description: 'Project returns from property investment including capital appreciation and rental income.',
        infoBlurbs: [
            { title: 'Dual Returns', color: 'emerald', body: 'Real estate earns through both capital appreciation (property price rising) and rental income — a powerful combination.' },
            { title: 'Rental Yield', color: 'cyan', body: 'Typical Indian metro rental yields are 2–4% p.a. Tier-2 cities can offer higher yields with lower entry costs.' },
            { title: 'Illiquidity Risk', color: 'green', body: 'Real estate is not easily liquidated. Factor in stamp duty, registration, and brokerage when calculating actual gains.' },
        ],
    },
    fd: {
        label: 'Bank FD',
        emoji: '🏦',
        accentColor: 'sky',
        gradientFrom: '#0ea5e9',
        gradientTo: '#6366f1',
        description: 'Calculate maturity amount and interest earned on a Fixed Deposit with flexible compounding.',
        infoBlurbs: [
            { title: 'Guaranteed Returns', color: 'sky', body: 'FDs offer capital protection and fixed returns — ideal for risk-averse investors saving for a goal.' },
            { title: 'Compounding Matters', color: 'indigo', body: 'Quarterly compounding gives slightly better returns than yearly. The difference grows with a larger corpus.' },
            { title: 'Tax on Interest', color: 'blue', body: 'FD interest is fully taxable per your income slab. TDS is deducted if annual interest exceeds ₹40,000.' },
        ],
    },
    loan: {
        label: 'Loan',
        emoji: '🏛️',
        accentColor: 'rose',
        gradientFrom: '#f43f5e',
        gradientTo: '#a855f7',
        description: 'Calculate your EMI, total interest outgo, and amortisation schedule for any loan.',
        infoBlurbs: [
            { title: 'EMI Breakdown', color: 'rose', body: 'Every EMI repays both principal and interest. Early EMIs are mostly interest; later EMIs are mostly principal repayment.' },
            { title: 'Prepayment Benefit', color: 'purple', body: 'Prepaying even a small lump-sum early in the loan tenure can save lakhs in total interest paid.' },
            { title: 'Compare Rates', color: 'pink', body: 'Even a 0.5% difference in home loan rates translates to significant savings over a 20-year loan tenure.' },
        ],
    },
};
