
export type AssetType = 'etf' | 'crypto' | 'realestate' | 'fd' | 'loan';

export interface PortfolioItem {
    id: string;
    label: string;
    config: CalculationInput;
    color?: string; // Hex color for the chart line
}

export interface CalculationResult {
    year: number;
    investedAmount: number;
    estimatedReturns: number;
    totalValue: number;
    inflationAdjustedValue?: number;
    // Real estate specific
    propertyValue?: number;
    cumulativeRental?: number;
    // Loan specific
    principalPaid?: number;
    interestPaid?: number;
    outstandingPrincipal?: number;
    // FD specific
    balance?: number;
}

export interface PortfolioYearSummary {
    year: number;
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    investedAmount: number;
    itemBreakdown: Record<string, number>; // itemId -> totalValue
}

export interface CalculationInput {
    assetType: AssetType;
    // --- ETF / Crypto ---
    initialInvestment: number;
    monthlyInvestment: number;
    annualReturnRate: number;
    years: number;
    inflationRate?: number;
    stepUpPercentage?: number;
    expenseRatio?: number;
    // --- Real Estate ---
    propertyValue?: number;
    rentalYield?: number;         // % per year of property value
    appreciationRate?: number;    // % per year
    // --- FD ---
    fdPrincipal?: number;
    fdRate?: number;              // % per year
    fdTenureMonths?: number;
    compoundingFrequency?: number; // times per year: 1=yearly, 4=quarterly, 12=monthly
    // --- Loan ---
    loanAmount?: number;
    loanRate?: number;            // % per year
    loanTenureMonths?: number;
}

// ─── ETF / Crypto Calculator ────────────────────────────────────────────────

function calcEtfCrypto(input: CalculationInput): CalculationResult[] {
    const {
        initialInvestment,
        monthlyInvestment,
        annualReturnRate,
        years,
        inflationRate = 0,
        stepUpPercentage = 0,
        expenseRatio = 0,
    } = input;

    const results: CalculationResult[] = [];
    let currentTotalValue = initialInvestment;
    let currentInvestedAmount = initialInvestment;
    const effectiveAnnualRate = annualReturnRate - expenseRatio;
    const monthlyRate = effectiveAnnualRate / 12 / 100;
    let currentMonthlyInvestment = monthlyInvestment;

    for (let year = 1; year <= years; year++) {
        for (let month = 1; month <= 12; month++) {
            currentTotalValue += currentMonthlyInvestment;
            currentInvestedAmount += currentMonthlyInvestment;
            currentTotalValue *= (1 + monthlyRate);
        }
        if (stepUpPercentage > 0) {
            currentMonthlyInvestment *= (1 + stepUpPercentage / 100);
        }
        const estimatedReturns = currentTotalValue - currentInvestedAmount;
        let inflationAdjustedValue: number | undefined;
        if (inflationRate > 0) {
            inflationAdjustedValue = currentTotalValue / Math.pow(1 + inflationRate / 100, year);
        }
        results.push({
            year,
            investedAmount: Math.round(currentInvestedAmount),
            estimatedReturns: Math.round(estimatedReturns),
            totalValue: Math.round(currentTotalValue),
            inflationAdjustedValue: inflationAdjustedValue ? Math.round(inflationAdjustedValue) : undefined,
        });
    }
    return results;
}

// ─── Real Estate Calculator ──────────────────────────────────────────────────

function calcRealEstate(input: CalculationInput): CalculationResult[] {
    const {
        propertyValue = 5000000,
        rentalYield = 3,
        appreciationRate = 8,
        years = 10,
    } = input;

    const results: CalculationResult[] = [];
    let currentPropertyValue = propertyValue;
    let cumulativeRental = 0;

    for (let year = 1; year <= years; year++) {
        // Annual rental income = rentalYield% of current property value
        const annualRental = (currentPropertyValue * rentalYield) / 100;
        cumulativeRental += annualRental;
        // Appreciate property value at end of year
        currentPropertyValue *= (1 + appreciationRate / 100);

        const totalValue = Math.round(currentPropertyValue + cumulativeRental);
        const estimatedReturns = Math.round(totalValue - propertyValue);

        results.push({
            year,
            investedAmount: Math.round(propertyValue),
            estimatedReturns,
            totalValue,
            propertyValue: Math.round(currentPropertyValue),
            cumulativeRental: Math.round(cumulativeRental),
        });
    }
    return results;
}

// ─── Bank FD Calculator ───────────────────────────────────────────────────────

function calcFD(input: CalculationInput): CalculationResult[] {
    const {
        fdPrincipal = 100000,
        fdRate = 7,
        fdTenureMonths = 60,
        compoundingFrequency = 4, // quarterly
    } = input;

    const results: CalculationResult[] = [];
    const n = compoundingFrequency;
    const rPerPeriod = fdRate / 100 / n;
    const totalYears = fdTenureMonths / 12;

    const yearsToShow = Math.max(1, Math.ceil(totalYears));

    for (let year = 1; year <= yearsToShow; year++) {
        const t = Math.min(year, totalYears);
        const balance = fdPrincipal * Math.pow(1 + rPerPeriod, n * t);
        const interestEarned = balance - fdPrincipal;
        results.push({
            year,
            investedAmount: Math.round(fdPrincipal),
            estimatedReturns: Math.round(interestEarned),
            totalValue: Math.round(balance),
            balance: Math.round(balance),
        });
    }
    return results;
}

// ─── Loan Calculator ─────────────────────────────────────────────────────────

function calcLoan(input: CalculationInput): CalculationResult[] {
    const {
        loanAmount = 1000000,
        loanRate = 10,
        loanTenureMonths = 240,
    } = input;

    const monthlyRate = loanRate / 12 / 100;
    const n = loanTenureMonths;

    // EMI formula
    const emi = monthlyRate === 0
        ? loanAmount / n
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
        (Math.pow(1 + monthlyRate, n) - 1);

    const results: CalculationResult[] = [];
    let outstandingPrincipal = loanAmount;
    let cumulativePrincipalPaid = 0;
    let cumulativeInterestPaid = 0;

    const totalYears = Math.ceil(n / 12);

    for (let year = 1; year <= totalYears; year++) {
        const monthsThisYear = year === totalYears ? ((n - 1) % 12) + 1 : 12;
        let principalThisYear = 0;
        let interestThisYear = 0;

        for (let m = 0; m < monthsThisYear && outstandingPrincipal > 0; m++) {
            const interestForMonth = outstandingPrincipal * monthlyRate;
            const principalForMonth = Math.min(emi - interestForMonth, outstandingPrincipal);
            interestThisYear += interestForMonth;
            principalThisYear += principalForMonth;
            outstandingPrincipal -= principalForMonth;
        }

        cumulativePrincipalPaid += principalThisYear;
        cumulativeInterestPaid += interestThisYear;

        results.push({
            year,
            investedAmount: Math.round(loanAmount),
            estimatedReturns: Math.round(cumulativeInterestPaid), // interest paid = "cost"
            totalValue: Math.round(cumulativePrincipalPaid + cumulativeInterestPaid),
            principalPaid: Math.round(cumulativePrincipalPaid),
            interestPaid: Math.round(cumulativeInterestPaid),
            outstandingPrincipal: Math.max(0, Math.round(outstandingPrincipal)),
        });
    }
    return results;
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────

export const calculateReturns = (input: CalculationInput): CalculationResult[] => {
    switch (input.assetType) {
        case 'realestate': return calcRealEstate(input);
        case 'fd': return calcFD(input);
        case 'loan': return calcLoan(input);
        case 'crypto':
        case 'etf':
        default: return calcEtfCrypto(input);
    }
};

export const calculatePortfolio = (items: PortfolioItem[]): PortfolioYearSummary[] => {
    if (items.length === 0) return [];

    // 1. Calculate individual results for each item
    const itemResults = items.map(item => ({
        id: item.id,
        assetType: item.config.assetType,
        results: calculateReturns(item.config)
    }));

    // 2. Find max years across all items
    const maxYears = Math.max(...itemResults.map(ir => ir.results.length));

    const summary: PortfolioYearSummary[] = [];

    for (let year = 1; year <= maxYears; year++) {
        let totalAssets = 0;
        let totalLiabilities = 0;
        let investedAmount = 0;
        const itemBreakdown: Record<string, number> = {};

        itemResults.forEach(ir => {
            const hasDataThisYear = year <= ir.results.length;
            const resultIdx = Math.min(year - 1, ir.results.length - 1);
            const result = ir.results[resultIdx];

            if (ir.assetType === 'loan') {
                const outstanding = hasDataThisYear ? (result.outstandingPrincipal ?? 0) : 0;
                totalLiabilities += outstanding;
                itemBreakdown[ir.id] = -outstanding;
            } else {
                // If tenure ended, we assume the final total value is held (no more SIPs, but it stays as an asset)
                const value = hasDataThisYear ? result.totalValue : ir.results[ir.results.length - 1].totalValue;
                const invested = hasDataThisYear ? result.investedAmount : ir.results[ir.results.length - 1].investedAmount;
                totalAssets += value;
                investedAmount += invested;
                itemBreakdown[ir.id] = value;
            }
        });

        summary.push({
            year,
            totalAssets: Math.round(totalAssets),
            totalLiabilities: Math.round(totalLiabilities),
            netWorth: Math.round(totalAssets - totalLiabilities),
            investedAmount: Math.round(investedAmount),
            itemBreakdown
        });
    }

    return summary;
};

export const calculateEMI = (loanAmount: number, annualRate: number, tenureMonths: number): number => {
    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) return loanAmount / tenureMonths;
    return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);
};
