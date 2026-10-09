export type CurrencyCode = "INR" | "USD";

export const DEFAULT_USD_RATE = 86.5;

export const getActiveCurrency = (): CurrencyCode => {
    if (typeof window === "undefined") return "INR";
    try {
        const saved = localStorage.getItem("wealthCalc_currency");
        return (saved === "USD" ? "USD" : "INR") as CurrencyCode;
    } catch {
        return "INR";
    }
};

export const getActiveExchangeRate = (): number => {
    if (typeof window === "undefined") return DEFAULT_USD_RATE;
    try {
        const saved = localStorage.getItem("wealthCalc_usdRate");
        const parsed = saved ? parseFloat(saved) : NaN;
        return !isNaN(parsed) && parsed > 0 ? parsed : DEFAULT_USD_RATE;
    } catch {
        return DEFAULT_USD_RATE;
    }
};

export const getCurrencySymbol = (currency?: CurrencyCode): string => {
    const c = currency || getActiveCurrency();
    return c === "USD" ? "$" : "₹";
};

export const formatCurrency = (
    amount: number,
    overrideCurrency?: CurrencyCode,
    overrideRate?: number
): string => {
    if (isNaN(amount) || amount === null || amount === undefined) {
        return (overrideCurrency || getActiveCurrency()) === "USD" ? "$0" : "₹0";
    }

    const currency = overrideCurrency || getActiveCurrency();
    const rate = overrideRate || getActiveExchangeRate();

    if (currency === "USD") {
        const usdValue = amount / rate;
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(Math.round(usdValue));
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Math.round(amount));
};

export const formatCurrencyCompact = (
    amount: number,
    overrideCurrency?: CurrencyCode,
    overrideRate?: number
): string => {
    if (isNaN(amount) || amount === null || amount === undefined) return "0";
    const currency = overrideCurrency || getActiveCurrency();
    const rate = overrideRate || getActiveExchangeRate();

    if (currency === "USD") {
        const usdVal = amount / rate;
        if (Math.abs(usdVal) >= 1_000_000) return `$${(usdVal / 1_000_000).toFixed(2)}M`;
        if (Math.abs(usdVal) >= 1_000) return `$${(usdVal / 1_000).toFixed(1)}k`;
        return `$${Math.round(usdVal)}`;
    }

    if (Math.abs(amount) >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
    if (Math.abs(amount) >= 100_000) return `₹${(amount / 100_000).toFixed(2)} L`;
    if (Math.abs(amount) >= 1_000) return `₹${(amount / 1_000).toFixed(0)}k`;
    return `₹${Math.round(amount)}`;
};

export const formatAxisValue = (
    value: number,
    overrideCurrency?: CurrencyCode,
    overrideRate?: number
): string => {
    return formatCurrencyCompact(value, overrideCurrency, overrideRate);
};
